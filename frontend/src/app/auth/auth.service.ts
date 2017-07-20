import { Injectable,EventEmitter,OnInit } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { Router } from "@angular/router";
import { ErrorService } from "../errors/errors.service";
import {Configurations} from "../configurations/configurations.service";
import 'rxjs/Rx';
import { Observable } from "rxjs";
import {ChatUser} from "../auth/chat-user.model";

import { User } from "./user.model";

@Injectable()
export class AuthService  implements OnInit {

    ngOnInit(){
        console.log('in ngonit of auth servise')
    }
    constructor(private http: Http, private router: Router,private errorsService: ErrorService,private configuration: Configurations) {}
    fetUser = new EventEmitter<string>();

    // editMessage(userId: string) {
    //     this.gotUserId.emit(userId);
    // }
    loggedUser:ChatUser;
    signup(user: User) {
        const body = JSON.stringify(user);
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post('http://'+this.configuration.getIpAddress()+':3000/user', body, {headers: headers})
            .map((response: Response) => response.json())
            .catch((error: Response) => {
                this.errorsService.handleError(error.json());
                return Observable.throw(error.json());
            });
    }
    getUser(token:String){
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.get('http://'+this.configuration.getIpAddress()+':3000/user/loggedUser?token='+localStorage.getItem('token'), {headers: headers})
            .map((response: Response) =>response.json())
            .catch((error: Response) => {
                // this.errorsService.handleError(error.json());
                this.clearToken();
                this.router.navigateByUrl('/sign-in');
                return Observable.throw(error.json());
            });
    }

    getAllUsers(){
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.get('http://'+this.configuration.getIpAddress()+':3000/user?token='+localStorage.getItem('token'), {headers: headers})
            .map((response: Response) => response.json())
            .catch((error: Response) => {
                // console.log('over here : ' , error);
                // this.errorsService.handleError(error.json());
                this.clearToken();
                this.router.navigateByUrl('/sign-in');
                return Observable.throw(error.json());
            });
    }

    signin(user: User) {
        const body = JSON.stringify(user);
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post('http://'+this.configuration.getIpAddress()+':3000/user/signin', body, {headers: headers})
            .map((response: Response) => response.json())
            .catch((error: Response) => {
                this.errorsService.handleError(error.json());
                return Observable.throw(error.json());
            });
    }
    logout() {
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post('http://'+this.configuration.getIpAddress()+':3000/user/logout?token='+localStorage.getItem('token'), {headers: headers})
            .map((response: Response) => response.json())
            .catch((error: Response) => {
                this.errorsService.handleError(error.json());
                return Observable.throw(error.json());
            });
    }

    clearToken() {
        localStorage.clear();
    }

    isLoggedIn() {
        // console.log('in isLogged in where token is : ' , localStorage.getItem('token'));
        return localStorage.getItem('token') !== null;
    }
}