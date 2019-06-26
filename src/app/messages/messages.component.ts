import { Component, OnInit } from '@angular/core';

import { LoggerService } from '../logger.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  constructor(public logger: LoggerService) { }

  ngOnInit() {
  }

}
