import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Course } from '../../models/course';
import { RoundService } from '../../services/round.service';
import { CourseService } from '../../services/course.service';
import { Round } from '../../models/round';

@Component({
  selector: 'app-course-holes',
  templateUrl: './course-holes.component.html',
  styleUrls: ['./course-holes.component.css']
})
export class CourseHolesComponent implements OnInit, OnDestroy {

  course: Course;
  round: Round;
  private subscription: Subscription;

  constructor(
    private roundService: RoundService,
    private courseService: CourseService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.subscription = this.roundService.currentRound.subscribe(round => {
      this.course = round.course;
      this.round = round;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onNext() {
    this.courseService.updateCourse(this.course).subscribe(() => {
      this.router.navigate(['/setup', this.round.code, 'groups']);
    });
  }
}
