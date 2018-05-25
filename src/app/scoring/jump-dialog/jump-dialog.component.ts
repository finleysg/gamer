import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { Group } from '../../models/group';
import { Hole } from '../../models/hole';

@Component({
  selector: 'app-jump-dialog',
  templateUrl: './jump-dialog.component.html',
  styleUrls: ['./jump-dialog.component.scss']
})
export class JumpDialogComponent implements OnInit {

  holes: Hole[];
  group: Group;

  constructor(
    public dialogRef: MatDialogRef<JumpDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router
  ) {
    this.holes = data.holes as Hole[];
    this.group = data.group as Group;
  }

  ngOnInit() {
  }

  goToHole(holeNumber: number): void {
    this.dialogRef.close(holeNumber);
  }
}
