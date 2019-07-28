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

  tags: string[] = [];

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

  keyPressed(value) {
    if (value[value.length-1] === ',') {
      let newTag = (<HTMLInputElement>document.getElementById("tagsInput")).value;
      newTag = newTag.slice(0, newTag.length-1);
      this.tags.push(newTag);
      (<HTMLInputElement>document.getElementById("tagsInput")).value = '';
      let tempInput = document.getElementById("tagsInput");
      let tagInputContainer = document.getElementById("tagsInputGroup");
      tagInputContainer.innerHTML = '';
      for (let i of this.tags) {
        let tempSpan = document.createElement("span");
        tempSpan.classList.add("tag");
        tempSpan.innerHTML = i;
        let tempButton = document.createElement("button");
        tempButton.classList.add("btn");
        tempButton.classList.add("btn-dark");
        tempButton.classList.add("btn-sm");
        tempButton.innerHTML = "X";
        tempButton.addEventListener("click", (event)=>{
          console.log(this.tags);
          event.target.parentNode.parentNode.removeChild(event.target.parentNode);
          this.tags.splice(this.tags.indexOf(i), 1);
          console.log(this.tags);
        });
        tempSpan.appendChild(tempButton);
        tagInputContainer.appendChild(tempSpan);
      }
      tagInputContainer.appendChild(tempInput);
      document.getElementById("tagsInput").focus();
    }
  }

}
