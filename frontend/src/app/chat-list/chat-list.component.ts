import { Component, OnInit,NgZone} from '@angular/core';
import { AuthService } from "../auth/auth.service";
import {ChatUser} from "../auth/chat-user.model";
import $ from 'jquery/dist/jquery';
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
  isActive:Boolean = true;
  blinkTitle:any;
	//Array<{firstName: string, lastName: string, email: string}>;
  	constructor(private zone:NgZone, private authService: AuthService) { 
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
      window.onfocus = function () {
        socket.emit('userActive',self.localUser);
        self.isActive = true; 
        clearInterval(self.blinkTitle);
        $(document).prop('title','Online Chat');
      }; 
      window.onblur = function () { 
        self.isActive = false;
        socket.emit('inactive',self.localUser);
      };
      if(localStorage.getItem('token')){
        this.authService.getUser(localStorage.getItem('token'))
        .subscribe(
            (data) => {
                this.authService.loggedUser = data.obj;
                this.authService.fetchedUser.emit(data.obj);
            }
          );
      }
      this.authService.closedUser.subscribe(
        (user:ChatUser)=>{
          this.userToChat = undefined;
        }
        );
      this.authService.fetchedUser.subscribe(
        (user: ChatUser) => {
          this.localUser = user;
          socket.on('ping'+user.email,function(email:string){
            socket.emit('attendence' , email);
          });
          socket.on('hello:'+this.localUser.email, function(email){
            if(!self.userToChat || (email !== self.userToChat.email)){
              for(var i = 0;i<self.users.length;i++){
                if(self.users[i].email===email){
                  self.zone.run(function(){
                    self.users[i].ping++;
                    $('#chatAudio')[0].play();
                  });
                  break;
                }
              }
            }
            if(!self.isActive){ 

              for(var i = 0;i<self.users.length;i++){
                if(self.users[i].email===email){                                   
                  self.blinkTitle = setInterval(function(){
                      var title = document.title;
                      document.title = (title == self.users[i].firstName + ' messaged you' ? "Online Chat" : self.users[i].firstName + ' messaged you');
                  }, 1000);
                  $('#chatAudio')[0].play();
                  break;
                }
              }        
            }
          });
        }
        );

      this.getUsers();
      this.localUser = this.authService.loggedUser;
      
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
      socket.on('awayUser', function(){
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
    }

}