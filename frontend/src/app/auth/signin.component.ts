import { Component } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";

import { User } from "./user.model";
import { AuthService } from "./auth.service";

@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html'
})
export class SigninComponent {
    myForm: FormGroup;

    constructor(private authService: AuthService, private router: Router) {}

    onSubmit() {
        var self = this;
        const user = new User(this.myForm.value.email, this.myForm.value.password);
        this.authService.signin(user)
            .subscribe(
                data => {
                    self.myForm.reset();
                    localStorage.setItem('token', data.token);
                    this.router.navigateByUrl('/chat-list');
                    // this.authService.fetUser.emit(data.token);
                    // this.authService.getUser(data.token)
                    // .subscribe(
                    // (data) => {
                    //     this.router.navigateByUrl('/chat-list');
                    //     this.authService.fetchedUser.emit(data.obj);
                    //     this.authService.loggedUser = data.obj;
                    // }
                    // );
                },
                error => console.error(error)
            );
    }

    ngOnInit() {
        this.myForm = new FormGroup({
            email: new FormControl(null, [
                Validators.required,
                Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")
            ]),
            password: new FormControl(null, Validators.required)
        });
    }
}