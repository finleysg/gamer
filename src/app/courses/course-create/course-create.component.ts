import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Course } from '../../models/course';
import { CourseService } from '../../services/course.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-course-create',
  templateUrl: './course-create.component.html',
  styleUrls: ['./course-create.component.css']
})
export class CourseCreateComponent implements OnInit {

  course: Course;
  canEdit: boolean;

  constructor(
    private courseService: CourseService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.params.subscribe(p => {
      const id = +p['id'];
      this.courseService.getCourse(id).subscribe(c => {
        this.course = c;
        this.canEdit = this.course.owner === this.userService.user.member.id;
      });
    });
  }

  save(): void {
    this.courseService.updateCourse(this.course).subscribe((c: Course) => {
      this.course = c;
    });
  }

  copy(): void {
    this.course.id = null;
    this.course.name = `${this.course.name} Copy`;
    this.course.owner = this.userService.user.member.id;
    this.courseService.createCourse(this.course).subscribe(c => {
      this.router.navigate([c.id], {relativeTo: this.route.parent});
    });
  }
}
