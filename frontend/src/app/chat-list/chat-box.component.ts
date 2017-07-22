import { Component, OnInit, Input,NgZone,OnChanges} from '@angular/core';
import $ from 'jquery/dist/jquery';
import { AuthService } from "../auth/auth.service";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import {ChatUser} from "../auth/chat-user.model";
import {Message} from "./message.model";
import {socket} from "../auth/provideSocket";
import {MessageService} from "./chat-list.service";


@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.less']
})
export class ChatBoxComponent implements OnInit {
	@Input() user:ChatUser;
	@Input() me:ChatUser;
	//Array<{firstName: string, lastName: string, email: string}>;
	localUser:ChatUser;
	messageForm: FormGroup;
	messages:Message[];
	curMessage:Message;
  	constructor(private zone:NgZone,private authService: AuthService,private messageService: MessageService) {
  		

  	}
	ngOnChanges(changes) {
		this.getMessages();
	}
  	ngOnInit() {
  		this.localUser = this.authService.loggedUser;
      	this.messageForm = new FormGroup({
            message: new FormControl(null,Validators.required)
        });
        this.getMessages();
        var self = this;
        socket.on('messageSaved'+this.me.email+'->'+this.user.email, function(){
			self.getMessages();
		});
		socket.on('messageSaved'+this.user.email+'->'+this.me.email, function(){
			self.getMessages();
		});
  	}
	closeChat(){
		this.user = undefined;
	}
	onSubmit(){
		this.curMessage = {
			message: this.messageForm.value.message,
			sender:this.authService.loggedUser.email,
			receiver:[this.user.email],
			type:'one-to-one',
			date: new Date()
		}
		this.messageService.saveMessage(this.curMessage).subscribe(
          (data) => {
			this.messageForm.reset();
			this.getMessages();
          }
		);
	}

	getMessages(){
		var self = this;
		if(!this.user)
			return;
		this.messageService.getMessages(this.user.email).subscribe(
			(data)=>{
				self.zone.run(function(){
					self.messages = data.obj;
					setTimeout(function(){
						$("div.chatbox-body").scrollTop($('div.chatbox-body').prop('scrollHeight'));
					},100);
				});
			}
		);
	}
}