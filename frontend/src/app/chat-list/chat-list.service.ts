import { Injectable,EventEmitter } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { Router } from "@angular/router";
import { ErrorService } from "../errors/errors.service";
import {Configurations} from "../configurations/configurations.service";
import 'rxjs/Rx';
import { Observable } from "rxjs";

import { Message } from "./message.model";

@Injectable()
export class MessageService {
    constructor(private http: Http, private router: Router,private errorsService: ErrorService,private configuration: Configurations) {};

    saveMessage(message: Message) {
        const body = JSON.stringify(message);
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post('http://'+this.configuration.getIpAddress()+':3000/message?token='+localStorage.getItem('token'), body, {headers: headers})
            .map((response: Response) => response.json())
            .catch((error: Response) => {
                this.errorsService.handleError(error.json());
                return Observable.throw(error.json());
            });
    }
    getMessages(email:string){
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.get('http://'+this.configuration.getIpAddress()+':3000/message?token='+localStorage.getItem('token')+'&email='+email, {headers: headers})
            .map((response: Response) => response.json())
            .catch((error: Response) => {
                this.errorsService.handleError(error.json());
                return Observable.throw(error.json());
            });

    }
}