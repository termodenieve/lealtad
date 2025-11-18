import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardEmpresaPage } from './dashboard-empresa.page';

describe('DashboardEmpresaPage', () => {
  let component: DashboardEmpresaPage;
  let fixture: ComponentFixture<DashboardEmpresaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardEmpresaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
