const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const innerWidth = 360;
const innerHeight = 620;

const studentsArray = [];
let studentsIndex = 0;
const students_width = 70;
const students_height = 70;
const students_timer = 800;
const students_img = new Image();
const bull_img = new Image();
bull_img.src = "A+.png";
let ammo = 10;

let userName = localStorage.getItem('name');

//array of student's faces 
const image = [];
	image[0] = 'faces/Alen.png';
	image[1] = 'faces/Alisa.png';
    image[2] = 'faces/Anna.png';
    image[3] = 'faces/Aram Azatyan.png';
    image[4] = 'faces/Harout.png'
    image[5] = 'faces/Arpi.png';
    image[6] = 'faces/Artak.png';
    image[7] = 'faces/Elen.png';
    image[8] = 'faces/Grig.png';
    image[9] = 'faces/Hovannes.png';
    image[10] = 'faces/Khachig.png';
    image[11] = 'faces/lilit.png';
    image[12] = 'faces/Mariam.png';
    image[13] = 'faces/Maro.png';
    image[14] = 'faces/Grigor.png';
    image[15] = 'faces/Mery.png';
    image[16] = 'faces/Nareg.png';
    image[17] = 'faces/Norik.png';
    image[18] = 'faces/Petros.png';
    image[19] = 'faces/Rob.png';
    image[20] = 'faces/Ruben.png';
    image[21] = 'faces/Suren.png';
    image[22] = 'faces/Susie.png';
    image[23] = 'faces/Syuzi.png';
    image[24] = 'faces/Tamara.png';
    image[25] = 'faces/Tatev.png';
    image[26] = 'faces/Vahagn.png';
    image[27] = 'faces/Vahram.png';
    image[28] = 'faces/Victoria.png';
    image[29] = 'faces/Zaven.png';


let imgObj = [];
for(let i = 0; i < image.length; i++) {
	const img = new Image();
	img.src = image[i];
	imgObj[imgObj.length] = img;
}


let score = 0;
let lastScore = 0;

//properties of charater rouben
let rouben = {};
const rouben_width = 100;
const rouben_height = 105;
const rouben_img = new Image();
rouben_img.src = 'rubo.png';

rouben = {
	width: rouben_width,
	height: rouben_height,
	x: innerWidth/2 - rouben_width/2,
	y: innerHeight - (rouben_height+10),
	xDelta:0,
	yDelta:0,
	health:3,
	draw: function(){
		ctx.drawImage(rouben_img, rouben.x, rouben.y, rouben.width, rouben.height);
	},
	update:function(){
		if(rouben.x <= 0){
			rouben.x = 0;
		}else if(rouben.x >= (innerWidth - rouben.width)){
			rouben.x = innerWidth - rouben.width;
		}
		if(rouben.y <= 0){
			rouben.y = 0;
		}else if(rouben.y >= (innerHeight - rouben.height)){
			rouben.y = innerHeight - rouben.height;
		}
		rouben.x += rouben.xDelta;
		rouben.y += rouben.yDelta;
	}
};
//key functions
const leftKey = 37;
const upKey = 38;
const rightKey = 39;
const downKey = 40;
const spaceKey = 32;
document.addEventListener('keydown', function(key) {
	if(key.keyCode === leftKey) {
	    rouben.xDelta = -3;
  	}
  	if(key.keyCode === rightKey) {
        rouben.xDelta = 3;
  	}
  	if(key.keyCode === upKey) {
        rouben.yDelta = -3;
  	}
  	if(key.keyCode === downKey) {
        rouben.yDelta = 3;
  	}
  	if(key.keyCode === spaceKey) {
  		fire();
  	}
});
document.addEventListener('keyup', function(key) {
    if(key.keyCode === rightKey || key.keyCode === leftKey) {
        rouben.xDelta = 0;
    } else if(key.keyCode === upKey || key.keyCode === downKey) {
        rouben.yDelta = 0;
    }
});

//students constructor 
function students(x, y, dx, dy, students_img,students_width, students_height, rotation){
	this.x = x;
	this.y = y;
	this.dx = dx;
	this.dy = dy;
	this.img = students_img;
	this.width = students_width;
	this.height = students_height;
	this.rotation = rotation;
	studentsIndex++;
	studentsArray[studentsIndex] = this;
	this.id = studentsIndex;

	if(this.rotation < 0.2){
		this.dx = -this.dx;
	}else if (this.rotation > 0.7){
		this.dx = -this.dx;
	}else{
		this.dx = 0;
		this.dy = this.dy;
	}

    this.update = function(){
    	this.y += this.dy;
    	this.x += this.dx;
    	if(this.x + this.width >= innerWidth){
    		this.dx = -this.dx;
    	}else if(this.x <= 0){
    		this.dx = Math.abs(this.dx);
    	}
    	if(this.y > innerHeight + this.height){
    		if(score > 10) {
    			score -= 10;
    		}
    		this.delete();
    	}
    	this.draw();
    }
    this.delete = function(){
    	delete studentsArray[this.id];
    }
    this.draw = function(){
	ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
};

const random = function(num) {
	return Math.floor(Math.random() * num) + 1;
};

//spawning students randomly
function create_students(){
	const x = Math.random()* (innerWidth - students_width);
	const y = -students_height;
	const dx = 5;
	const dy = 5;
	const rotation = Math.random();

	const studentsimg = imgObj[random(imgObj.length-1)];// imgObj[random(imgObj.length)];


	new students(x, y, dx, dy,studentsimg,students_width, students_height, rotation);
}

//creating the bullet (A+)
let bulletsArray = [];
let bulletIndex = 0;
const bullet_width = 30;
const bullet_height = 40;
const speed = 10;

//constructor of bullet
function bullet(x, y, bull_img, width, height, speed){
	this.x = x;
	this.y = y;
	this.img = bull_img;
	this.width = width;
	this.height = height;
	this.speed = speed;

	bulletIndex++;
	bulletsArray[bulletIndex] = this;
	this.id = bulletIndex;

	this.update = function(){
		this.y += -this.speed;
		if(this.y < -this.height){
			delete this.delete();
		}
		this.draw();
	}

	this.delete = function(){
		delete bulletsArray[this.id];
	}
	this.draw = function(){
		ctx.beginPath();
		ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
		
		ctx.fill();
		ctx.stroke();
	}
}

function reload(){
	ammo = 10;
}

function fire(){
	if(ammo > 0){
		shoot();
		ammo--;
		if(ammo == 0) {
			ammo = 'reloading...';
			setTimeout(reload, 500);
		}
	}
}

function shoot(){
	const x = (rouben.x + rouben.width/2) - bullet_width/2;
	const y = rouben.y;
	new bullet(x, y, bull_img, bullet_width, bullet_height, speed);
}

//collision scenario 
function collides(a, b){
	return a.x < b.x + b.width &&
	       a.x + a.width > b.x &&
	       a.y < b.y + b.height &&
	       a.y + a.height > b.y;
}

//what to do when two objects collide
function handleCollisions(){

	bulletsArray.forEach(function(bullet){
		studentsArray.forEach(function(students){
			if(collides(bullet, students)){
				bullet.delete();
				students.delete();
				score += 10;
			}
		});

	});

	studentsArray.forEach(function(students){
			if(collides(rouben, students)){
				rouben.health -= 1;
				students.delete();
			}

		});
}

//audio 
const jan = new Audio("jan1.mp3");
let play = true;

//HUD
function animate(currentTime){
	const animation = requestAnimationFrame(animate);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.font = '11px "Press Start 2P"';
	ctx.fillStyle = '#33FF00';
	ctx.fillText('SCORE: '+score, 10, 20);
    ctx.font = '11px "Press Start 2P"';
	ctx.fillStyle = '#33FF00';
	ctx.fillText('HEALTH: '+rouben.health, innerWidth-120, 20);
	ctx.fillText('AMMO: ' + ammo, 0, canvas.height)
	rouben.draw();
	rouben.update();
	if(currentTime >= lastScore + students_timer){
		lastScore = currentTime;
		create_students();
	}
	studentsArray.forEach(function(students){
		students.update();
	});

	bulletsArray.forEach(function(bullet){
		bullet.update();
	});

//end game screen
	handleCollisions();
	if(rouben.health <= 0){
		cancelAnimationFrame(animation);
		alert("Your Score: " + score);

		const highScore = localStorage.getItem('max_score');

//saving high score
		if(highScore){
			const parsed = JSON.parse(highScore)
			debugger
			if(parsed[Object.keys(parsed)[0]] < score){
				debugger
				localStorage.setItem('max_score',JSON.stringify({[userName]:score}))
			}
		}else{
			debugger
			localStorage.setItem('max_score',JSON.stringify({[userName||"userName"]:score}))
		}
//relocating screen to start
		window.location = "start screen.html"
	}

//condition when to play audio
	if(score%100 === 0 && score !== 0 && play){
		jan.play();
		play = false;
	}
	if(score % 100 == 10){
		play = true;
	}
}

animate();
