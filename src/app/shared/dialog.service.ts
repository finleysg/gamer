import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';

@Injectable()
export class DialogService {

  constructor(
    private dialog: MatDialog
  ) { }

  inform(message: string, title: string): Observable<void> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        message: message,
        title: title,
        inform: true
      }
    });

    return dialogRef.afterClosed();
  }

  confirm(message: string, title: string, continueAction?: string, cancelAction?: string): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        message: message,
        title: title,
        continueAction: continueAction,
        cancelAction: cancelAction
      }
    });

    return dialogRef.afterClosed();
  }
}
