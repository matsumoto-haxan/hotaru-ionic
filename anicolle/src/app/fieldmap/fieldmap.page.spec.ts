import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldmapPage } from './fieldmap.page';

describe('FieldmapPage', () => {
  let component: FieldmapPage;
  let fixture: ComponentFixture<FieldmapPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FieldmapPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldmapPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
