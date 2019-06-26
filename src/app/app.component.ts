import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title: string = 'music';
  appTitle: string = 'Music filter';
  valueToBePassed: string = 'some value over here';
}
