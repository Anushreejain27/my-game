var PLAY = 1;
var END = 0;
var WAIT = 2;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound

function preload(){

  trex_running = loadAnimation("tile007.png","tile006.png","tile005.png","tile004.png","tile003.png","tile002.png","tile001.png","tile000.png");
  trex_collided = loadAnimation("tile001.png");
  
  groundImage = loadImage("ground2.png");
  bgI = loadImage("nb.jpg")
  level = loadImage("level_up-removebg-preview.png")

  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("ob1.png");
  obstacle2 = loadImage("ob2.png");
  obstacle3 = loadImage("ob3.png");
  obstacle4 = loadImage("ob4.png");
  obstacle5 = loadImage("ob5.png");
 
  scoreI = loadImage("score-removebg-preview.png")
  
  restartImg = loadImage("replay-removebg-preview.png")
  gameOverImg = loadImage("game_over-removebg-preview.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")

}

function setup() {
  
  createCanvas(windowWidth, windowHeight);
  textSize(16)
  fill('hwite')
  text(": "+ score, 490,35); 
  
  trex = createSprite(50,displayHeight - 230,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);

  scoreee = createSprite(450, 30,30,20);
  scoreee.addImage(scoreI)
  scoreee.scale = 0.3

  levelUP = createSprite(windowWidth /2, displayHeight/2 ,100,100);
  levelUP.addImage(level)
  levelUP.scale = 0.75
  levelUP.visible = false

  console.log(trex.y)

  trex.scale = 0.8;
  
  ground = createSprite(200,displayHeight- 210,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  gameOver = createSprite(windowWidth/2,displayHeight-500);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.5;
  restart = createSprite(windowWidth/2,displayHeight- 400,50,50);
  restart.addImage(restartImg);
  restart.scale = 0.2;
  
  invisibleGround = createSprite(200,displayHeight -200,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  
  trex.setCollider("rectangle",0,0,trex.width- 27,trex.height);
  trex.debug = false
  
  score = 0;
  
}

function draw() {
  
  background(bgI);

  //displaying score
  textSize(16)
  fill('hwite')
  text(": "+ score, 490,35);

  /*if (gameState ===  WAIT){
    button = createImg('play-removebg-preview.png')
      button.position(displayWidth,displayHeight)
      button.size(200,200)
      button.mouseClicked(startGame)
  }*/
  
    if(gameState === PLAY){
    
    gameOver.visible = false;
    restart.visible = false;
    
    ground.velocityX = -(4 + 3* score/100)
    //scoring
    //get frame rate is because the frame counts are always in the game even in gamestate over
    score = score + Math.round(getFrameRate()/60);
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& trex.y >= 500) {
        trex.velocityY = -15;
    
    }
     if(keyWentDown("space")&& trex.y >= 500) {
       
        jumpSound.play();
    }
    
    if(score===200){
    levelUP.visible = true
    trex.changeAnimation("collided", trex_collided);
    
    ground.velocityX = 0;
    trex.velocityY = 0
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);   
    
    }
    
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        //trex.velocityY = -12;
        jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }
  }

   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
     //change the trex animation
      trex.changeAnimation("collided", trex_collided);
    
     //allows a var to get clicked...
      if(mousePressedOver(restart)) {
    
      reset();
    }

      ground.velocityX = 0;
      trex.velocityY = 0
      
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);    
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  drawSprites();
}

function reset(){
  gameState=PLAY;
gameOver.visible=false;
  restart.visible=false;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  trex.changeAnimation("running",trex_running)
  score=0;
}


function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(600,displayHeight - 220,10,40);
   obstacle.velocityX = -(6 + score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1,5));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
     
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    //assign lifetime to the variable
    cloud.lifetime = 200;
     //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}

 function startGame(){
gameState = PLAY
 }
