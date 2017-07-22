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
          });
          socket.on('hello:'+this.localUser.email, function(email){
            if(!self.userToChat || (email !== self.userToChat.email)){
            console.log('hre :: ' , email);
            console.log('and :: ' , self.userToChat);
              for(var i = 0;i<self.users.length;i++){
                console.log(self.users[i].email + '<==>' + email);
                console.log(self.users[i].email === email);
                if(self.users[i].email===email){
                  self.zone.run(function(){
                    self.users[i].ping++;
                  });
                  console.log('inside: ' + self.users[i].ping);
                  break;
                }
              }
            }
          });
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
              for(var i = 0;i<self.users.length;i++){
                self.users[i].ping = 0;
              }
            });
          }
        );
    }
    selectUser(user:ChatUser){
      user.ping=0;
      this.userToChat = undefined;
      this.userToChat = user;
      console.log('this.userToChat : ' , this.userToChat);
    }

}