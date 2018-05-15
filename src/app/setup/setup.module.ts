import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { routing } from './setup-routing.module';
import { SharedModule } from '../shared/shared.module';
import { SummaryComponent } from './summary/summary.component';
import { GroupCreateComponent } from './groups/group-create.component';
import { GamesComponent } from './games/games.component';
import { GameComponent } from './game/game.component';
import { TeamFilterPipe } from './game/team-filter.pipe';
import { SetupComponent } from './setup.component';
import { TeamGameComponent } from './team-game/team-game.component';
import { MatchGameComponent } from './match-game/match-game.component';
import { IndividualGameComponent } from './individual-game/individual-game.component';
import { PayoutsComponent } from './payouts/payouts.component';


@NgModule({
  imports: [
    SharedModule,
    routing
  ],
  declarations: [
    SetupComponent,
    SummaryComponent,
    GroupCreateComponent,
    GamesComponent,
    GameComponent,
    TeamFilterPipe,
    TeamGameComponent,
    MatchGameComponent,
    IndividualGameComponent,
    PayoutsComponent
  ]
})
export class SetupModule { }
