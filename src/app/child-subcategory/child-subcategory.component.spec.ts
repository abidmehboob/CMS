import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildSubcategoryComponent } from './child-subcategory.component';

describe('ChildSubcategoryComponent', () => {
  let component: ChildSubcategoryComponent;
  let fixture: ComponentFixture<ChildSubcategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChildSubcategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChildSubcategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
