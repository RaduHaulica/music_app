export class Track {

    constructor(public band: string = '', public track: string = '', public remix: string = '', public tags: string[] = []) {
    }

    getEntry(format: string): Object | string {
        switch (format) {
            case "JSON": {
                let result = {band: '', track: '', remix: '', tags: []};
                result.band = this.band;
                result.track = this.track;
                result.remix = this.remix;
                result.tags = this.tags;
                return result;
                break; // precaution
            }
            case "string": {
                return "{ band: " + this.band + ", track: " + this.track + (this.remix?(", remix: " + this.remix):"") + (this.tags.length>0?(", tags: " + this.tags.toString()):"") + " }";
                break; // precaution
            }
                
        }
    }
}