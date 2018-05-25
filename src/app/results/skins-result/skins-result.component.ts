import { Component, OnInit, Input } from '@angular/core';
import { SkinResult } from '../../models/results';
import { MatTableDataSource } from '@angular/material';
import { DataSource, CollectionViewer } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { RoundService } from '../../services/round.service';
import { Game } from '../../models/game';
import { catchError, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-skins-result',
  templateUrl: './skins-result.component.html',
  styleUrls: ['./skins-result.component.scss']
})
export class SkinsResultComponent implements OnInit {

  @Input() game: Game;

  displayedColumns = ['holeNumber', 'score', 'playerNames', 'amount'];
  dataSource: SkinsDataSource;

  constructor(
    private roundService: RoundService
  ) { }

  ngOnInit() {
    this.dataSource = new SkinsDataSource(this.roundService);
    this.dataSource.loadSkins(this.game);
  }

  refreshResults(): void {
    this.roundService.scoreGame(this.game).subscribe(results => {
      this.dataSource.loadSkins(this.game);
    });
  }
}

export class SkinsDataSource implements DataSource<SkinResult> {

  private skinsSubject = new BehaviorSubject<SkinResult[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();

  constructor(private roundService: RoundService) {}

  connect(collectionViewer: CollectionViewer): Observable<SkinResult[]> {
      return this.skinsSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
      this.skinsSubject.complete();
      this.loadingSubject.complete();
  }

  loadSkins(game: Game) {

      this.loadingSubject.next(true);

      this.roundService.getSkinResults(game).pipe(
          catchError(() => of([])),
          finalize(() => this.loadingSubject.next(false))
      )
      .subscribe(skins => this.skinsSubject.next(skins));
  }
}
