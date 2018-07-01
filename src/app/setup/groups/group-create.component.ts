import { Component, OnInit } from '@angular/core';
import { Group } from '../../models/group';
import { Router, ActivatedRoute } from '@angular/router';
import { cloneDeep } from 'lodash';
import { Round } from '../../models/round';
import { RoundService } from '../../services/round.service';
import { UserService } from '../../services/user.service';
import { User, PublicMember } from '../../models/user';
import { Player } from '../../models/player';

@Component({
  templateUrl: './group-create.component.html',
  styleUrls: ['./group-create.component.css']
})
export class GroupCreateComponent implements OnInit {

  round: Round;
  user: User;
  friends: PublicMember[];

  constructor(
    private roundService: RoundService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.data
      .subscribe((data: {round: Round}) => {
        this.round = data.round;
        // Don't make the user add the first group
        if (this.round.groups.length === 0) {
          this.round.newGroup();
        }
      });
    this.userService.currentUser$.subscribe(u => this.user = u);
    this.userService.friends().subscribe(friends => this.friends = friends);
  }

  addGroup(): void {
    this.round.newGroup();
  }

  removeGroup(groupNumber: number): void {
    const group = this.round.removeGroup(groupNumber);
    if (group.id) {
      this.roundService.deleteGroup(group).subscribe(r => this.round = r);
    }
  }

  addPlayer(group: Group): void {
    this.round.addPlayer(group);
  }

  assignFriend(friend: PublicMember, player: Player): void {
    player.memberId = friend.id;
    player.name = friend.lastName;
    player.handicapIndex = friend.handicap;
  }

  assignYourself(group: Group): void {
    const player = group.players.find(p => !p.name);
    if (player) {
      player.memberId = this.user.member.id;
      player.name = this.user.lastName;
      player.handicapIndex = this.user.member.handicap;
    }
  }

  removePlayer(group: Group, player: Player): void {
    this.round.removePlayer(group, player);
  }

  onNext(): void {
    this.roundService.saveGroups(this.round)
      .subscribe(() => {
        this.router.navigate(['games'], { relativeTo: this.route.parent });
      });
  }
}
