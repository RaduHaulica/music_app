import { Component, OnInit, Input } from '@angular/core';
import { Variable } from '@angular/compiler/src/render3/r3_ast';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  @Input('passedValue') variable: string;

  constructor() { }

  ngOnInit() {
  }

}
