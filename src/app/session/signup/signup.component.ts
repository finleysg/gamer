import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { UserService } from '../../services/user.service';
import { MatSnackBar } from '@angular/material';

const password = new FormControl('', Validators.required);
const confirmPassword = new FormControl('', CustomValidators.equalTo(password));

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  public form: FormGroup;
  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit() {
    this.form = this.fb.group( {
      username: [null, Validators.compose([Validators.required])],
      email: [null, Validators.compose([Validators.required, CustomValidators.email])],
      password: password,
      confirmPassword: confirmPassword
    } );
  }

  onSubmit() {
    const user = {
      username: this.form.get('username').value,
      email: this.form.get('email').value,
      password1: this.form.get('password').value,
      password2: this.form.get('confirmPassword').value
    };
    this.userService.createAccount(user).subscribe(() => {
      this.snackbar.open('Your account has been created', null, {duration: 3000});
      this.router.navigate( ['/'] );
    });
  }
}
