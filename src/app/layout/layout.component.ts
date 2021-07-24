import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  path='dashboard';
  constructor(
    private router:Router
  ) { }

  ngOnInit(): void {
  }
  Goto(path:string){
    this.path=path
    this.router.navigate(['/home/'+path])
  }
}
