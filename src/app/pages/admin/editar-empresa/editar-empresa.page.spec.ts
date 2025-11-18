import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditarEmpresaPage } from './editar-empresa.page';

describe('EditarEmpresaPage', () => {
  let component: EditarEmpresaPage;
  let fixture: ComponentFixture<EditarEmpresaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarEmpresaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
