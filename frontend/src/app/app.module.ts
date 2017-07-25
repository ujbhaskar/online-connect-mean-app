import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { routing } from './app.routing';
import { AuthService } from "./auth/auth.service";
import { SigninComponent } from "./auth/signin.component";
import { SignupComponent } from "./auth/signup.component";
import { ChatListComponent } from './chat-list/chat-list.component';
import { ChatBoxComponent } from './chat-list/chat-box.component';
import { ErrorsComponent } from './errors/errors.component';
import { ErrorService } from "./errors/errors.service";
import {Configurations} from "./configurations/configurations.service";
import {MessageService} from "./chat-list/chat-list.service";
import {EmojiPipe} from './chat-list/emoji.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SigninComponent,
    SignupComponent,
    ChatListComponent,
    ChatBoxComponent,
    ErrorsComponent,
    EmojiPipe 
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BrowserModule,
    FormsModule,
    routing,
    HttpModule
  ],
  providers: [AuthService, ErrorService,Configurations,MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
