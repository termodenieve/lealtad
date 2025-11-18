import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerEmpresasPage } from './ver-empresas.page';

describe('VerEmpresasPage', () => {
  let component: VerEmpresasPage;
  let fixture: ComponentFixture<VerEmpresasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VerEmpresasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
