import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild, NgZone, TemplateRef, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { InnowayApiService } from '../../services/innoway/innoway-api.service';
import { InnowayAuthService } from '../../services/innoway/innoway-auth.service';
import { InnowayConfigService } from '../../services/innoway/innoway-config.service';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireStorage } from 'angularfire2/storage';
import 'rxjs/add/operator/map';
import { finalize } from 'rxjs/operators';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Observable } from 'rxjs';
import { HttpClient, HttpRequest, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments';
import MeteorEmoji from '../../../assets/js/meteorEmoji.min.js'
import { Subscription } from 'rxjs';
declare let swal: any;
declare let $: any;
@Component({
  templateUrl: 'chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
  // Default values
  defautlAvatarUrl: string = 'https://scontent.fsgn8-1.fna.fbcdn.net/v/t1.0-1/c29.0.100.100/p100x100/10354686_10150004552801856_220367501106153455_n.jpg?_nc_cat=1&oh=d0b14ace509ec5cc84330ae9eb14fbee&oe=5C2C7E77';
  defautlNameUser: string = '';
  currentUserId: string;
  currentStaffId: string;
  currentStaffUsername: string;
  currentStaffFirstName: string;
  currentStaffLastName: string;
  currentStaffEmail: string;
  currentStaffAvatarUrl: string;


  // Data from firebase (auto reloaded)
  items: any;
  currentGroup: any = {};
  listGroupsFromFirebase: any;
  listMessages: any = [];
  listStaffs: any = [];
  lastLoadedMessageDoc: any;
  typeMessage: string;
  typeFileModal: string;
  selectedGroupId: string;
  selectedIdStudent: any;

  // Firebase documents class (used for retrieving data and uploading data)
  messagesDocument: any;
  inRoomStatesDocument: any;
  staffsDocument: any;
  newMessageDocument: any;
  currentGroupDocument: any;
  isGettingFirstTenMessages: boolean = false;

  // Other values
  initialized: boolean = false;
  chosenFile: File = null;
  modalRef: BsModalRef;
  nameFile: any;
  sizeFile: any;
  uploadingPercent: number;
  departmentId: string;

  //student + department + building + room
  listStudentsFromDepartment: any = [];
  listStudentsFromDepartmentMerged: any = [];
  listDepartments: any = [];
  listBuildings: any;
  listRoomsFromBuilding: any;
  listStudentsFromRoom: any;
  buildingSelected: any;
  roomSelected: any = null;
  floor: number = null;
  roomCriteria: any;
  departmentSelected: any;
  loadMessageWhenLoadFirstPage: boolean = true;
  hasBuilding: boolean = false;

  //query
  sortName: any = 'name';
  sortType: any = 'desc';
  pageSize: any = '10';
  pageIndex: any = '0';
  query: any = {};

  //dropdown
  isDropup = true;
  loadingDropup: boolean = false;
  loadingUploadFile: boolean = false;
  loadingMoreMessage: boolean = false;
  loadingMoreStudent: boolean = false;

  //FCM topic
  urlFCM: string;
  headerFCM: any;
  keyFCM: string;
  dataFCM: any;

  //input search student
  searchRef: any;
  searchTimeOut: number = 250;
  infoCriteria: any = [];
  inputSearch: string;
  hasRoom: boolean = true;
 
  @ViewChild('fileUploader')
  fileUploaderElementRef: ElementRef;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ref: ChangeDetectorRef,
    private ngZone: NgZone,
    public innowayApi: InnowayApiService,
    public innowayAuth: InnowayAuthService,
    public innowayConfig: InnowayConfigService,
    public db: AngularFirestore,
    public storage: AngularFireStorage,
    private modalService: BsModalService,
    private http: HttpClient) {
    this.currentUserId = this.innowayConfig.user_id_firebase;
    this.currentStaffUsername = this.innowayConfig.username;
    this.currentStaffAvatarUrl = this.innowayConfig.avatarUrl;
    this.currentStaffEmail = this.innowayConfig.email;
    this.currentStaffFirstName = this.innowayConfig.firstName;
    this.currentStaffLastName = this.innowayConfig.lastName;
    this.currentStaffId = this.innowayConfig.user_id_firebase;
  }

  async ngOnInit() {
    $.getScript('../../../assets/js/meteorEmoji.js');
    this.meteorEmoji();
    this.scrollBottom();
    await this.getListDepartments();
    await this.getListBuildings();
    await this.getListRoomsFromBuilding(this.listBuildings[0]);
    await this.getListStudentsFromRoom(this.listRoomsFromBuilding[0],this.floor);
  }

  async ngOnDestroy(){
    if (!this.isEmpty(this.currentGroup)){
      this.inRoomStatesDocument.doc(this.currentUserId).update({
        [this.currentUserId]: false
      });
    }
  }
  meteorEmoji() {
    (() => {
      new MeteorEmoji()
    })()
  }
  getFirstTenMessages(group_id: string) {
    this.messagesDocument = this.db.collection(`chat_rooms/${group_id}/messages`, ref => ref.orderBy('timestamp', 'desc').limit(10));
    this.isGettingFirstTenMessages = true;
    const subscriptionGetFirstTenMessages: Subscription = this.messagesDocument.snapshotChanges().subscribe(
      res => {
        if (!this.isGettingFirstTenMessages) {
          return;
        }
        res.reverse();
        const list_messages: any = [];
        for (let i = 0; i < res.length; i++) {
          list_messages.push(res[i].payload.doc.data());
        }
        this.listMessages = list_messages;
        this.lastLoadedMessageDoc = res[0];
        this.scrollBottomChangeGroup();
        this.subscribleNewMessage();
        //subscriptionGetFirstTenMessages.unsubscribe();
        this.isGettingFirstTenMessages = false;
      },
      err => console.log('onError: %s', err),
      () => console.log('onCompleted'));
  }

  getListStaffs(group_id: string) {
    this.staffsDocument = this.db.collection(`chat_rooms/${group_id}/staffs`, ref => ref);
    const subscriptionGetFirstTenMessages: Subscription = this.staffsDocument.snapshotChanges().subscribe(
      res => {
        const list_staffs: any = [];
        for (let i = 0; i < res.length; i++) {
          list_staffs.push(res[i].payload.doc.data());
        }
        this.listStaffs = list_staffs;
      },
      err => console.log('onError: %s', err),
      () => console.log('onCompleted'));
  }

  getNextTenMessages(group_id: string) {
    this.messagesDocument = this.db.collection(`chat_rooms/${group_id}/messages`, ref => ref.orderBy('timestamp', 'desc').startAfter(this.lastLoadedMessageDoc.payload.doc).limit(10));
    const subscriptionGetNextTenMessages: Subscription = this.messagesDocument.snapshotChanges().subscribe(
      res => {
        res.reverse();
        for (let i = 0; i < res.length; i++) {
          this.listMessages.unshift(res[i].payload.doc.data());
        }
        this.lastLoadedMessageDoc = res[0];
        this.loadingMoreMessage = false;
        subscriptionGetNextTenMessages.unsubscribe();
      },
      err => console.log('onError: %s', err),
      () => console.log('onCompleted'));
  }

  changeGroup(chatRoom) {
    if (this.currentGroup.id === chatRoom.idGroup) {
      return;
    }
    this.selectedIdStudent = chatRoom.student.id;
    this.loadingUploadFile = true;
    if (chatRoom.idGroup === '') {
      const data = {
        department: chatRoom.department, 
        lastMessage: {
          content: '',
          seen: {},
          timestamp: '',
          type: '',
          fileName: '',
          userId: ''
        },
        staffIDs: {
          [this.currentUserId] : true
        },
        student: chatRoom.student
      };
      this.db.collection<{}>('chat_rooms').add(data);
      let newRoomChat = this.db.collection<{}>('chat_rooms', ref => {
        let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
        if (this.departmentId) { query = query.where('department.id', '==', this.departmentId) };
        return query;
      }).snapshotChanges().map(actions => {
        const result: any = actions.map<{}>(a => {
          const data = a.payload.doc.data() as {};
          const id = a.payload.doc.id;
          return { id, ...data };
        });
        this.listGroupsFromFirebase = result;
        for (let i = 0; i < result.length; i++){
          if (chatRoom.department.id === result[i].department.id && this.selectedIdStudent === result[i].student.id){
            chatRoom.idGroup = result[i].id;
          }
        }
        this.getChatGroupFromFirebase(chatRoom);
        return result;
      }).subscribe();
    } else {
      this.getChatGroupFromFirebase(chatRoom);
    }
  }

  getChatGroupFromFirebase(chatRoom){
    this.selectedGroupId = chatRoom.idGroup;
    this.getFirstTenMessages(chatRoom.idGroup);
    this.getListStaffs(chatRoom.idGroup);
    for (let i = 0; i < this.listGroupsFromFirebase.length; i++) {
      const item = this.listGroupsFromFirebase[i];
      if (item.id === chatRoom.idGroup) {
        this.currentGroup = item;
        break;
      }
    }
    if (!this.isEmpty(this.currentGroup)){
      this.inRoomStatesDocument = this.db.collection(`chat_rooms/${this.currentGroup.id}/inRoomStates`, ref => ref);
      this.inRoomStatesDocument.doc(this.currentUserId).update({
        [this.currentUserId]: false
      });
    }
    this.inRoomStatesDocument = this.db.collection(`chat_rooms/${chatRoom.idGroup}/inRoomStates`, ref => ref);
    this.inRoomStatesDocument.doc(this.currentUserId).set({
      [this.currentUserId]: true,
    });
    this.staffsDocument = this.db.collection(`chat_rooms/${chatRoom.idGroup}/staffs`, ref => ref);
    this.staffsDocument.doc(this.currentUserId).set({
      [this.currentUserId]: {
        id: this.currentUserId,
        avatarUrl: this.currentStaffAvatarUrl,
        firstName: this.currentStaffFirstName,
        lastName: this.currentStaffLastName,
        email: this.currentStaffEmail
      }
    });
    // Function subcribe new message 
    this.currentGroupDocument = this.db.collection<{}>('chat_rooms').doc(chatRoom.idGroup);
    //New group, have no staff in room
    if (this.isEmpty(this.currentGroup.staffIDs)){
      const staffIDs = { [this.currentUserId]: true};
      this.currentGroupDocument.update({
        staffIDs: staffIDs
      });
    } else {
      for (var staff in this.currentGroup.staffIDs){
        if (this.currentUserId !== this.currentGroup.staffIDs[staff]) {
          const staffIDs = this.currentGroup.staffIDs;
          staffIDs[this.currentUserId] = true;
          this.currentGroupDocument.update({
            staffIDs: staffIDs
          });
        }
      }
    }
    if (!this.isEmpty(this.currentGroup.lastMessage.seen)){
      for (var idSeen in this.currentGroup.lastMessage.seen){
        if (this.currentUserId !== this.currentGroup.lastMessage.seen[idSeen]){
          const listIdsSeen = this.currentGroup.lastMessage.seen;
          listIdsSeen[this.currentUserId] = true;
          this.currentGroupDocument.update({
            lastMessage: {
              seen: listIdsSeen,
              content: this.currentGroup.lastMessage.content,
              timestamp: this.currentGroup.lastMessage.timestamp,
              type: this.currentGroup.lastMessage.type,
              fileName: this.currentGroup.lastMessage.fileName,
              userId: this.currentGroup.lastMessage.userId
            },
          });
        }
      }
    }
  }
  getAvatarOfUser(userId) {
    if (this.currentGroup.student.id === userId) {
      if (this.currentGroup.student.avatar !== '' && this.currentGroup.student.avatar !== null) {
        return this.currentGroup.student.avatar;
      } else {
        return this.defautlAvatarUrl;
      }
    }
    if (this.listStaffs.length > 0){
      for (let i = 0; i < this.listStaffs.length; i++){
        const item = this.listStaffs[i];
        if(item.hasOwnProperty(userId)){
          return item[userId].avatarUrl;
        }
      }
    }
    return this.defautlAvatarUrl;
  }

  getNameOfUser(userId) {
    if (this.currentGroup.student.id === userId) {
      if (this.currentGroup.student.lastName !== null && this.currentGroup.student.firstName !== null){
        return this.currentGroup.student.lastName + ' ' + this.currentGroup.student.firstName;
      } else {
        return this.currentGroup.student.username;
      }
    } else {
      for (let i = 0; i < this.listStaffs.length; i++) {
        const item = this.listStaffs[i];
        if(item.hasOwnProperty(userId)){
          return item[userId].lastName + ' ' + item[userId].firstName;
        }
      }
    }
    return this.defautlNameUser;
  }

  uploadChosenFile() {
    this.loadingUploadFile = true;
    if (!this.chosenFile) {
      this.alertPleaseChooseAFile();
      return;
    }

    const filePath = `${this.currentGroup.id}/${this.chosenFile.name}-${this.chosenFile.lastModified}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, this.chosenFile);

    task.percentageChanges().subscribe(
      value => this.uploadingPercent = value,
      error => console.log('percentageChanges() onError', error),
      () => console.log('percentageChanges() onComplete')
    );

    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe(
          value => {
            this.sendMessageWithType(value, this.typeFileModal, this.chosenFile.name);
            this.loadingUploadFile = false;
          },
          error => console.log('getDownloadURL() onError', error),
          () => console.log('getDownloadURL() onComplete'));
      })
    ).subscribe(
      res => {
        this.modalService.hide(1);
      },
      err => console.log('onError: %s', err),
      () => console.log('onCompleted')
    );

  }

  sendMessage(messageInput: any) {
    const checkSpace = messageInput.value.replace(/^\s+/, '').replace(/\s+$/, '');
    if (checkSpace === '') {
      return;
    } else {
      const mess = messageInput.value;
      this.sendMessageWithType(mess, 'text', '');
      messageInput.value = null;
    }
  }

  async openFileSendingConfirmDialog(event: any, template: TemplateRef<any>) {
    if (event.target.files && event.target.files[0]) {
      const typeFile: any = event.target.files[0].type.split('/');
      switch (typeFile[0]) {
        case 'image':
          this.typeFileModal = 'image';
          const reader = new FileReader();
          reader.readAsDataURL(event.target.files[0]); // read file as data url
          reader.onload = (event) => { // called once readAsDataURL is completed
            this.nameFile = event;
            this.nameFile = this.nameFile.target.result;
          };
          break;
        default:
          this.typeFileModal = 'file';
          this.nameFile = event.target.files[0].name;
          this.sizeFile = this.formatSizeUnits(event.target.files[0].size);
          break;
      }
    }
    this.chosenFile = this.fileUploaderElementRef.nativeElement.files[0];
    this.modalRef = this.modalService.show(template);
    this.ref.detectChanges();
  }

  sendMessageWithType(message: string, messageType: string, fileName: string) {
    const currentTime = `${new Date().getTime()}`;
    this.messagesDocument.doc(currentTime).set({
      content: message,
      type: messageType,
      fileName: fileName,
      userId: this.currentUserId,
      timestamp: currentTime
    });
    this.currentGroupDocument.update({
      lastMessage: {
        content: message,
        seen: {
          [this.currentUserId] : true
        } ,
        timestamp: currentTime,
        type: messageType,
        fileName: fileName,
        userId: this.currentUserId
      }
    });

    this.getFirstTenMessages(this.currentGroup.id);
    setTimeout(() => {
      this.scrollBottom();
    }, 100);
    // Send FCM topic
    this.urlFCM = 'https://fcm.googleapis.com/fcm/send';
    this.keyFCM = environment.innoway.legacyServerKey;
    this.dataFCM = {
      'to': `/topics/${this.currentGroup.student.id}`,
      'data': {
        'body': message,
        'title': 'Bạn vừa nhận được tin nhắn mới',
        'action': 'chat',
        'departmentId': this.departmentId
      }
    };
    this.headerFCM = {
      'Authorization': this.keyFCM,
      'Content-Type': 'application/json'
    }
    const httpHeader = new HttpHeaders(this.headerFCM);
    const req = new HttpRequest('POST', this.urlFCM, this.dataFCM, { headers: httpHeader });
    return this.http.request(req).toPromise()
      .then(res => {
        res
      }
      );

  }

  scrollBottom() {
    const myDiv = $('.messages').get(0);
    myDiv.scrollTop = myDiv.scrollHeight;
  }

  scrollBottomChangeGroup() {
    setTimeout(() => {
      const myDiv = $('.messages').get(0);
      myDiv.scrollTop = myDiv.scrollHeight;
      this.loadingUploadFile = false;
    }, 1500);
  }
  async alertPleaseChooseAFile() {
    return await swal({
      title: 'Vui lòng chọn file',
      type: 'warning',
      timer: 1000,
    });
  }

  formatSizeUnits(bytes) {
    if (bytes >= 1073741824) {
      bytes = (bytes / 1073741824).toFixed(2) + ' GB';
    } else if (bytes >= 1048576) {
      bytes = (bytes / 1048576).toFixed(2) + ' MB';
    } else if (bytes >= 1024) {
      bytes = (bytes / 1024).toFixed(2) + ' KB';
    } else if (bytes > 1) {
      bytes = bytes + ' bytes';
    } else if (bytes === 1) {
      bytes = bytes + ' byte';
    } else { bytes = '0 byte'; }
    return bytes;
  }

  getListStudentsFromDepartment(department) {
    this.departmentSelected = department;
    this.loadingDropup = true;
    this.departmentId = department.id;
    this.items = this.db.collection<{}>('chat_rooms', ref => {
      let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
      if (this.departmentId) { query = query.where('department.id', '==', this.departmentId) };
      return query;
    }).snapshotChanges().map(actions => {
      const result = actions.map<{}>(a => {
        const data = a.payload.doc.data() as {};
        const id = a.payload.doc.id;
        return { id, ...data };
      });
      this.listGroupsFromFirebase = result;
      this.mapGroupFirebaseWithListStudents(department);
      return result;
    }).subscribe();
  }

  async getListDepartments() {
    try {
      const query = Object.assign({
        sortBy: this.sortName,
        sortType: this.sortType
      }, this.query);
      this.listDepartments = await this.innowayApi.department.getList({ query });
      this.ref.detectChanges();
    } catch (err) {

    }
  }

  isEmpty(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  }

  scrollLoadListMessages(event) {
    if ($('.messages').get(0).scrollTop == 0) {
      this.getNextTenMessages(this.currentGroup.id);
      this.loadingMoreMessage = true;
    }
  }

  subscribleNewMessage() {
    this.newMessageDocument = this.db.collection(`chat_rooms/${this.selectedGroupId}/messages`, ref => ref.orderBy('timestamp', 'desc').limit(1));
    this.newMessageDocument.snapshotChanges().subscribe(
      res => {
        const checkSelectedGroupId: boolean = res[0].payload.doc.ref.path.includes(this.selectedGroupId);
        if (checkSelectedGroupId){
          const IdCurrentGroup = this.currentGroup.id;
          const subscribleGroupDocument = this.db.collection<{}>('chat_rooms').doc(IdCurrentGroup).snapshotChanges().subscribe(res => {
            if (checkSelectedGroupId){
              this.currentGroup =  res.payload.data();
              this.currentGroup['id'] = IdCurrentGroup;
            }
          });
          const newMessage = res[0].payload.doc.data();
          let isExist: boolean = false;
          for (let i = 0; i < this.listMessages.length; i++) {
            if (this.listMessages[i].timestamp === newMessage.timestamp && this.listMessages[i].content === newMessage.content) {
              isExist = true;
            }
          }
          if (!isExist) {
            const listIdsSeen = this.currentGroup.lastMessage.seen;
            this.listMessages.push(newMessage);
            listIdsSeen[this.currentUserId] = true;
            this.currentGroupDocument.update({
              lastMessage: {
                seen: listIdsSeen,
                content: newMessage.content,
                timestamp: newMessage.timestamp,
                type: newMessage.type,
                fileName: newMessage.fileName,
                userId: newMessage.userId
              },
            });
            setTimeout(() => {
              this.scrollBottom();
            }, 100);
          }
        }
      },
      err => console.log('onError: %s', err),
      () => console.log('onCompleted'));
  }

  async getListBuildings() {
    try {
      const query = Object.assign({
        sortBy: 'name',
        sortType: 'DESC',
      }, this.query);
      this.listBuildings = await this.innowayApi.building.getList({ query });
      this.listBuildings.unshift({ id: null, name: 'Tất cả' });
      this.ref.detectChanges();
    } catch (err) {
      console.log('err: ', err);
    }
  }

  async getListRoomsFromBuilding(building) {
    if (building.id !== null){
      this.hasBuilding = true;
    }
    this.buildingSelected = building;
    try {
      this.listRoomsFromBuilding = await this.innowayApi.building.getListRooms(building.id);
      this.listRoomsFromBuilding.unshift({
        id: null,
        name: 'Tất cả'
      });
      this.ref.detectChanges();
    } catch (err) {
      this.listRoomsFromBuilding = [{
        id: null,
        name: 'Tất cả'
      }];
    }
    if (this.listRoomsFromBuilding && this.listRoomsFromBuilding.length > 0) {
      await this.getListStudentsFromRoom(this.listRoomsFromBuilding[0], this.floor);
    }
  }

  async getListStudentsFromRoom(room, floor) {
    if (!this.hasRoom) {
      this.roomCriteria = {
        roomCriteria: {
          hasRoom: false
        },
        infoCriteria: {
          username: this.inputSearch
        }
      };
    } else if (room.id === null) {
      this.roomSelected = room;
      this.roomCriteria = {
        roomCriteria: {
          building: this.buildingSelected.id,
          room: null,
          hasRoom: true,
          floor: floor
        },
        infoCriteria: {
          username: this.inputSearch
        }
      };
    } else {
      this.roomSelected = room;
      this.roomCriteria = {
        roomCriteria: {
          building: this.buildingSelected.id,
          room: this.roomSelected.name,
          floor: floor
        },
        infoCriteria: {
          username: this.inputSearch
        }
      };
      if (!this.roomSelected.id && !this.buildingSelected.id) {
        this.roomCriteria.roomCriteria.hasRoom = true;
      }

    }
    try {
      this.pageIndex = '0'; // Reset to the first page
      const query = Object.assign({
        pageSize: this.pageSize,
        pageIndex: this.pageIndex
      }, this.query);
      this.listStudentsFromRoom = await this.innowayApi.staff.searchStudent(this.roomCriteria, { query});
      const list_students_from_room: any = [];
      for (let i = 0; i < this.listStudentsFromRoom.length; i++) {
        // There is an issue on server, listStudentsFromRoom contains all student
        // instead of just the student in the selected room -> filter offline again to ensure the data
        if (this.listStudentsFromRoom[i] && (!this.buildingSelected.id || this.listStudentsFromRoom[i].building === this.buildingSelected.id)
          && (!this.roomSelected.id || this.listStudentsFromRoom[i].room === this.roomSelected.name)) {
          list_students_from_room.push({ student: this.listStudentsFromRoom[i] });
        }
      }
      this.listStudentsFromRoom = [...list_students_from_room];
      this.listStudentsFromDepartment = [...this.listStudentsFromRoom];
      // if (this.loadMessageWhenLoadFirstPage) {
        this.getListStudentsFromDepartment(this.listDepartments[0]);
      // }
      // this.loadMessageWhenLoadFirstPage = false;
      this.ref.detectChanges();
    } catch (err) {
      console.log('err: ', err);
    }
  }
  async onSearch(e) {
    this.inputSearch = e.target.value;
  }

  async changeCheckbox(e) {
    if (e.target.checked){
      this.roomSelected = {id: null, name: 'Phòng ở'};
      this.buildingSelected = {id: null, name: 'Toà nhà'};
    }
    this.hasRoom = !e.target.checked;
    await this.getListStudentsFromRoom(this.roomSelected, this.floor);
  }

  async searchStudent() {
    this.infoCriteria = {
      infoCriteria: {
        username: this.inputSearch
      }
    }
    let dataSearch = { ...this.roomCriteria, ...this.infoCriteria };
    try {
      this.listStudentsFromRoom = await this.innowayApi.staff.searchStudent(dataSearch);
      const list_students_from_room: any = [];
      for (let i = 0; i < this.listStudentsFromRoom.length; i++) {
        list_students_from_room.push({ student: this.listStudentsFromRoom[i] });
      }
      this.listStudentsFromRoom = list_students_from_room;
      this.listStudentsFromDepartment = this.listStudentsFromRoom;
      this.getListStudentsFromDepartment(this.departmentSelected);
      this.ref.detectChanges();
    } catch (err) {
      console.log('err: ', err);
    }
  }

  showLastMessage(item) {
    if (this.isEmpty(item.lastMessage)) { return;}
    if (item.lastMessage.content === '') { return;}
    const listIdsSeen = item.lastMessage.seen;
    for (var idSeen in listIdsSeen){
      if (idSeen !== this.currentUserId) {
        return '<b>' + item.lastMessage.content + '</b>';
      } else {
        return item.lastMessage.content;
      }
    }
    return;
  }

  checkIsSeenMesssage(item) {
    if (this.isEmpty(item.lastMessage)) { return;}
    if (item.lastMessage.content === '') { return;}
    const listIdsSeen = item.lastMessage.seen;
    for (var idSeen in listIdsSeen){
      if (listIdsSeen[idSeen] !== this.currentUserId) {
        //not seen
        return false;
      } else {
        //seen
        return true;
      }
    }
  }

  isSeen(mes){
    if (this.currentGroup.lastMessage.seen.length > 0) {
      const listIdsSeen = this.currentGroup.lastMessage.seen;
      const student = this.currentGroup.student;
      for (let i = 0; i < listIdsSeen.length; i++){
        const seen = listIdsSeen[i];
        if (seen === student.id && mes.userId !== student.id){
          return true;
        }
      }
    }
    return false;
  }

  onScroll(e) {
    const element = e.target;
    if (element.scrollHeight - element.scrollTop === element.clientHeight) {
      this.onScrollDown();
    }
  }
  async onScrollDown() {
    console.log('onScrollDown');
    try {
      await this.getNextListStudentsFromRoom();
      this.mapGroupFirebaseWithListStudents(this.departmentSelected);
    } catch (err) {
      console.log('err: ', err);
    }
  }

  mapGroupFirebaseWithListStudents(department) {
    this.listStudentsFromDepartmentMerged = [];
      for (let i = 0; i < this.listStudentsFromDepartment.length; i++) {
        const student = this.listStudentsFromDepartment[i];
        let lastMessage = {};
        let idGroup = '';
        for (let j = 0; j < this.listGroupsFromFirebase.length; j++) {
          const group = this.listGroupsFromFirebase[j];

          if (student.student.id === group.student.id || (group.student[0] && student.student.id === group.student[0].id)) {
            lastMessage = group.lastMessage;
            idGroup = group.id;
            break;
          }
        }
        this.listStudentsFromDepartmentMerged.push({
          student: student.student,
          lastMessage: lastMessage,
          idGroup: idGroup,
          department
        });
      }
      this.loadingDropup = false;
  }

  async getNextListStudentsFromRoom() {
    console.log('onScrollDown, page: ', this.pageIndex);
    this.pageIndex = (parseInt(this.pageIndex, 10) + 1).toString();
    this.loadingDropup = true;
    try {
      const query = Object.assign({
        pageSize: this.pageSize,
        pageIndex: this.pageIndex
      }, this.query);
      let list_students_from_room: any = [];
      list_students_from_room = await this.innowayApi.staff.searchStudent(this.roomCriteria, { query});
      for (let i = 0; i < list_students_from_room.length; i++) {
        this.listStudentsFromRoom.push({ student: list_students_from_room[i] });
      }
      this.listStudentsFromDepartment = this.listStudentsFromRoom;
      this.loadingDropup = false;
      this.ref.detectChanges();
    } catch (err) {
      console.log('err: ', err);
    }
  }

  changeFloor(event){
    if (event.type === 'blur'){
      this.floor = parseInt(event.target.value,10);
      this.getListStudentsFromRoom(this.roomSelected, this.floor);
    }
  }
}
