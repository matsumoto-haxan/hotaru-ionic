import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QrmodalComponent } from './qrmodal.component';

describe('QrmodalComponent', () => {
  let component: QrmodalComponent;
  let fixture: ComponentFixture<QrmodalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QrmodalComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QrmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
