import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { MusicService } from '../music.service';

import { TrackJSON } from '../models/trackJSON';

import { LoggerService } from '../logger.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  baseURL: string = "http://localhost:3000";

  toggle: boolean = false;

  constructor(private musicService: MusicService, private httpClient: HttpClient, private loggerService: LoggerService) { }

  ngOnInit() {
  }

  addTrack(): void {
    this.loggerService.add("Adding track -> post request...");
    const newTrack = <TrackJSON>{};
    newTrack.band = "someBand";
    newTrack.track = "someSong";
    newTrack.remix = "skrillex banger";
    newTrack.tags = ["dubstep", "partyHard"];
    this.addTrackHttpRequest(newTrack).subscribe((response) => {this.loggerService.add("Add request returned :" + JSON.stringify(response));});
  }

  addTrackHttpRequest(newTrack: TrackJSON): Observable<TrackJSON> {
    this.loggerService.add("Http post request with :" + JSON.stringify(newTrack));
    return this.httpClient.post<TrackJSON>(this.baseURL, newTrack);
  }

  filterTracks(filter: string): void {
    this.loggerService.add("Filtering :" + filter);
    this.filterTracksHttpRequest(filter).subscribe(response => {this.loggerService.add("Filter request returned :" + JSON.stringify(response))});
  }

  private filterTracksHttpRequest(filter): Observable<TrackJSON[]> {
    this.loggerService.add("Http get request with :" + JSON.stringify(filter));
    const url = `${this.baseURL}/filter`;

    const headers = new HttpHeaders({});
    const params = new HttpParams()
      .set('filter', filter)
    const options = {
      headers,
      params
    }

    return this.httpClient.get<TrackJSON[]>(url, options);
  }

  loadMusic() {
    this.musicService.loadMusicInDB();
  }

  deleteMusic() {
    this.musicService.deleteTrack(<TrackJSON>{}).subscribe();
  }

  deleteMusicArray(track: TrackJSON) {
    this.musicService.deleteTrack(track).subscribe();
  }

  toggleToggle() {
    this.toggle = !this.toggle;
  }

}
