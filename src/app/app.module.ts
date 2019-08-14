import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { TrackComponent } from './track/track.component';
import { TrackListComponent } from './track-list/track-list.component';
import { MessagesComponent } from './messages/messages.component';
import { SearchComponent } from './search/search.component';
import { TestComponent } from './test/test.component';

import * as bootstrap from 'bootstrap';
import * as $ from 'jquery';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    TrackComponent,
    TrackListComponent,
    MessagesComponent,
    SearchComponent,
    TestComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
