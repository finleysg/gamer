import { Injectable } from '@angular/core';
import { Course } from '../models/course';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseService } from './base.service';

@Injectable()
export class CourseService extends BaseService {

  private resource = `${this.baseUrl}/courses/`;

  constructor(
    private http: HttpClient
  ) {
    super();
  }

  getCourses(): Observable<Course[]> {
    return this.http.get(this.resource).pipe(
      map((json: any) => {
        return json.map(c => new Course().fromJson(c));
      })
    );
  }

  getCourse(id: number): Observable<Course> {
    return this.http.get(`${this.resource}${id}/`).pipe(
      map((json: any) => {
        return new Course().fromJson(json);
      })
    );
  }

  createCourse(course: Course): Observable<Course> {
    return this.http.post(this.resource, course.toJson(), {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
    }).pipe(
      map((json: any) => {
        return new Course().fromJson(json);
      })
    );
  }

  updateCourse(course: Course): Observable<Course> {
    return this.http.put(`${this.resource}${course.id}/`, course.toJson(), {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
    }).pipe(
      map((json: any) => {
        return new Course().fromJson(json);
      })
    );
  }
}
