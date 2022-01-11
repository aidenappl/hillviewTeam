import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetCreatorComponent } from './asset-creator.component';

describe('AssetCreatorComponent', () => {
  let component: AssetCreatorComponent;
  let fixture: ComponentFixture<AssetCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetCreatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
