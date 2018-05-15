import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { routing } from './courses-routing.module';
import { CourseSelectComponent } from './course-select/course-select.component';
import { CourseCreateComponent } from './course-create/course-create.component';
import { CourseHolesComponent } from './course-holes/course-holes.component';

@NgModule({
  imports: [
    routing,
    SharedModule
  ],
  declarations: [CourseSelectComponent, CourseCreateComponent, CourseHolesComponent]
})
export class CoursesModule { }
