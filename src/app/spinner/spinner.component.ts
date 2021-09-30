import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SpinnerService } from './spinner.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent implements OnInit {

  showSpinner =true;

  constructor(
    private spinnerService:SpinnerService,
    private cdRef:ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.init();
  }

  init(){
    this.spinnerService.GetSpinnerObserver().subscribe(x=>{
      this.showSpinner = x ==='start' || x==='';
      console.log(this.showSpinner = x ==='start' || x==='')
      this.cdRef.detectChanges();
    });
  }

}
