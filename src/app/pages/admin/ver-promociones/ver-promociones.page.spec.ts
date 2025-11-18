import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerPromocionesPage } from './ver-promociones.page';

describe('VerPromocionesPage', () => {
  let component: VerPromocionesPage;
  let fixture: ComponentFixture<VerPromocionesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VerPromocionesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
