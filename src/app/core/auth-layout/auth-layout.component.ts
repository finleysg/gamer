import { Component, OnInit } from '@angular/core';
import { AppErrorHandler } from '../../services/app-error-handler.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-layout',
  styles: [':host .mat-drawer-content {padding: 0;} .mat-drawer-container {z-index: 1000}'],
  templateUrl: './auth-layout.component.html'
})
export class AuthLayoutComponent implements OnInit {

  constructor(private errorHandler: AppErrorHandler, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.errorHandler.lastError$.subscribe(err => {
      this.snackBar.open(err, null, { duration: 5000 });
    });
  }
}
