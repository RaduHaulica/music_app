import { Component, OnInit, Input } from '@angular/core';

import { Observable, Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { Track } from '../track';
import { TrackJSON } from '../models/trackJSON';

import { MusicService } from '../music.service';

import { LoggerService } from '../logger.service';

@Component({
  selector: 'app-track-list',
  templateUrl: './track-list.component.html',
  styleUrls: ['./track-list.component.css']
})
export class TrackListComponent implements OnInit {

  tracks$: Observable<TrackJSON[]>;
  newTrack: TrackJSON;
  adding = false;
  private filterTerms = new Subject<string>();

  // push new search term into observable stream
  search(term: string = ""): void {
    this.filterTerms.next(term);
  }

  constructor(private musicService: MusicService, private loggerService: LoggerService) {
  }

  ngOnInit() {
    this.tracks$ = this.filterTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.filterTracks(term))
    );
    setTimeout(function(){this.search("");}.bind(this), 0);

    this.newTrack = {
      _id: "",
      band: "",
      track: "",
      remix: "",
      tags: []
    };
  }
  
  public clear(): void {
    this.tracks$ = of(<TrackJSON[]>[]);
  }
  private getTracks() {
    this.musicService.getTracks().subscribe(tracks => this.tracks$ = of(tracks));
  }
  
  private addTrackModal() {
    this.loggerService.add("Adding new track");
    this.adding = true;
    $('#addTrackModal').modal('show');
    // const newTrack = <TrackJSON>{band: "bandName", track: "trackName"};
  }
  
  private addTrack(newTrack: TrackJSON) {
    this.musicService.addTrack(newTrack).subscribe(response => this.loggerService.add(JSON.stringify(response)));
  }

  private filterTracks(filter: string) {
    this.loggerService.add("Filtering : " + filter);
    return this.musicService.filterTracks(filter);
  }

    /**
   * this does a lot of work; tags and input are child nodes of div styled like a form input
   * the actual input has no style to blend seamlessly into the background
   *     - checks for "," character and pushes input value to tags array
   *     - creates new HTML element for tag
   *     - floats tags to the left, pushing input to the right
   *     - sticks an event listener on the tag "X" button to delete the tag
   */
  keyPressed(value) {
    if (value[value.length-1] === ',') {
      let newTag = (<HTMLInputElement>document.getElementById("tagsInputAdd")).value;
      newTag = newTag.slice(0, newTag.length-1);
      if (newTag.length === 0) {
        (<HTMLInputElement>document.getElementById("tagsInputAdd")).value = '';
        document.getElementById("tagsInputAdd").focus();
        return;
      }
      this.newTrack.tags.push(newTag);
      (<HTMLInputElement>document.getElementById("tagsInputAdd")).value = '';
      let tempInput = document.getElementById("tagsInputAdd");
      let tagInputContainer = document.getElementById("tagsInputGroupAdd");
      tagInputContainer.innerHTML = '';
      for (let i of this.newTrack.tags) {
        let tempSpan = document.createElement("span");
        tempSpan.classList.add("tag");
        tempSpan.innerHTML = i;
        let tempButton = document.createElement("button");
        tempButton.classList.add("btn");
        tempButton.classList.add("btn-dark");
        tempButton.classList.add("btn-sm");
        tempButton.innerHTML = "X";
        tempButton.addEventListener("click", (event)=>{
          (<HTMLSpanElement>event.target).parentNode.parentNode.removeChild((<HTMLSpanElement>event.target).parentNode);
          this.newTrack.tags.splice(this.newTrack.tags.indexOf(i), 1);
        });
        tempSpan.appendChild(tempButton);
        tagInputContainer.appendChild(tempSpan);
      }
      tagInputContainer.appendChild(tempInput);
      document.getElementById("tagsInputAdd").focus();
    }
  }

}
