import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Course } from '../../models/course';
import { CourseService } from '../../services/course.service';
import { RoundService } from '../../services/round.service';

@Component({
  selector: 'app-course-select',
  templateUrl: './course-select.component.html',
  styleUrls: ['./course-select.component.css']
})
export class CourseSelectComponent implements OnInit {

  courses: Course[];
  selectedCourse: Course;

  constructor(
    private courseService: CourseService,
    private roundService: RoundService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.courseService.getCourses().subscribe(courses => this.courses = courses);
  }

  onNext(): void {
    if (this.selectedCourse) {
      this.roundService.createRound(this.selectedCourse)
        .subscribe(round => {
          this.router.navigate(['../setup', round.code.toLowerCase(), 'groups'])
            .then((result) => {
              console.log(result);
            })
            .catch((err) => {
              console.error(err);
            });
        });
    }
  }

  onNew(): void {
    this.router.navigate(['create'], { relativeTo: this.route.parent });
  }
}
