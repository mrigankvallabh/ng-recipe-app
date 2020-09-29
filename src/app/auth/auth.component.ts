import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder.directive';
import { AuthService, AuthServiceResponse } from './auth.service';
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {
  public isLoginMode: boolean = true;
  public isLoading: boolean = false;
  public errorMessage: string = null;
  @ViewChild(PlaceholderDirective, {static: false}) alertPlaceHolder: PlaceholderDirective;
  private authObservable: Observable<AuthServiceResponse>;
  private alertCloseSubscription: Subscription;

  constructor(private authService: AuthService, private router: Router, private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if(this.alertCloseSubscription) {
      this.alertCloseSubscription.unsubscribe();
    }
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
        // console.log(responseData);
        this.isLoading = false;
        this.errorMessage = null;
        this.router.navigate(['recipes']);
      },
      errorMessage => {
        console.log(errorMessage);
        this.errorMessage = errorMessage;
        this.showErrorAlert(errorMessage);
        this.isLoading = false;
      }
    );

    form.reset();
  }

  public onHandleAlert(): void {
    this.errorMessage = null;
  }

  private showErrorAlert(errorMessage: string): void {
    const alertComponentFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
    const hostViewContainerRef = this.alertPlaceHolder.viewContainerRef;
    hostViewContainerRef.clear();

    const alertComponentRef = hostViewContainerRef.createComponent(alertComponentFactory);
    alertComponentRef.instance.message = errorMessage;
    this.alertCloseSubscription = alertComponentRef.instance.closeAlert.subscribe(() => {
      this.alertCloseSubscription.unsubscribe();
      hostViewContainerRef.clear();
    });
  }
}
