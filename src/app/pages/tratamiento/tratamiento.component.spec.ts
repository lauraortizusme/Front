import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TratamientoComponent } from './tratamiento.component';

describe('TratamientoComponent', () => {
  let component: TratamientoComponent;
  let fixture: ComponentFixture<TratamientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TratamientoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TratamientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
