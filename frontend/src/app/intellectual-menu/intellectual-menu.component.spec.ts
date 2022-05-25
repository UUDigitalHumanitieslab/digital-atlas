import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import { IntellectualMenuComponent } from './intellectual-menu.component';

describe('IntellectualMenuComponent', () => {
  let component: IntellectualMenuComponent;
  let fixture: ComponentFixture<IntellectualMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IntellectualMenuComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: new BehaviorSubject({ id: 1 })
          }
        }],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IntellectualMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
