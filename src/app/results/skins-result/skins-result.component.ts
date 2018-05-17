import { Component, OnInit, Input } from '@angular/core';
import { SkinResult } from '../../models/results';

@Component({
  selector: 'app-skins-result',
  templateUrl: './skins-result.component.html',
  styleUrls: ['./skins-result.component.scss']
})
export class SkinsResultComponent implements OnInit {

  @Input() results: SkinResult[];

  displayedColumns = ['holeNumber', 'score', 'playerNames', 'amount'];
  dataSource = this.results;

  constructor() { }

  ngOnInit() {
  }

}
