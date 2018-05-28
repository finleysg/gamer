import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  loading = false;
  returnUrl: string;
  public form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.returnUrl = this.userService.redirectUrl || '/';
    this.form = this.fb.group({
      uname: [null, Validators.compose([Validators.required])],
      password: [null, Validators.compose([Validators.required])],
      remember: true
    });
  }

  onSubmit() {
    this.loading = true;
    if (this.form.valid) {
      this.userService.login(this.form.get('uname').value, this.form.get('password').value, this.form.get('remember').value).subscribe(
        () => this.router.navigate([this.returnUrl])
      );
    }
  }
}
