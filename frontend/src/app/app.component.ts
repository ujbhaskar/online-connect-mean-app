import { Component, OnInit,EventEmitter } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from "./auth/auth.service";
import {ChatUser} from "./auth/chat-user.model";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent  implements OnInit {
  // fetUser = new EventEmitter<ChatUser>();
	constructor(private authService: AuthService, private router: Router) {}
  	ngOnInit() {
	  	if(localStorage.getItem('token')){
	  		this.getUserDetails(localStorage.getItem('token'));
	  	}
      else{
        this.router.navigate(['/sign-in']);
      }
      this.authService.fetchedUser.subscribe(
        (user: ChatUser) => {
          this.user = user;
        }
        );
  		// this.authService.fetUser.subscribe(
    //         (token: string) => {
    //         	this.getUserDetails(token);
    //         }
    //     );
  		
  	}
  	user:ChatUser;
  	getUserDetails(token:string){
  		this.authService.getUser(token)
  		.subscribe(
          (data) => {
              this.authService.fetchedUser.emit(data.obj);
              this.authService.loggedUser = data.obj;
              this.user = data.obj;
              this.router.navigate(['/chat-list']);
              // this.username = data.obj.firstName+' '+data.obj.lastName;
          }
        );
  	}
}
