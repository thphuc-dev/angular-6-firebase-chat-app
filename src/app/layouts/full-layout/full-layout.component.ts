import { Component, OnInit, ChangeDetectorRef, NgZone, TemplateRef, ViewChild, ElementRef} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InnowayAuthService } from '../../services/innoway/innoway-auth.service';
import { InnowayConfigService } from '../../services/innoway/innoway-config.service';
declare var $: any;
declare let swal: any;
@Component({
  selector: 'app-full-layout',
  templateUrl: './full-layout.component.html',
  styleUrls: ['./full-layout.component.scss']
})

export class FullLayoutComponent implements OnInit {
  showLoading: boolean = false;
  status: any;
  navigations: any;
  navigationsForAdmin = [
    {
      type: 'title',
      name: 'Dormitory Ngoai Ngu',
    },
    // {
    //   type: 'single',
    //   name: 'Tổng quan',
    //   link: 'dashboard',
    //   icon: 'fa fa-home',
    // },
    {
      type: 'single',
      name: 'Thêm thông báo',
      icon: 'fa fa-asterisk',
      link: 'announcement'
    },
    {
      type: 'parent',
      name: 'Tin nhắn',
      icon: 'fa fa-envelope-o',
      children: [
        {
          name: 'Phòng chát',
          link: 'chat/app',
          icon: 'fa fa-commenting-o'
        }
      ]
    },
    {
      type: 'parent',
      name: 'Thanh toán',
      icon: 'fa fa-google-wallet',
      children: [
        {
          name: 'Thu tiền phòng',
          link: 'bill/personal',
          icon: 'fa fa-money'
        },
        {
          name: 'Thu tiền dịch vụ',
          link: 'bill/shared',
          icon: 'fa fa-money'
        }
      ]
    },
    {
      type: 'parent',
      name: 'Quản lý sinh viên',
      icon: 'fa fa-graduation-cap',
      children: [
        {
          name: 'Sinh viên mới',
          link: 'student/list',
          icon: 'fa fa-list-ul'
        },
        {
          name: 'Kiểm tra đánh giá',
          link: 'student/assessment',
          icon: 'fa fa-check-square-o'
        },
        {
          name: 'Đăng ký nội trú',
          link: 'student/register-to-stay',
          icon: 'fa fa-h-square'
        },
        {
          name: 'Tìm kiếm sinh viên',
          link: 'student/search',
          icon: 'fa fa-search'
        }
      ]
    },
    {
      type: 'parent',
      name: 'Quản lý phòng',
      icon: 'fa fa-list',
      children: [
        {
          name: 'Xếp phòng',
          link: 'room-manager/reservation',
          icon: 'fa fa-bed'
        },
        {
          name: 'Danh sách phòng',
          link: 'room-manager/list',
          icon: 'fa fa-list-ul'
        }
      ]
    },
    {
      type: 'parent',
      name: 'Danh mục dữ liệu',
      icon: 'fa fa-database',
      children: [
        {
          name: 'Loại phòng',
          link: 'data/room-type',
          icon: 'fa fa-cogs'
        },
        {
          name: 'Nhà, phòng',
          link: 'data/building',
          icon: 'fa fa-home'
        },
        {
          name: 'Quốc gia, tỉnh, thành phố',
          link: 'data/nationality',
          icon: 'fa fa-globe'
        },
        {
          name: 'Dân tộc',
          link: 'data/race',
          icon: 'fa fa-users'
        },
        {
          name: 'Tôn giáo',
          link: 'data/religion',
          icon: 'fa fa-universal-access'
        },
        {
          name: 'Trường, Khoa, Lớp',
          type: 'child',
          icon: 'fa fa-graduation-cap',
          children: [
            {
              name: 'Trường',
              link: 'data/school',
              icon: 'fa fa-university'
            },
            {
              name: 'Khoa',
              link: 'data/major',
              icon: 'fa fa-book'
            }
          ]
        },
        {
          name: 'Đối tượng ưu tiên',
          link: 'data/priority-target',
          icon: 'fa fa-flag'
        },
        {
          name: 'Cập nhật khoản thu',
          link: 'data/room-fee',
          icon: 'fa fa-list-ol'
        },
        {
          name: 'Loại thông báo',
          icon: 'fa fa-asterisk',
          link: 'data/announcement-type'
        },
      ]
    },
    {
      type: 'parent',
      name: 'Phân quyền Admin',
      icon: 'fa fa-user-secret',
      children: [
        {
          name: 'Thêm Admin cơ sở',
          icon: 'fa fa-lock',
          type: 'child',
          children: [
            {
              name: 'Thêm',
              link: 'staff/add',
              icon: 'fa fa-plus'
            },
            {
              name: 'Danh sách',
              link: 'staff/list',
              icon: 'fa fa-list-ul'
            }
          ]
        },
        {
          name: 'Phòng ban',
          icon: 'fa fa-share-alt-square',
          type: 'child',
          children: [
            {
              name: 'Thêm',
              link: 'department/add',
              icon: 'fa fa-plus'
            },
            {
              name: 'Danh sách',
              link: 'department/list',
              icon: 'fa fa-list-ul'
            }
          ]
        },
        {
          name: 'Chức vụ và quyền',
          icon: 'fa fa-user-plus',
          type: 'child',
          children: [
            {
              name: 'Thêm chức vụ',
              link: 'role/add',
              icon: 'fa fa-plus'
            },
            {
              name: 'Danh sách chức vụ',
              link: 'role/list',
              icon: 'fa fa-list-ul'
            }
          ]
        }
      ]
    },
    {
      type: 'parent',
      name: 'Quảng cáo',
      icon: 'fa fa-bullhorn',
      children: [
        {
          name: 'Thêm',
          link: 'advertisement/add',
          icon: 'fa fa-plus'
        },
        {
          name: 'Danh sách',
          link: 'advertisement/list',
          icon: 'fa fa-list-ul'
        }
      ]
    },
  ];

  //info of staff
  avatarUrl: string;
  firstName: string;
  lastName: string;

  //file avatar

  @ViewChild('fileUploader')
  fileUploaderElementRef: ElementRef;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private ref: ChangeDetectorRef,
    private zone: NgZone,
    public innowayAuth: InnowayAuthService,
    private innowayConfig: InnowayConfigService,
  ) {
    this.firstName = this.innowayConfig.firstName;
    this.lastName = this.innowayConfig.lastName;
    this.avatarUrl = this.innowayConfig.avatarUrl;
  }

  async ngOnInit() {
    this.innowayAuth.authenticated.then(state => {
      if (state) {
        this.navigations = this.navigationsForAdmin;
      }
    });
    $(document).ready(function() {
      $('nav.sidebar-nav ul li.nav-non-dropdown a').click(function() {
        $('body').removeClass('sidebar-mobile-show');
      });
      $('nav.sidebar-nav ul li.nav-dropdown ul li a').click(function() {
        $('body').removeClass('sidebar-mobile-show');
      });
    });
  }

  signout(event) {
    console.log('signout', event);
    this.innowayAuth.logout();
  }

  public toggled(open: boolean): void {
    console.log('Dropdown is now: ', open);
    alert(open);
  }

  public toggleDropdown($event: MouseEvent): void {
    $event.preventDefault();
    $event.stopPropagation();
    this.status.isopen = !this.status.isopen;
  }

  navigate(link) {
    this.showLoading = true;
    this.router.navigate(['/admin/' + link]).then(() => {
      this.showLoading = false;
    });
  }
}
