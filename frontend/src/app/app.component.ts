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
  user:ChatUser;
	constructor(private authService: AuthService, private router: Router) {}
	ngOnInit() {
  	if(localStorage.getItem('token')){
      this.router.navigate(['/chat-list']);
  	}
    else{
      this.router.navigate(['/sign-in']);
    }
    this.authService.fetchedUser.subscribe(
      (user: ChatUser) => {
        this.user = user;
      }
      );		
	}
}
