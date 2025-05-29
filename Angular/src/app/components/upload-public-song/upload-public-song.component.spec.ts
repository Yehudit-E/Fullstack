import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadPublicSongComponent } from './upload-public-song.component';

describe('UploadPublicSongComponent', () => {
  let component: UploadPublicSongComponent;
  let fixture: ComponentFixture<UploadPublicSongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadPublicSongComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UploadPublicSongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
