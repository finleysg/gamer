import { TestBed, inject } from '@angular/core/testing';
import { Course } from './course';
import { Hole } from './hole';

describe('course model', () => {
  let course: Course;
  const h18 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
  const h9 = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  beforeEach(() => {
    course = new Course();
    course.slope = 133;
  });

  it('#calulateHandicap should return the correct 18 hole handicap', () => {
    course.holes = h18.map(h => {
      const hole = new Hole();
      hole.holeNumber = h;
      return hole;
    });
    expect(course.calculateHandicap(3.7)).toBe(4);
  });

  it('#calulateHandicap should return the correct 9 hole handicap', () => {
    course.holes = h9.map(h => {
      const hole = new Hole();
      hole.holeNumber = h;
      return hole;
    });
    expect(course.calculateHandicap(3.7)).toBe(2);
  });

  it('#round should return handicap index to the nearest tenth', () => {
    expect(course.round(4.235, 1)).toBe(4.2);
  });
});
