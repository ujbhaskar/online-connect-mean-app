import { Component, OnInit, Input,NgZone,OnChanges} from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from "../auth/auth.service";
import { ChatUser } from "../auth/chat-user.model";
import {socket} from "../auth/provideSocket";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {
  @Input() user:ChatUser;

  ngOnChanges(changes) {
        if(changes.user.currentValue){
          this.username = this.user.firstName+' '+this.user.lastName; 
        }
    }
  constructor(private authService: AuthService, private router: Router) {
    socket.on('payload', function(){
    });
    socket.on('saveUser', function(){
    });
    socket.on('getUserList', function(){
    });
    socket.on('loggedUser', function(){
    });
    socket.on('signin', function(){
    });
    socket.on('logout', function(){
    });
  }

    isLoggedIn() {
        return this.authService.isLoggedIn();
    }
   username:string;

  	ngOnInit() {
  	}
	onLogout() {
	    this.authService.logout()
      .subscribe(
        (data)=>{
          localStorage.clear();
          this.router.navigate(['/sign-in']);
        }
        );
	}

}
