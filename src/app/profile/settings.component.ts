import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Options } from '../models/options';

@Component({
    templateUrl: 'settings.component.html'
})
export class SettingsComponent implements OnInit {

    options: Options;

    constructor(
        private userService: UserService
    ) {
    }

    ngOnInit(): void {
        this.userService.options.subscribe(o => this.options = o);
    }

    sendOptions(): void {
        this.userService.updateOptions(this.options);
    }
}
