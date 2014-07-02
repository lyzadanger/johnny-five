var Board = require("../lib/board.js"),
  Timer = require("nanotimer");

function Piezo(opts) {

  Board.Device.call(
    this, opts = Board.Options(opts)
  );

  // Hardware instance properties
  this.mode = this.io.MODES.OUTPUT;
  this.pin = opts.pin || 3;

  this.io.pinMode(this.pin, this.mode);

  // Piezo instance properties
  this.isPlaying = false;
}

Piezo.Notes = {
  "c4": 1911,
  "c#4": 1803,
  "d4": 1702,
  "d#4": 1607,
  "e4": 1516,
  "f4": 1431,
  "f#4": 1352,
  "g4": 1275,
  "g#4": 1203,
  "a4": 1136,
  "a#4": 1072,
  "b4": 1012,
  "c5": 955,
  "c#5": 901,
  "d5": 851,
  "d#5": 803,
  "e5": 768,
  "f5": 715,
  "f#5": 675,
  "g5": 647,
  "g#5": 601,
  "a5": 568,
  "a#5": 541,
  "b5": 506,
  "c6": 477
};

function clearTimer() {
  if(!this.timer) {
    return;
  }

  this.timer.clearInterval();
  delete this.timer;
}

Piezo.prototype.tone = function(tone, duration) {
  clearTimer.call(this);

  this.timer = new Timer();
  var value = 1;

  this.timer.setInterval(function() {
    value = value === 1 ? 0 : 1;
    this.io.digitalWrite(this.pin, value);
  }.bind(this), null, tone + "u", function() {});

  this.timer.setTimeout(clearTimer.bind(this), null, duration + "m");

  return this;
};

<<<<<<< HEAD
Piezo.prototype.play = function(tune) {
  var duration;
  var note = null;
  var beat = 1;
  var tempo = tune.tempo || 150;
  var song = tune.song || [];

=======
Piezo.prototype.frequency = function(frequency, duration) {
  var period = 1 / frequency;
  var duty = period / 2;
  var tone = Math.round(duty * 1000000);

  return this.tone(tone, duration);
};

Piezo.prototype.song = function(tune, beats) {
  var note, duration;
  var tempo = 150;
>>>>>>> master
  var i = 0;
  var next = function() {
    var myNote;

    if (Array.isArray(song[i])) {
      note = song[i][0] || null; // First argument is the note
      beat = song[i][1] || 1; // Second argument is the beat
    }

    duration = beat * tempo;

    if (i++ === song.length) {
      // Song is over
      this.isPlaying = false;
      return;
    }

    if (note === null) {
      this.noTone();
    } else {
      myNote = Piezo.Notes[note.toLowerCase()];
      this.tone(myNote, duration);
    }

    setTimeout(next, duration);
  }.bind(this);

  // We are playing a song
  this.isPlaying = true;

  next();

  return this;
};

Piezo.prototype.noTone = function() {
  this.io.digitalWrite(this.pin, 0);
  clearTimer.call(this);
  
  return this;
};

Piezo.prototype.off = Piezo.prototype.noTone;

module.exports = Piezo;
