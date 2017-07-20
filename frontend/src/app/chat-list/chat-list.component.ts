import { Component, OnInit,NgZone} from '@angular/core';
import { AuthService } from "../auth/auth.service";
import {ChatUser} from "../auth/chat-user.model";

import {socket} from "../auth/provideSocket";

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.less']
})
export class ChatListComponent implements OnInit {
	users:ChatUser[];
  localUser:ChatUser;
  userToChat:ChatUser;
	//Array<{firstName: string, lastName: string, email: string}>;
  	constructor(private zone:NgZone, private authService: AuthService) { 
      var self = this;
      socket.on('payload', function(){
        //console.log('in chat-list payload socket');
        // self.getUsers();
      });
      socket.on('saveUser', function(){
        //console.log('in chat-list saveUser socket');
      });
      socket.on('getUserList', function(){
        //console.log('in chat-list getUserList socket');
      });
      socket.on('loggedUser', function(){
        // self.getUsers();
        //console.log('in chat-list loggedUser socket');
      });
      socket.on('signin', function(){
        if(self.authService.isLoggedIn())
          self.getUsers();
      });
      socket.on('logout', function(){
        if(self.authService.isLoggedIn())
          self.getUsers();
      });
    }

  	ngOnInit() {
      this.getUsers();
      this.localUser = this.authService.loggedUser;
      console.log('in ngOnInit of chatlist where localUser is : ' , this.localUser);
  	}
    getUsers(){
      var self = this;
      this.authService.getAllUsers()
      .subscribe(
          (data) => {
            self.zone.run(function(){
              self.users = data.obj;
            });
          }
        );
    }
    selectUser(user:ChatUser){
      this.userToChat = undefined;
      this.userToChat = user;
    }

}