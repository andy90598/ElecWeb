import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  path='dashboard'
  constructor(
    private router:Router
  ) { }

  ngOnInit(): void {
    this.path=this.router.url.split('/').pop() as any;
  }
  Goto(path:string){
    this.router.navigate(['/home/'+path]);
    this.path=path
  }
}
