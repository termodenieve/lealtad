import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerVisitasPage } from './ver-visitas.page';

describe('VerVisitasPage', () => {
  let component: VerVisitasPage;
  let fixture: ComponentFixture<VerVisitasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VerVisitasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
