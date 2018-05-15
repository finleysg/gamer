import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CourseSelectComponent } from './course-select/course-select.component';
import { CourseCreateComponent } from './course-create/course-create.component';
import { CourseHolesComponent } from './course-holes/course-holes.component';

const routes: Routes = [
  { path: '', children: [
    { path: 'select', component: CourseSelectComponent },
    { path: 'create', component: CourseCreateComponent },
    { path: 'holes/:id', component: CourseHolesComponent }
  ]}
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
