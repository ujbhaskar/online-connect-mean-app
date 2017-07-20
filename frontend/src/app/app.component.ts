import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from "./auth/auth.service";
import {ChatUser} from "./auth/chat-user.model";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent  implements OnInit {
	constructor(private authService: AuthService, private router: Router) {}
  	ngOnInit() {
      console.log('in HeaderComponent');
	  	if(localStorage.getItem('token')){
	  		this.getUserDetails(localStorage.getItem('token'));
	  	}
  		this.authService.fetUser.subscribe(
            (token: string) => {
            	this.getUserDetails(token);
            }
        );
  		
  	}
  	user:ChatUser;
  	getUserDetails(token:string){
  		this.authService.getUser(token)
  		.subscribe(
          (data) => {
          	  console.log('over here');
              this.authService.loggedUser = data.obj;
              this.user = data.obj;
              this.router.navigate(['/chat-list']);
              // this.username = data.obj.firstName+' '+data.obj.lastName;
          }
        );
  	}
}
