import { Component, OnInit, Input,NgZone,OnChanges} from '@angular/core';
import $ from 'jquery/dist/jquery';
import { AuthService } from "../auth/auth.service";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import {ChatUser} from "../auth/chat-user.model";
import {Message} from "./message.model";
import {socket} from "../auth/provideSocket";
import {MessageService} from "./chat-list.service";
import {EmojiPipe} from "./emoji.pipe";


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
	showEmoList:Boolean = false;
	emojiList:any;
	sendingMessage:Boolean = false;
  	constructor(private zone:NgZone,private authService: AuthService,private messageService: MessageService,private emojiPipe:EmojiPipe) {
  		this.emojiList = this.emojiPipe.getEmoji();
  	}
	ngOnChanges(changes) {
		this.getMessages();
	}
  	ngOnInit() {
        var self = this;
  		console.log('in ngOnInit :: ' , this.authService.loggedUser);
  		this.localUser = this.authService.loggedUser;
      	this.messageForm = new FormGroup({
            message: new FormControl(null,Validators.required)
        });
        this.getMessages();
        socket.on('messageSaved'+this.me.email+'->'+this.user.email, function(){
			self.getMessages();
		});
		socket.on('messageSaved'+this.user.email+'->'+this.me.email, function(){
			self.getMessages();
		});
	    socket.on('readMessage'+this.user.email,function(){
	    	self.getMessages();
	    })

  	}
	closeChat(){
		// this.user = undefined;
		this.authService.closedUser.emit(this.user);
	}
	checkme(e){
		if(e.keyCode === 13){

			this.onSubmit();
		}

	}
	selectedEmo(emo){
		$('#uj').html(($('#uj').html().split('<br>')).join(''));
		for(var i = 0;i<this.emojiList.length;i++){
			if(this.emojiList[i].to === emo){
				$('#uj').append('<img class="emogi-image" src="/assets/emoji/'+this.emojiList[i].with+'" />');
				break;
			}
		}
	}
	onSubmit(){
		$('#uj').html($('#uj').html().split('<div><br></div>').join('').split('<div>').join('').split('<br>').join('').split('</div>').join(''));
		console.log('in onsubmit');
		if($('#uj').html() === ''){
			$('#uj').html('');
			return;
		}
		this.showEmoList = false;
		this.curMessage = {
			message: $('#uj').html(),
			sender:this.authService.loggedUser.email,
			receiver:[this.user.email],
			type:'one-to-one',
			date: new Date().toUTCString(),
			seen:false
		}
		this.sendingMessage = true
		this.messageService.saveMessage(this.curMessage).subscribe(
          (data) => {
          	$('#uj').html('');
			this.getMessages();
			this.sendingMessage = false;
          }
		);
	}
	messageBoxActive(){
		socket.emit('messagesSeen',{sender: this.user.email,receiver:this.localUser.email});	
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