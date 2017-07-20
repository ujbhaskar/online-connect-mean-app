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
        console.log(changes);
        if(changes.user.currentValue){
          this.username = this.user.firstName+' '+this.user.lastName; 
        }
    }
  constructor(private authService: AuthService, private router: Router) {
    socket.on('payload', function(){
      // console.log('in payload socket');
    });
    socket.on('saveUser', function(){
      // console.log('in saveUser socket');
    });
    socket.on('getUserList', function(){
      // console.log('in getUserList socket');
    });
    socket.on('loggedUser', function(){
      // console.log('in loggedUser socket');
    });
    socket.on('signin', function(){
      // console.log('in signin socket');
    });
    socket.on('logout', function(){
      // console.log('in logout socket');
    });
  }

    isLoggedIn() {
        return this.authService.isLoggedIn();
    }
   username:string;

  	ngOnInit() {
      console.log('in HeaderComponent');	
  	}
	onLogout() {
	    this.authService.logout()
      .subscribe(
        (data)=>{
          console.log('in onLogout where data is : ' , data);
          localStorage.clear();
          this.router.navigate(['/sign-in']);
        }
        );
	}

}
