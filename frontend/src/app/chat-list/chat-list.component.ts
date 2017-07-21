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
      console.log('in chat list constructor');
      var self = this;
      socket.on('payload', function(){
        // self.getUsers();
      });
      socket.on('saveUser', function(){
      });
      socket.on('getUserList', function(){
      });
      socket.on('loggedUser', function(){
        // self.getUsers();
      });
    }

  	ngOnInit() {
      var self = this;
      console.log('in chat list init');
      this.authService.fetchedUser.subscribe(
        (user: ChatUser) => {
          this.localUser = user;
          socket.on('ping'+user.email,function(email:string){
            console.log('got pingged here : ' , email);
            socket.emit('attendence' , email);
          })
        }
        );

      this.getUsers();
      this.localUser = this.authService.loggedUser;
      console.log('in ngOnInit of chatlist where localUser is : ' , this.localUser);
      
      socket.on('signin', function(){
        if(self.authService.isLoggedIn())
          self.getUsers();
      });
      socket.on('logout', function(){
        if(self.authService.isLoggedIn())
          self.getUsers();
      });
      socket.on('loggedUser', function(){
        if(self.authService.isLoggedIn())
          self.getUsers();
      });
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