import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { AuthService } from 'src/app/services/auth.service';
import { FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
    loginForm = new FormGroup({
        'email': new FormControl('', [Validators.required, Validators.email]),
        'password': new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
    registerForm = new FormGroup({
        'username': new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern('^[a-zA-Z0-9]+$')]),
        'password': new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(50)]),
        'email': new FormControl('', [Validators.required, Validators.email]),
        'fullname': new FormControl('', [Validators.required, Validators.minLength(3)]),
        'birthdate': new FormControl('', [Validators.required]),
        'deposit': new FormControl('', [Validators.required, Validators.min(0)]),
    });
    isLogged = false;
    isLoginFailed = false;
    errorLogin = '';

    register = false;

    constructor(private router: Router, private authService: AuthService, private datePipe: DatePipe) {}

    ngOnInit(): void {}

    onSubmitLogin(): void {
        const email = this.loginForm.value.email;
        const password = this.loginForm.value.password;
        this.authService.login(email, password).subscribe(
            (data) => {
                this.isLogged = true;
                this.isLoginFailed = false;
                this.authService.saveToken(data.token);
                this.router.navigate(['']);
            },
            (err) => {
                this.errorLogin = err.error.message;
                this.isLoginFailed = true;
            }
        );
    }

    onSubmitRegister(): void {
        const username = this.registerForm.value.username;
        const password = this.registerForm.value.password;
        const email = this.registerForm.value.email;
        const fullname = this.registerForm.value.fullname;
        const birthdate: any = this.datePipe.transform(this.registerForm.value.birthdate, 'yyyy-MM-dd');
        const deposit = Number(this.registerForm.value.deposit);
        this.authService.register(username, password, email, fullname, birthdate, deposit).subscribe(
            (data) => {
                console.log(data);
                this.register = false;
            },
            (err) => {
                console.log(err);
                this.errorLogin = err.error.message;
                this.isLoginFailed = true;
                this.register = false;
            }
        );
    }

    logout(): void {
        this.authService.signOut();
        window.location.reload();
    }
}
