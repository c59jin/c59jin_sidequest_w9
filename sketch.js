/*
  Week 9 — Example 3: Adding Sound & Music
  Modified with a debug screen

  Controls:
    A or D (Left / Right Arrow)   Horizontal movement
    W (Up Arrow)                  Jump
    Space Bar                     Attack

  Debug Controls:
    1                             Toggle Moon Gravity
    2                             Toggle Debug Hitboxes / Sensor
    R                             Reset Player Position
    TAB                           Show / Hide Debug Panel
*/

let player;
let sensor;

let playerImg, bgImg;
let jumpSfx, musicSfx;
let musicStarted = false;

let playerAnis = {
  idle: { row: 0, frames: 4, frameDelay: 10 },
  run: { row: 1, frames: 4, frameDelay: 3 },
  jump: { row: 2, frames: 3, frameDelay: Infinity, frame: 0 },
  attack: { row: 3, frames: 6, frameDelay: 2 },
};

let ground, groundDeep;
let groundImg, groundDeepImg;

let attacking = false;
let attackFrameCounter = 0;

// --- TILE MAP ---
let level = [
  "              ",
  "              ",
  "              ",
  "              ",
  "              ",
  "       ggg    ",
  "gggggggggggggg",
  "dddddddddddddd",
];

// --- LEVEL CONSTANTS ---
const VIEWW = 320,
  VIEWH = 180;

const TILE_W = 24,
  TILE_H = 24;

const FRAME_W = 32,
  FRAME_H = 32;

const MAP_START_Y = VIEWH - TILE_H * 4;

// --- GRAVITY ---
const NORMAL_GRAVITY = 10;
const MOON_GRAVITY = 1.6;

// --- DEBUG VARIABLES ---
let moonGravityOn = false;
let showDebugPanel = true;
let showHitboxes = false;

function preload() {
  // --- IMAGES ---
  playerImg = loadImage("assets/foxSpriteSheet.png");
  bgImg = loadImage("assets/combinedBackground.png");
  groundImg = loadImage("assets/groundTile.png");
  groundDeepImg = loadImage("assets/groundTileDeep.png");

  // --- SOUND ---
  if (typeof loadSound === "function") {
    jumpSfx = loadSound("assets/sfx/jump.wav");
    musicSfx = loadSound("assets/sfx/music.wav");
  }
}

function setup() {
  new Canvas(VIEWW, VIEWH, "pixelated");

  allSprites.pixelPerfect = true;

  world.gravity.y = NORMAL_GRAVITY;

  if (musicSfx) musicSfx.setLoop(true);
  startMusicIfNeeded();

  // --- TILE GROUPS ---
  ground = new Group();
  ground.physics = "static";
  ground.img = groundImg;
  ground.tile = "g";

  groundDeep = new Group();
  groundDeep.physics = "static";
  groundDeep.img = groundDeepImg;
  groundDeep.tile = "d";

  new Tiles(level, 0, 0, TILE_W, TILE_H);

  // --- PLAYER ---
  player = new Sprite(FRAME_W, MAP_START_Y, FRAME_W, FRAME_H);
  player.spriteSheet = playerImg;
  player.rotationLock = true;

  player.anis.w = FRAME_W;
  player.anis.h = FRAME_H;
  player.anis.offset.y = -4;
  player.addAnis(playerAnis);
  player.ani = "idle";
  player.w = 18;
  player.h = 20;
  player.friction = 0;
  player.bounciness = 0;

  // make debug collider visible when needed
  player.colliderColor = color(0, 255, 0);

  // --- GROUND SENSOR ---
  sensor = new Sprite();
  sensor.x = player.x;
  sensor.y = player.y + player.h / 2;
  sensor.w = player.w;
  sensor.h = 2;
  sensor.mass = 0.01;
  sensor.removeColliders();
  sensor.visible = false;
  sensor.color = color(255, 0, 0);

  let sensorJoint = new GlueJoint(player, sensor);
  sensorJoint.visible = false;
}

function startMusicIfNeeded() {
  if (musicStarted || !musicSfx) return;

  const startLoop = () => {
    if (!musicSfx.isPlaying()) musicSfx.play();
    musicStarted = musicSfx.isPlaying();
  };

  const maybePromise = userStartAudio();
  if (maybePromise && typeof maybePromise.then === "function") {
    maybePromise.then(startLoop).catch(() => {});
  } else {
    startLoop();
  }
}

function keyPressed() {
  startMusicIfNeeded();

  // --- DEBUG TOGGLES ---
  if (key === "1") {
    moonGravityOn = !moonGravityOn;
    world.gravity.y = moonGravityOn ? MOON_GRAVITY : NORMAL_GRAVITY;
  }

  if (key === "2") {
    showHitboxes = !showHitboxes;
    sensor.visible = showHitboxes;
  }

  if (key === "r" || key === "R") {
    resetPlayer();
  }

  if (keyCode === TAB) {
    showDebugPanel = !showDebugPanel;
    return false; // stop browser tab switching
  }
}

function mousePressed() {
  startMusicIfNeeded();
}

function touchStarted() {
  startMusicIfNeeded();
  return false;
}

function resetPlayer() {
  player.x = FRAME_W;
  player.y = MAP_START_Y;
  player.vel.x = 0;
  player.vel.y = 0;
  attacking = false;
  attackFrameCounter = 0;
  player.ani = "idle";
}

function draw() {
  // --- BACKGROUND ---
  camera.off();
  imageMode(CORNER);
  image(bgImg, 0, 0, bgImg.width, bgImg.height);
  camera.on();

  // --- PLAYER CONTROLS ---
  let grounded = sensor.overlapping(ground);

  // -- ATTACK INPUT --
  if (grounded && !attacking && kb.presses("space")) {
    attacking = true;
    attackFrameCounter = 0;
    player.vel.x = 0;
    player.ani.frame = 0;
    player.ani = "attack";
    player.ani.play();
  }

  // -- JUMP --
  if (grounded && kb.presses("up")) {
    player.vel.y = -4;
    if (jumpSfx) jumpSfx.play();
  }

  // --- STATE MACHINE ---
  if (attacking) {
    attackFrameCounter++;
    if (attackFrameCounter > 12) {
      attacking = false;
      attackFrameCounter = 0;
    }
  } else if (!grounded) {
    player.ani = "jump";
    player.ani.frame = player.vel.y < 0 ? 0 : 1;
  } else {
    player.ani = kb.pressing("left") || kb.pressing("right") ? "run" : "idle";
  }

  // --- MOVEMENT ---
  if (!attacking) {
    player.vel.x = 0;
    if (kb.pressing("left")) {
      player.vel.x = -1.5;
      player.mirror.x = true;
    } else if (kb.pressing("right")) {
      player.vel.x = 1.5;
      player.mirror.x = false;
    }
  }

  // --- KEEP IN VIEW ---
  player.pos.x = constrain(player.pos.x, FRAME_W / 2, VIEWW - FRAME_W / 2);

  // --- DEBUG VISUALS ---
  drawDebugVisuals(grounded);
  drawDebugPanel(grounded);
}

function drawDebugVisuals(grounded) {
  if (!showHitboxes) return;

  camera.off();

  noFill();
  strokeWeight(1);

  // player hitbox
  stroke(0, 255, 0);
  rectMode(CENTER);
  rect(player.x, player.y, player.w, player.h);

  // sensor hitbox
  stroke(255, 0, 0);
  rect(sensor.x, sensor.y, sensor.w, sensor.h);

  camera.on();
}

function drawDebugPanel(grounded) {
  if (!showDebugPanel) return;

  camera.off();

  noStroke();
  fill(0, 0, 0, 180);
  rect(8, 8, 150, 88, 6);

  fill(255);
  textSize(10);
  textAlign(LEFT, TOP);

  text("DEBUG PANEL", 16, 14);
  text("1: Moon Gravity", 16, 28);
  text("2: Show Hitboxes", 16, 40);
  text("R: Reset Player", 16, 52);
  text("TAB: Hide Panel", 16, 64);

  let gravityText = moonGravityOn ? "ON" : "OFF";
  let hitboxText = showHitboxes ? "ON" : "OFF";

  text("Moon: " + gravityText, 16, 82);
  text("Hitbox: " + hitboxText, 80, 82);

  // extra useful live info for development
  fill(0, 0, 0, 180);
  rect(170, 8, 142, 64, 6);

  fill(255);
  text("Grounded: " + grounded, 178, 14);
  text("Attacking: " + attacking, 178, 26);
  text("Vel X: " + nf(player.vel.x, 1, 2), 178, 38);
  text("Vel Y: " + nf(player.vel.y, 1, 2), 178, 50);

  camera.on();
}
