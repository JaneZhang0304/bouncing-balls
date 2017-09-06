// setup canvas

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var p = document.querySelector('p');

var width = canvas.width = window.innerWidth;
var height = canvas.height = window.innerHeight;

// function to generate random number

function random(min,max) {
  var num = Math.floor(Math.random()*(max-min)) + min;
  return num;
}

function Shape(x,y,velX,velY,exists){
	this.x = x;
	this.y = y;
	this.velX = velX;
	this.velY = velY;
	this.exists = exists;
}

function EvilCircle(x,y){
	var velX = 20;
	var velY = 20;
	Shape.call(this,x,y,velX,velY,true);
	this.color = 'white';
	this.size = 10;
}
EvilCircle.prototype = Object.create(Shape.prototype);
EvilCircle.prototype.constructor = EvilCircle;

EvilCircle.prototype.draw = function(){
	ctx.beginPath();
	ctx.lineWidth=3;
	ctx.strokeStyle = this.color;
	ctx.arc(this.x,this.y,this.size,0,2*Math.PI);
	ctx.stroke();
}
EvilCircle.prototype.checkBounds=function(){
	
	this.size = 10;
	if((this.x+this.size)>=width){	
		this.size = 8;
		this.x = width-this.size;
	}
	if((this.x-this.size)<=0){		
		this.size = 8;
		this.x =this.size;
	}
	if((this.y+this.size)>=height){		
		this.size = 8;
		this.y = height-this.size;
	}
	if((this.y-this.size)<0){		
		this.size = 8;
		this.y = this.size;
	}	
	
}
EvilCircle.prototype.setControls=function(){
	var _this = this; // !!!! 'cause _this will be used below
	window.onkeydown = function(e){
		if(e.keyCode === 65){
			_this.x -= _this.velX;// move left     A
		}else if(e.keyCode === 68){
			_this.x += _this.velX;// move right    D
		}else if(e.keyCode === 87){
			_this.y -= _this.velY;// move up       W
		}else if(e.keyCode === 83){
			_this.y += _this.velY;// move down     S
		}
		
	}
}
EvilCircle.prototype.collisionDetect = function(){
	for(var j=0,l=balls.length;j<l;j++){
		if(balls[j].exists){
			var dx = this.x-balls[j].x;
			var dy = this.y-balls[j].y;
			var distance = Math.sqrt(dx*dx+dy*dy);
			if(distance <this.size+balls[j].size){
				balls[j].exists = false;
			}		
		}			
	}
}

function Ball(x,y,velX,velY,color,size,exists){
	Shape.call(this,x,y,velX,velY,exists);
	this.color = color;
	this.size = size;
}

Ball.prototype=Object.create(Shape.prototype);
Ball.prototype.constructor = Ball;

Ball.prototype.draw = function(){
	ctx.beginPath();
	ctx.fillStyle = this.color;
	ctx.arc(this.x,this.y,this.size,0,2*Math.PI);
	ctx.fill();
}

Ball.prototype.update=function(){
	if((this.x+this.size)>=width){
		this.velX=-(this.velX);
	}
	if((this.x-this.size)<=0){
		this.velX=-(this.velX);
	}
	if((this.y+this.size)>=height){
		this.velY=-(this.velY);
	}
	if((this.y-this.size)<0){
		this.velY = -(this.velY);
	}
	this.x+=this.velX;
	this.y+=this.velY;
}
Ball.prototype.collisionDetect = function(){
	for(var j=0,l=balls.length;j<l;j++){
		if(!(this === balls[j])){
			var dx = this.x-balls[j].x;
			var dy = this.y-balls[j].y;
			var distance = Math.sqrt(dx*dx+dy*dy);
			if(distance <this.size+balls[j].size){
				balls[j].color = this.color='rgb('+random(0,255)+','+random(0,255)+','+random(0,255)+')';
			}
		}
	}
}

var balls = [];
function loop(){
	var count = 0;	
	ctx.fillStyle='rgba(0,0,0,0.25)';
	ctx.fillRect(0,0,width,height);
	while(balls.length<25){
		var ball=new Ball(
		random(0,width),
		random(0,height),
		random(-7,7),
		random(-7,7),
		'rgb('+random(0,255)+','+random(0,255)+','+random(0,255)+')',
		random(10,20),
		true);
		balls.push(ball);
	}
	
	evilCircle.draw();
	evilCircle.checkBounds();
	evilCircle.collisionDetect();
	
	for(var i=0,l=balls.length;i<l;i++){
        if(balls[i].exists){
			balls[i].draw();
			balls[i].update();
			balls[i].collisionDetect();	
			count++;
		}		
	}
	
	p.textContent = 'Ball Count:'+count;	
	
	requestAnimationFrame(loop);
}

var evilCircle = new EvilCircle(50,50);
evilCircle.setControls();

loop();

