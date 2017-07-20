import { Routes, RouterModule } from "@angular/router";

import { SigninComponent } from "./auth/signin.component";
import { SignupComponent } from "./auth/signup.component";
import { ChatListComponent } from './chat-list/chat-list.component';

const APP_ROUTES: Routes = [
	{ path: 'sign-up', component: SignupComponent },
    { path: 'sign-in', component: SigninComponent },
    { path: 'chat-list', component: ChatListComponent },
];

export const routing = RouterModule.forRoot(APP_ROUTES);