import { Component, ViewChild, Output, EventEmitter } from '@angular/core';
import { MenuService, Menu } from './menu.service';
import { isArray } from 'util';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  providers: [MenuService]
})
export class MenuComponent {

  public menu: Menu[];

  constructor(
    public menuService: MenuService,
    private router: Router
  ) {
    this.menuService.getMenu().subscribe(menu => this.menu = menu);
  }

  navigateTo(parent: string[], child: string[]): void {
    const commands = ['/'];
    parent.forEach(p => commands.push(p));
    if (child) {
      child.forEach(c => commands.push(c));
    }
    this.router.navigate(commands);
  }
}
