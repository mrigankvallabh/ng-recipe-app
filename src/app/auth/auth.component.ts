import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService, AuthServiceResponse } from './auth.service';
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  public isLoginMode: boolean = true;
  public isLoading: boolean = false;
  public errorMessage: string = null;
  private authObservable: Observable<AuthServiceResponse>;
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  public onSwitchMode(): void {
    this.isLoginMode = !this.isLoginMode;
  }

  public onSubmit(form: NgForm): void {
    if(!form.valid) return;
    const email = form.value.email;
    const password = form.value.password;

    this.isLoading = true;
    if(this.isLoginMode) {
      this.authObservable = this.authService.login(email, password);
    } else {
      this.authObservable = this.authService.signup(email, password);
    }
    
    this.authObservable.subscribe(
      responseData => {
        console.log(responseData);
        this.isLoading = false;
        this.errorMessage = null;
        this.router.navigate(['recipes']);
      },
      errorMessage => {
        console.log(errorMessage);
        this.errorMessage = errorMessage;
        this.isLoading = false;
      }
    );

    form.reset();
  }
}
