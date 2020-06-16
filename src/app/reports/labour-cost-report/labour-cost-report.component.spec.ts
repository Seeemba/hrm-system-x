import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LabourCostReportComponent } from './labour-cost-report.component';
import {ReportService} from '../report.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('LabourCostReportComponent', () => {
  let component: LabourCostReportComponent;
  let fixture: ComponentFixture<LabourCostReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        BrowserAnimationsModule
      ],
      providers: [ReportService],
      declarations: [ LabourCostReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabourCostReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
