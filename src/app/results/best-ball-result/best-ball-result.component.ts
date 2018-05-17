import { Component, OnInit, Input } from '@angular/core';
import { BestBallResult } from '../../models/results';

@Component({
  selector: 'app-best-ball-result',
  templateUrl: './best-ball-result.component.html',
  styleUrls: ['./best-ball-result.component.scss']
})
export class BestBallResultComponent implements OnInit {

  @Input() results: BestBallResult[];

  constructor() { }

  ngOnInit() {
  }

}
