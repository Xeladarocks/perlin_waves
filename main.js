const canvas = document.getElementById("main");
const ctx = canvas.getContext("2d");

var dot_arr = [];
var force_arr = new Array(canvas.width).fill(0).map(() => new Array(canvas.height).fill(0));
var initial_dir = vec2(0, 0);

var speed = 1;
var dot_multiplier = 5;
var noise_multiplier = 1;
var noise_spread = 50;
var spawn_spread = 0;

var wrap_to_sides = false;
var wrap_to_start = true;

function setup() {
	noise.seed(Math.random());
	

	for (var d = 0; d < dot_multiplier; d++) {
		for (var y = 0; y < canvas.height; y++) {
			dot_arr.push(new Dot(vec2(rand()*spawn_spread+canvas.width/2, rand()*spawn_spread+canvas.height/2), vec2(rand(),rand()), 1, "rgb("+Math.random()*255+","+Math.random()*255+","+Math.random()*255+")"));
		}
	}

	for (var x = 0; x < canvas.width; x++) {
		for (var y = 0; y < canvas.height; y++) {
			force_arr[x][y] = vec2.add(initial_dir, vec2.mul(vec2(noise.simplex2(x / noise_spread, y / noise_spread), noise.simplex2(y / noise_spread, x / noise_spread)), noise_multiplier));
		}
	}
}

function display() {

	for(let s = 0; s < speed; s++) {
		for(let i = 0; i < dot_arr.length; i++) {
			let dot = dot_arr[i];
			dot.pos = vec2.add(dot.pos, vec2.mul(dot.vel, 1));
			if(wrap_to_sides) {
				if(dot.pos.x < 0) dot.pos.x = dot.pos.x + canvas.width;
				if(dot.pos.x > canvas.width-1) dot.pos.x = dot.pos.x - canvas.width+1;
				if(dot.pos.y < 0) dot.pos.y = dot.pos.y + canvas.height-1;
				if(dot.pos.y > canvas.height-1) dot.pos.y = dot.pos.y - canvas.height+1;
			} else if(wrap_to_start) {
				if(dot.pos.x < 0 || dot.pos.x > canvas.width-1 || dot.pos.y < 0 || dot.pos.y > canvas.height-1)
					dot.pos = vec2(rand()*spawn_spread+canvas.width/2, rand()*spawn_spread+canvas.height/2)
			} else {
				if(dot.pos.x < 0 || dot.pos.x > canvas.width-1 || dot.pos.y < 0 || dot.pos.y > canvas.height-1) {
					dot_arr.splice(i, 1);
					continue;
				}
			}
			dot.vel = vec2.add(dot.dir, force_arr[Math.round(dot.pos.x)][Math.round(dot.pos.y)]);
			circle(dot.pos, dot.radius, dot.color);
		}
	}

	requestAnimationFrame(display);
}

class Dot {
	constructor(pos, dir, radius, color) {
		this.pos = pos;
		this.dir = dir;
		this.vel = vec2(0);
		this.radius = radius;
		this.color = color;
	}
}

function circle(xy, radius, color) {
	ctx.beginPath();
	ctx.arc(xy.x, xy.y, radius, 0, 2 * Math.PI);
	ctx.fillStyle = color;
	ctx.fill();
}

function rand(min=-1, max=1) {
    return Math.random() * (max - min) + min;
}

setup();
requestAnimationFrame(display);