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
  		var self = this;
		socket.on('messageSaved', function(){
			console.log('in messageSaved ');
			self.getMessages();
		});

  	}
	ngOnChanges(changes) {
		console.log(changes);
		this.getMessages();
	}
  	ngOnInit() {
  		this.localUser = this.authService.loggedUser;
  		console.log(this.localUser);
      	this.messageForm = new FormGroup({
            message: new FormControl(null,Validators.required)
        });
        this.getMessages();
  	}
	closeChat(){
		this.user = undefined;
	}
	onSubmit(){
		console.log(this.messageForm.value.message);
		this.curMessage = {
			message: this.messageForm.value.message,
			sender:this.authService.loggedUser.email,
			receiver:[this.user.email],
			type:'one-to-one',
			date: new Date()
		}
		this.messageService.saveMessage(this.curMessage).subscribe(
          (data) => {
          	console.log('saved message is : ', data);
			this.messageForm.reset();

          }
		);
	}

	getMessages(){
		var self = this;
		console.log('in chatbox component where user is : ', this.user);
		if(!this.user)
			return;
		this.messageService.getMessages(this.user.email).subscribe(
			(data)=>{
				self.zone.run(function(){
					console.log('all messages is: ' , data);
					self.messages = data.obj;
					setTimeout(function(){
						$("div.chatbox-body").scrollTop($('div.chatbox-body').prop('scrollHeight'));
					},100);
				});
			}
		);
	}
}