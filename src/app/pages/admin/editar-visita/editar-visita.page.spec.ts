import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditarVisitaPage } from './editar-visita.page';

describe('EditarVisitaPage', () => {
  let component: EditarVisitaPage;
  let fixture: ComponentFixture<EditarVisitaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarVisitaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
