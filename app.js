
let csound = require('csound-api');
let Twit = require('twit');

//twitter
var T = new Twit({
  consumer_key:         '9Td3nxDzi8VnoEADiwdNiI1VJ',
  consumer_secret:      'l5wz1aiPisOnkis846nM1t7zlRqmSnukLuLnsg2EZTDczqKw6L',
  access_token:         '156587257-rMpyBUTPlMIBhH5k8aAbZKd16LPNmQ8mWWNmeNNd',
  access_token_secret:  'N4lz1uqzdwIDpLxnymTJYYwrLyG87FRnJaqJHBQMUpFz3',
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
});

// csound shit
const Csound = csound.Create();
csound.SetOption(Csound, '--output=dac');
csound.CompileOrc(Csound, `
  0dbfs = 1

  giFunctionTableID ftgen 0, 0, 64, -2, 9, 9.03, 9.05, 9.07, 9.10, 10, 10.03, 10.05, 10.07, 10.10, 11
  giLowDrone ftgen 0, 0, 64, -2,7, 7.03, 7.05, 7.07, 7.10, 8, 8.03, 8.05, 8.07, 8.10, 9
  giHighDrone ftgen 0, 0, 64, -2, 6, 6.03, 6.05, 6.07, 6.10, 7, 7.03, 7.05, 7.07, 7.10, 8
  giSineTable ftgen 0, 0, 16384, 10, 1

  gaSynthOutL = 0
  gaSynthOutR = 0

  instr 1

	;Pick a random table slot
	ipchndx	random	0,13
	;Find it in the table
	ipch		table	ipchndx, giFunctionTableID

  ;Alternating amplitdue values
  iamp		random	0.5, 1
  ;Random panning
  ipan		random	0, 1

  irelease		random	0.1, 0.4
  iattack     random	0.4, 1
  aenv		expseg	iattack, (p3), irelease

  asig poscil iamp*aenv, cpspch(ipch), giSineTable

  kcf     expon        1000,p3,20    ; descending cutoff frequency
  aSig    moogladder   asig, kcf, iamp ; filter audio signal

     gaSynthOutL += aSig*ipan
     gaSynthOutR += aSig* (1-ipan)

 endin

 instr 4 ; Green Instrument

  iranomone	random	0,13
  ; Table four
  inotelow		table	iranomone, giHighDrone

  irandomtwo	random	0,13
  ; Table three
  inotehigh		table	irandomtwo, giLowDrone

  ;Alternating amplitdue values
  iamp		random	0.03,0.5
  ;Random panning
  ipan		random	0, 1
  ;Percussive sound envelope
  aenv		expseg	0.001, p3*0.25, 1, p3*0.75, 0.001

  ; High Note
  ahigh poscil iamp*aenv, cpspch(inotehigh), giSineTable

  ; Low Harmony
  alow poscil iamp*aenv, cpspch(inotelow), giSineTable
    ;outs 	alow*0.2 + ahigh*0.8, alow*0.2 + ahigh*0.8

    gaSynthOutL += alow*0.2 + ahigh*0.8
    gaSynthOutR += alow*0.2 + ahigh*0.8

endin

  instr 2
  outs gaSynthOutL, gaSynthOutR

gaSynthOutL = 0
gaSynthOutR = 0
  endin
`);
csound.ReadScore(Csound, `
  i2 0 3000

`);

//City
var newYork = [ '-73.98', '40.85', '-73.87', '40.69' ]
//Stream subject
var stream = T.stream('statuses/filter', { track: 'trump protest' }, { locations: newYork })
//Socket with Twitter
count = 0;
stream.on('tweet', function (tweet) {
  //Log the tweet
  console.log(tweet.text);
  //
  // if(Csound !== undefined){
  // csound.ScoreEvent(Csound, "i"[1, 2, 1, 0.1]);
  // }

  // count++;
  if ((Math.round(Math.random()*10) == 7) || (Math.round(Math.random()*10) == 8)){
    csound.ReadScore(Csound, `
      i4 0.01 5
    `);
  }

  csound.ReadScore(Csound, `
    i1 2 1
  `);

});
// stream.on('warning', function (warning) {
// console.log(warning);
// })

if (csound.Start(Csound) === csound.SUCCESS) {
  csound.PerformAsync(Csound, () => csound.Destroy(Csound));
  setTimeout(() => csound.Stop(Csound), 1000000);
}
