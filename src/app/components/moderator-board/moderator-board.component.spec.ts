import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeratorBoardComponent } from './moderator-board.component';

describe('ModeratorBoardComponent', () => {
  let component: ModeratorBoardComponent;
  let fixture: ComponentFixture<ModeratorBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModeratorBoardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModeratorBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
