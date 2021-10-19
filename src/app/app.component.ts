import { Component, OnInit } from '@angular/core';
import { FcmService } from './services/innoway/fcm.service';
import { HttpClient, HttpRequest, HttpHeaders} from '@angular/common/http';
import { environment } from '../environments';

@Component({
    selector: 'body',
    template: '<router-outlet></router-outlet><ngx-loading-bar></ngx-loading-bar>',
})
export class AppComponent implements OnInit {
    constructor(
        private fcm: FcmService,
        private http: HttpClient
    ) {}

    async ngOnInit() {
        // Subscribe message from server
        const registrationToken = await this.fcm.getMessageToken();
        this.fcm.onMessage.subscribe(message => {
            if (message !== undefined) {
                this.fcm.fcmRegistration.showNotification(message.body);
            }
        });

        // Register to subscribe topic main
        const topicToSubscribe = 'main';
        const urlFCM = `https://iid.googleapis.com/iid/v1/${registrationToken}/rel/topics/${topicToSubscribe}`;
        const keyFCM = environment.innoway.legacyServerKey;
        const httpHeader =  new HttpHeaders({
            'Authorization': keyFCM,
            'Content-Type': 'application/json'
        });
        const req = new HttpRequest( 'POST', urlFCM, {}, { headers: httpHeader });
        await this.http.request(req).toPromise();
    }
 }
