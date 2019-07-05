import { Component, OnInit, Input } from '@angular/core';

import { TrackJSON } from '../models/trackJSON';

import { MusicService } from '../music.service';

@Component({
  selector: 'app-track',
  templateUrl: './track.component.html',
  styleUrls: ['./track.component.css']
})
export class TrackComponent implements OnInit {

  private exists: boolean = true;
  private edited: boolean = false;

  @Input('track') track: TrackJSON;
  @Input('modalId') modalId: TrackJSON;

  constructor(private musicService: MusicService) { }

  ngOnInit() {
  }

  delete() {
    this.musicService.deleteTrack(this.track).subscribe(result => this.exists = false);
  }

  edit() {
    this.edited = true;
  }

}
