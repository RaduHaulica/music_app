import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Track } from './track';
import { TrackJSON } from './models/trackJSON';

import { LoggerService } from './logger.service';

import * as Config from './config/database';

/**
 * Class that feeds tracks to app.
 * Uses hardcoded values if no DB connection can be established
 */
@Injectable({
  providedIn: 'root'
})
export class MusicService {

  tracks: TrackJSON[] = [];
  baseURL: string = "http://localhost:3000";
  databaseConnection: boolean = false;

  constructor(private httpClient: HttpClient, private loggerService: LoggerService) {
    this.testConnection().subscribe(
      (data) => {
        this.loggerService.add(data);
        this.databaseConnection = true;
      },
      (error) => {
        this.loggerService.add("error");
        for (let i in error) {
          this.loggerService.add(i + ": " + error[i]);
        }
        if (error.status !== 200) {
          this.databaseConnection = false;
        }
        this.parseMusicRegexp();
      }
    );

  }

  testConnection(): Observable<string> {
    const url = `${this.baseURL}/test`;
    return this.httpClient.get(url, {responseType: 'text'});
  }

  addTrack(track: TrackJSON) {
    this.loggerService.add("Music service making add call");
    const url = `${this.baseURL}/`;

    return this.httpClient.post(url, track);
  }

  deleteTrack(track: TrackJSON) {
    this.loggerService.add("Music service delete call :" + JSON.stringify(track));
    let url = `${this.baseURL}/${track._id}`;
    this.loggerService.add("Delete :" + url);


    return this.httpClient.delete(url);
  }
  
  getTracks(): Observable<TrackJSON[]> {
    if (!this.databaseConnection) {
      this.loggerService.add("Not connected to DB, using hardcoded values");
      return of(this.tracks);
    }
    
    this.loggerService.add("Connected to DB, loading values");
    const url = `${this.baseURL}/`;
    return this.httpClient.get<TrackJSON[]>(url);
  }

  filterTracks(filter: string): Observable<TrackJSON[]> {
    if (!this.databaseConnection) {
      this.loggerService.add("Filter: Not connected to DB, using hardcoded values");
      return of(this.tracks.filter(el => el.band.toLowerCase().includes(filter.toLowerCase()) || el.track.toLowerCase().includes(filter.toLowerCase())));
    }

    this.loggerService.add("Filter: Connected to DB, loading values");
    const url = `${this.baseURL}/filter`
    
    const params = new HttpParams()
    .set('filter', filter);
    const options = {
      params: params
    }

    return this.httpClient.get<TrackJSON[]>(url, options);
  }

  /**
   * parses a big string and divides it into song entries
   * original string parser, replaced by parseMusicRegex
   */
  parseMusic(): void {
    this.tracks = [];
    let musicTracksRaw = this.getMusic();


    for (let trackRaw of musicTracksRaw.split("\n")) {
      let json = {band: '', track: '', remix: '', tags: []};
      // this.loggerService.add("RAW: " + trackRaw);
      if (trackRaw.includes("[")) {
        let tags = trackRaw.split("[")[1].trim();
        tags = tags.slice(0, tags.length-1);
        json.tags = tags.split(",").map(x => x.trim());
        trackRaw = trackRaw.split("[")[0].trim();
      }

      if (trackRaw.includes("(")) {
        let remix = trackRaw.split("(")[1].trim();
        remix = remix.slice(0, remix.length-1);
        json.remix = remix;
        trackRaw = trackRaw.split("(")[0].trim();
      }
      json.band = trackRaw.split("-")[0].trim()
      json.track = trackRaw.split("-")[1].trim();

      // let newTrack = new Track(json.band, json.track, json.remix, json.tags);
      let newTrack = {
        band: json.band,
        track: json.track,
        remix: json.remix,
        tags: json.tags
      };
      // this.loggerService.add("new track: " + newTrack.getEntry("string"));
      this.tracks.push(newTrack);

      // testing 'this' binding with some async calls
      // setTimeout(function(newTrack){
      //   this.tracks.push(newTrack);
      // }.bind(this), 0, newTrack);
    }
  }

  parseMusicRegexp(): void {
    this.tracks = [];
    let musicTracksRaw = this.getMusic();
    for (let trackRaw of musicTracksRaw.split('\n')) {
      let json = {band: '', track: '', remix: '', tags: []};
  
      let re = /([a-zA-Z 0-9&.'/_]+)\s*\-\s*([a-zA-Z 0-9&.'/_]+)\s*(\([a-zA-Z 0-9&.'/_]+\))?\s*(\[[a-zA-Z ,0-9]+\])?/;
      let groups = trackRaw.match(re);
      json.band = groups[1].trim();
      json.track = groups[2].trim();
      json.remix = groups[3] === undefined?'':groups[3].trim();
      if (groups[4] === undefined) {
        json.tags = [];
      } else {
        groups[4].trim();
        let temp = groups[4].slice(1, groups[4].length-1);
        json.tags = temp.split(",").map(x => x.trim());
      }
  
      let newTrack = <TrackJSON>{};
      newTrack.band = json.band;
      newTrack.track = json.track;
      newTrack.remix = json.remix;
      newTrack.tags = json.tags;
  
      this.tracks.push(newTrack);
    }

  }

  /**
   * only call once to initialize empty database
   */
  loadMusicInDB(): void {
    this.parseMusicRegexp();
    this.tracks.forEach(track => this.addTrack(track).subscribe())
  }

  /**
   * // TODO require('fs');
   * fs.readFile("music.txt", (err, buffer) => {
   *   if (err) throw err;
   *   return JSON.parse(buffer);
   * })
   */
  public getMusic(): string {return `Danny dubz - runaway
Antwoord - evil boy
Dusty kid - kore [techno]
paul kalkbrenner - revolte
MOON - hydrogen
Dub mafia - breakneck
Beastie boys - make some noise
Shaggy akon - what is love
Original sin taxman - take no more
Dub & run - High elephant - ragga dubstep
Clouds - elders wadadda refix
Dj fresh - gold dust (flux pavilion) [dnb, drum and bass]
Three doors down - kryptoniteo
Plan b - love goes down doctor p
Chase status - let you go
Crystal clear stapleton - levels
Fever ray - keep the streets empty for me
Flyleaf - all around me
Infected mushroom - heavy weight
Ez3kiel - lethal submission
Sebastien Tellier - la ritournelle
Shwayze - buzzin
The hives - well alright
Stone sour - through glass
Clouds - elders wadadda refix
Kings of leon - closer
The drawbacks - complicated
The cult - painted on my heart
Unsun - whispers
Riddle - you're done
Mutated forms - wastegash
Ocs - stai calm
Citizen cope - sideways
Noir desir - le vent nous portera
Ken andrews - up or down
Alicia keys - new york
Nylon beats - like a fool
Placebo - taste in men
Likly li - ill follow
Toddla t - take it back
Phil spector - da doo ron ron
Tc - tap ho
Dr. Dre vs. Depeche Mode - Still Losing Myself
lady antebellum - need you now
Saul williams - List of demands
Paul kalkbtenner - Sky and sand
Blue october - hate me
Rhcp - quoxicelixi
Massive attack - paradise circus dubstep
Riva starr tomova - bulgarian chicks
Dub pistols - official chemical
Plazma - jump in my car
Example - kickstarts
Mitsouura - lei toi
Jj - still
Alborosie - herbalist (numa crew remix)
Roa - sonata in la minor
The king blues - future aint what it used to be
Tantrum desire - pump (drumsound & bassline smith remix)
Phantogram - i'm small
Orphaned land - ocean land
olly murs - skips a beat
Gemini - turn me on
Gorrilaz - dare (soulwax remix)
Ocs - inca o gluma proasta
Supermode - tell me why
William naraine - if i could fall
Red snapper - regrettable
Gorillaz - dare soulwax remix
Lana del rey - blue jeans
Goatee - somebody that i used to know
People in plains - falling by the wayside
Skrillex - kyoto feat sirah
Don diablo feat dragonette - animale
Skream feat example - shot yourself in the foot again
Kaskade feat skrillex - lick it
Lana del rey - born to die
Asaf avidan - small change girl
The pierces - turn on billie
Praf in ochi - mintea mea
Koop - koop island blues
Three days grace - over & over
Awol nation - sail
Skirm - sail (dubstep remix)
Foxy shazam - a dangeous man
De staat - the fantastic journey of the underground man
From first to last - the one armed boxer vs the flying guillotine
Biting elbows - bad motherfucker
Hawthorne heights - ohio is for lovers
Bring me the horizon - sleep with one eye open tek one
Bigott - cannibal dinner
The specials - ghosttown
Take that - kidz
Other lives - tamer animals
Pendulum - propane nightmares
A-ha - forever not yours
Freestylers pendulum sirreal - jump n twist
Waldeck - memories
Crossfade - cold
Banana sessions - drunken dormouse
Army of the pharaohs - dump the clip
Mumford & sons - the cave
Stiltskin - inside
Bon jovi - runaway
John mellencamp - someday the rains will fall
Madonna - american life
Chris brown bla - i can transform ya
Kim wilde - you keep me hangin on
Pointer sisters - im so excited
Cypress hill rusko damian marley - cant keep me down
The kinks - you really got me
Pretty lights - summers gone
Rod stewart - baby jane
Irene cara - flashdance
Paul kalkbrenner - aaron
Fine young cannibals - johnny were sorry
Bran van 3000 - drinking in LA
Locomondo - magiko xali
Kasabian - club foot
Heroes del silencio - entre dos tierras
Le tigre - seconds
Five finger death punch - burn it down
Belzebass - fckn virgin
Stereo mcs - connected
Rod stewart - baby jane
Jeff buckley - grace
Jennifer rush - the power of love
Of monsters and men - little talks
The specials - ghosttown
Dirty dubstepperz - full blown wobble
William de vaughn - be thankful for what youve got
Band of horses - the funeral
Three days grace - i hate evreything about.you
Uptown - miami blue
The killers - where the white boys dance
Tiesto - adagio for strings
New order - blue monday
Rolling stones - miss you
Depeche mode - wrong
Supermode - tell me why
A.skillz - california love
Fly project - musica
The cat empire - wine song
Koop - strange love
Stardust - music sounds better with you
Josh wink - higher state.of consciousness
Judas priest - nightcrawler
Armand van helden - funk phenomenon
Zdob si zdub - FSSO
Wyclef jean feat refugee allstars - 911
Gnarls barkley - gone daddy gone
Red hot chili peppers - look around
Le ramoneurs de menhirs - dans gwadek
Berurier noir - vive le feu
Bon jovi - always
Bring me the horizon - sleep with one eye open tek one remix
Bring me the horizon - chelsea smile
Diplo feat vybz kartel - diplo rythm
Diplo feat panteras os danadinhos - percao
Radiohead - little by little
Luciana - im so hot
The count and sinden feat bashy - addicted to you
Red hot chili peppers - ethiopia
The asteroids galaxy tour - the golden age
Ida maria - i like you so much better when youre naked
Caro emerald - you dont love me
Riva starr - i was drunk
Grandmaster flash and the furious five - the message
Awol nation - sail
The killers - all these things that ive done
Bost & bim - jamaican boy
Naim - skin
Dub pistols - official chemical
Lady antebellum - need you now
Daft punk - something about us
Jamie woon - shoulda
Loadstar - berlin
Arctic monkeys - dancing shoes
Type o negative - green man
Red hot chili peppers - monarchy of roses
The roots - the seed
Dr dre - still dre
Skrillex - dnb ting
Tc - tap ho
Dina vass - waiting for you
De-javu - i cant stop
Salif keita - madan
Nightcrawlers - push the feeling on
Stevie v - dirty money
Beck - where its at
Jet - are you gonna be my girl
Infected mushroom - heavyweight
Rolling stones - has anybody seen my baby
Flyleaf - all around me
King of leon - cold desert
Major lazer feat turbulence - anything goes
Magnetic man ft miss dynamite - fire
Mattafix - living darfur
Pink floyd - high hopes
Nero - me & you
Collie buddz - tomorrows another day
The vines - tv pro
Shwayze - buzzin
Pantera - cemetery gates
Trapt - headstrong
Icepick - onward to victory
Paramore - decode
Snow patrol - this isnt everything you are
Sukh knight - up in smoke
Task horizon - focused locust
Dj hype - bad ass
Gogol bordello - east infection
Erasure - harmony
Creed - bullets
Luna amara - monkey retail
Queens of dogtown - would
Utah saints drumsound bassline smith - what can you do do for me
People in planes - falling by the wayside
The constellations - right where i belong
Mark knight feat skin + noisia - nothing matters
Dragonette - stupid grin
Alex clare - too close
Thomas newman - revolutionary road
Michael nyman - the promise
Feint - snake eyes feat coma
Subformat - more feat charli brix
London elektricity - just one second apex remix
Autumn - its always about the girl lomax remix
Asaf avidan - one day / reckoning song
Kraddy - android porn
Dban - oliver twist
Gravity falls - theme (sim gretina remix)
Opus 3 - its a fine day
Cool kids of death - uwezaj
Gramatik - dungeon sound
Anberlin - unstable
Caro emerald - that man
Totally enormous extinct dinosaurs - gardens
Agnes obel - riverside
Kim wilde - keep me hangin on
Rhcp - happinness loves company
Yeah yeah yeahs - bla away
The verve - sonnet
the horrors - sea wthin a sea
Alberto iglesias - los vestidos desgarrados
phantogram - when im small
Blondie - heart of glass
Findlay - off & on
Journey - wheel in the sky keeps on turning
Boston - more than a feeling
Bill conti - gonna fly now
Crystal stilts - shake the shackles
John newman - love me again
Band of horses - funeral
moby - pale horses
Rudimental - feel the love
Skindred - nobody
ed solo & skool of thought - we play the music
Aka aka ft joachim pastor - sandman
Vondelpark - hipbone
Ben cocks - buils a home
gmorozov - Internet = hate
Dubioza kolektiv - marijuan
Camo & Crooked - breezeblock
Wayz - beyond
Spag heddy - the master
Syntax- mechano mind
Groove armada - song 4 mutya
Weezer- you might think
Mike oldfield - nuclear
Alt-J - breezeblocks
Balkan express - gramatik
Take that - kids
Gesaffelstein - pursuit
Justice - brianvision mmxiii
Flymore - all the times
Rhye - open
Rhye - the fall
Woodkid - iron
The neighbourhod - sweater weather
Taylor swift - i knew you were trouble goat
Ed sheeran - draft / dont
Tove lo - habits hippie sabotage
Flume - the greatest view
Goran bregovic - gas gas
Cut copy - believers
Xs project - bochka bass kolbaser
Tom odell - another love
Perturbator - i am the night album
Heavenwood - moonlight girl
Hermitude - hyper paradise (flume remix)
Chvrches - recover (kingdom remix)
Ta ku - higher (flume remix)
Rodrigo leao - pasion
Sage francis - sea lion
Rootz underground - in the jungle
Dannii minogue - all i wanna do
J2 & blu holiday - born to be wild
Dub fx ft eva lazarus - run
Damage inc - elucidate
Regina spektor - you've got time
nese karabocek - yali yali todd terje remix
Fatboy slim vs benni benassi- what the fuck
Doctor p - sweet shop (camo remix)
Yellowman - Zungguzungguguzungguzeng
Chvrches - science / vision
Solstafir - fjàra
Skalmold - narfi
Simon viklund - i will give you my all
Bloody beetroots + justice - jeremy izàd
Morphine - its not like that anymore
Wedge - puppet master
Paul & wad vs pnau - changes
The raconteurs - steady as she goes
Disclosure - help me lose my mind (mazde remix)
The xx - intro
Ben howard - go your way
Avicii - wake me up
Soko - i thought i was an alien
Ten walls - sparta
Tame impala - feels like we only go backwards
Sia - youve changed
Edward sharpe & the magnetic zeros - home
NASA - gifted - masuka remix
501 - somewhere in time (high rankin remix)
David guetta - baby when the lights go out
3logit - boomerang
3logit - all senses awake
3logit - the dialogue
Dirtyphonics - walk in the fire
Medusa in my knickers - get da f__k out
Morwais - disco science
MegaDrive - acid spit
Nirvana - sappy
Bobby sherman - shes not there
Panda dub - the lost ship
Kevin macleod - scheming weasel
Paradisio - bailando
The four tops - (reach out) ill be there
MSTRKRFT - fist of god
Grauzone - eisbaer
Gotye - the only thing i know
Miami horror - sometimes
Miami horror - i look to you
Absurd - the passage of time (ca2k remix)
Savage - karoshi
Gossip - heavy cross
Bruno mars - locked out of heaven
Robin schulz - sugar
Black rivers - the ship
Black label society - suicode messiah
Manga - we could be the same
Myrath - tale of the sands
Naughty boy + emeli sande - lifted
Queens of the stone age - insane
The beloved - sweet harmony
Kavinsky - nightcall
Desire - under your spell
Beirut - elephant gun
Lucia - silence
Zhu - faded (dnb remix)
Daughter - youth
Flight facilities - crave you
Dopethrone - dark foil
Twenty one pilots - stressed out
Horn of the rhino - speaking tongues
Dirty shirt - mental csardas
Stuck in the sound - let's go
Fever the ghost - source
Blockhead - the music scene
Delta heavy - get by
C2c - delta
Frameless - try
Audioslave - like a stone
Drumsound bassline smith - close
16 bit - texaco
Bounty chiller & skarlatan - wos i mon mini remix
Rishloo - awergen
Russo - bad tonight (shock one remix)
The crystal method - play for real (dirtyphonics remix)
Andy c - high contrast - basement track
Goldfish - we come together
Fall of efrafa - elil
Sam sparro - black and gold
Major look - bass generation, no hope city, levels
Infected mushroom - kazabubu
Netsky - iron heart
Andain - you once told me
Disclosure - you & me (flume remix)
Zeal and ardor - blood in the river
Zeal and ardor - come on down
Miss chang feat taiwan mc & cyph4 - chinese man
Tuxedo - give me the words
Saint motel - my type
Miike snow - genghis khan
The strokes - reptilia
Twenty one pilots - ride
Twenty one pilots - stressed out (metal)
Fit for rivals - freak machine
Vektor - pillars of sand
SARS - perspektiva
LP - lost on you
The ting tings - shut up and let me go
Year of no light - persephone
Blue stahli - scrape
The ocean - the quiet observer
Cat power - the greatest
Hot chip - I feel better
Son lux - lost it to trying
Son lux - easy
Slipknot - xix
Caribou - odessa
Batoushka - litourgiya
Gojira - born in winter
Bullet for my valentine - no way out
Mountain dust - nine years
Royksopp and robyn - monument (inevitable end version)
Royal blood - little monster
Joachim witt - goldener reiter
Chuck ragan - landsick
The hoosiers - goodbye mr a
Corey taylor - from can to cant
Uncle acid - melody lane
Rjd2 - smoke and mirrors
Mefjus - suicide bassline
The prototypes - pop it off
Visage - fade to grey
Axel thesleff - bad karma
Kongos - repeat after me
Royal blood - out of the black
The kills - doing it to death
Massive attack + tricky - take it there
The shoes - time to dance
Ashley deyj - on the road
Kobra kicks - krokodil
Princess chelsea - the cigarette duet
Battles - the yabba
Beat system - whats going on
Concorde - sons
Highly suspect - my name is human
Missio - everybody gets high
B complex - beautiful lies
B complex - tota helpa
The bridge committee - pcip
Clozee - koto
Macky gee - rambunctious vip
Alborosie - poser (yanzee remix)
Flume- warm thoughts
Rawthang - scorned
Noisia - could this be
Spor - empire
Lera lynn - my least favorite life
Portugal the man - feel it still
Sektemtum - aut caesar aut nihil
Jamie T - sticks and stones
Bag raiders - shooting stars
Celelalte cuvinte - daca vrei
Grimus- privestema
Band of horses - the funeral
Showtek - booyah
Purple disco machine - body funk dub edition
Run dmc - rock box
Guano apes - suzie 2017
Eths - harmaguedon
Dj pixie - shock
J-cut & kolt sieverts- the flute tune (soulpride remix)
Ac slater- bass inside
Tesco value - gunshot (feat sizzla)
Kakkmaddafakka - restless
Metronomy - the bay
Ten walls - walking with elephants
Bilderbuch - maschin
Japanese popstars - let go
Birdy nam nam - the parachute ending
DJ quads - punch
Semargl - credo revolution (zardonic remix)
Sybreed - doomsday party neurotech
Die sektor - blood (nitro noise)
2Ska soul feat salon victoria- only skankin 2
Too many zooz - bedford
Gossip - standing in the way of control
Deorro - five hours
Dan croll - from nowhere
David zowie - house every weekend loadstar remix
Extrawelt - pontiac
Greta van fleet - black smoke rising
Jamie xx - gosh
Non tiq - love machine
voicians - generation V
mahmut orhan & colonel bagshot - 6 days
colonel bagshot - six day war
brodka & a_gim - wszystko czego dzis chce
izabela trojanowska - wszystko czego dzis chce
fakear - silver møme remix
lorn - acid rain
alien weaponry - holding my breath
scars on broadway - lives
alien weaponry - kai tangata
metronomy - the look
glass animals - hazey
the blaze - territory
lemaitre - higher
akado - darkside
luxtorpeda - autystyczny
valeria stoica - poate
rejjie snow - blakkst skn
mando diao - good times
santogold - say aha
k.flay - high enough
polarkreis 18 - undendliche sinfonie
friends - im his girl
tove styrke - sway
zebre - totuna
panderator - cruise control (techno viking)
tchami - after life
don diablo - cutting shapes
sub urban - cradles
noisestorm - crab rave
noisestorm - heist
darren styles & dougal & gammer - party don't stop
mampi swift - gangsta
chrom - walked the line
moscow death brigade - ghettoblaster
charmes ft da professor - ready
noisecontrollers - revolution is here
example - kickstep (bar9 remix)
modestep - sunlight
document one - moving together (ft tigerlight & maksim mc)
bruno mars feat. damian marley - liquor store blues
atamone - laurier
black tiger sex machine - rapid fire
black tiger sex machine - sleep now in the fire
black tiger sex machine - religion
syn - cyberpunk
damian marley - it was written - chasing shadows remix
martin slattery + antony genn - shutdown
skepta - shutdown
power francers feat. D-Bag - pompo nelle casse
sunrise avenue - fairytale gone bad
dr kucho - can't stop playing (oliver heldens remix)
salvatore ganacci - horse
celtic frost - a dying god coming into human flesh
skepta - man (jauz remix)
endor - gunna be mine
joyride - fuel tank
voodoo phloat - tremsz
kranksvester - slava
kranksvester - gaber
bronski beat - smalltown boy
thee oh sees - carrion crawler
rompasso - angetenar (purecloud5 remix)
the stranglers - golden brown
fugazi - waiting room
karolina czarnecka - chwytaj trn stan
oameninecunoscuti - alb orbitor
dub fx & g ras - real revolutionary
billie eilish - bury a friend (elijah hill remix)
ohmie - asocial sociopath
lorn - karma
lucyferianski aerobic - satanismus
hazel - i love poland
aaronchupa & little sis nora - llama in my living room
aaronchupa - i'm an albatraoz
halogen - u got that`;
  }
}