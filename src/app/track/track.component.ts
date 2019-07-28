import { Component, OnInit, Input } from '@angular/core';

import { TrackJSON } from '../models/trackJSON';

import { MusicService } from '../music.service';

import { LoggerService } from '../logger.service';


@Component({
  selector: 'app-track',
  templateUrl: './track.component.html',
  styleUrls: ['./track.component.css']
})
export class TrackComponent implements OnInit {

  private exists: boolean = true;
  private edited: boolean = false;
  private modalIdName: string = "";

  @Input('track') track: TrackJSON;
  @Input('modalId') modalId: string;

  constructor(private musicService: MusicService, private loggerService: LoggerService) { }

  ngOnInit() {
    // need this for jQuery selector
    this.modalIdName = "#" + this.modalId;
  }

  /**
   * this creates tag elements for the tags input in the edit form
   * tags need to be generated from track.tags array
   */
  populateInput(): void {
    // (<HTMLInputElement>document.getElementById("tags-"+this.track._id)).value = '';
    let tempInput = document.getElementById("tags-"+this.track._id);
    let tagInputContainer = document.getElementById("tagsInputGroup-"+this.track._id);
    tagInputContainer.innerHTML = '';
    for (let i of this.track.tags) {
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
        this.track.tags.splice(this.track.tags.indexOf(i), 1);
      });
      tempSpan.appendChild(tempButton);
      tagInputContainer.appendChild(tempSpan);
    }
    tagInputContainer.appendChild(tempInput);
    document.getElementById("tags-"+this.track._id).focus();
    return ;
  }

  delete() {
    this.musicService.deleteTrack(this.track).subscribe(result => this.exists = false);
  }

  saveTrack(track: TrackJSON) {
    this.musicService.updateTrack(track).subscribe(result => this.track = track);
  }

  edit() {
    this.edited = true;
    // HACK TIME BOIS! this forces the modal edit form to open
    $(this.modalIdName).modal('show');

    // tags need to be generated from track.tags array
    // populate the modified tags input with the tags when opening the form
    if (this.track.tags.length > 0) {
      this.populateInput();
    }
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
      let newTag = (<HTMLInputElement>document.getElementById("tags-"+this.track._id)).value;
      newTag = newTag.slice(0, newTag.length-1);
      if (newTag.length === 0) {
        (<HTMLInputElement>document.getElementById("tags-"+this.track._id)).value = '';
        document.getElementById("tags-"+this.track._id).focus();
        return;
      }
      this.track.tags.push(newTag);
      (<HTMLInputElement>document.getElementById("tags-"+this.track._id)).value = '';
      let tempInput = document.getElementById("tags-"+this.track._id);
      let tagInputContainer = document.getElementById("tagsInputGroup-"+this.track._id);
      tagInputContainer.innerHTML = '';
      for (let i of this.track.tags) {
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
          this.track.tags.splice(this.track.tags.indexOf(i), 1);
        });
        tempSpan.appendChild(tempButton);
        tagInputContainer.appendChild(tempSpan);
      }
      tagInputContainer.appendChild(tempInput);
      document.getElementById("tags-"+this.track._id).focus();
    }
  }

}
