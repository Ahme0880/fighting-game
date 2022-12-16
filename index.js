const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d'); //make into 2d game

canvas.width = 1024
canvas.height = 576

c.fillRect(0,0,canvas.width, canvas.height)

const gravity = 0.7


const background = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  imageSrc: './img/background.png'
})

const shop = new Sprite({
  position: {
    x: 600,
    y: 128
  },
  imageSrc: './img/shop.png',
  scale: 2.75,
  framesMax: 6
})

const player = new Fighter({
  position: {
  x: 0,
  y: 0
},
 velocity: {
  x: 0,
  y: 10
 },
 offset: {
  x: 0,
  y: 0
 },imageSrc: './img/samuraiMack/Idle.png',
 framesMax: 8,
 scale: 2.5,
 offset: {
  x: 215,
  y: 157
 },
 sprites:{
  idle: {
    imageSrc:'./img/samuraiMack/Idle.png',
    framesMax: 8
  },
  run: {
    imageSrc:'./img/samuraiMack/Run.png',
    framesMax: 8,
    image: new Image()
  },
  jump: {
    imageSrc:'./img/samuraiMack/Jump.png',
    framesMax: 2,
    image: new Image()
 },
 fall:{
  imageSrc:'./img/samuraiMack/Fall.png',
  framesMax: 2
 },
 attack1:{
  imageSrc:'./img/samuraiMack/Attack1.png',
  framesMax: 6
 }, takeHit:{
  imageSrc:'./img/samuraiMack/Take Hit.png',
  framesMax: 4
 },
 death:{
  imageSrc:'./img/samuraiMack/Death.png',
  framesMax: 6
 }
 },
 attackBox: {
  offset: {
   x: 100,
   y: 50
  },
  width: 140,
  height: 50
}
})



const player2 = new Fighter({
  position: {
  x: 400,
  y: 100
},
 velocity: {
  x: 0,
  y: 0
 },
 color: 'blue',
  offset: {
    x: -50,
    y: 0
   },imageSrc: './img/kenji/Idle.png',
   framesMax: 4,
   scale: 2.5,
   offset: {
    x: 215,
    y: 167
   },
   sprites:{
    idle: {
      imageSrc:'./img/kenji/Idle.png',
      framesMax: 4
    },
    run: {
      imageSrc:'./img/kenji/Run.png',
      framesMax: 8,
      image: new Image()
    },
    jump: {
      imageSrc:'./img/kenji/Jump.png',
      framesMax: 2,
      image: new Image()
   },
   fall:{
    imageSrc:'./img/kenji/Fall.png',
    framesMax: 2
   },
   attack1:{
    imageSrc:'./img/kenji/Attack1.png',
    framesMax: 4
   },
    takeHit: {
      imageSrc: './img/kenji/Take hit.png',
      framesMax: 3
    },
    death:{
      imageSrc:'./img/kenji/Death.png',
      framesMax: 7
     }
   },
   attackBox: {
     offset: {
      x: -170,
      y: 50
     },
     width: 170,
     height: 50
   }
})



//player2.draw()

console.log(player);

const keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  w: {
    pressed: false
  },
  ArrowRight: {
    pressed: false
  },
  ArrowLeft: {
    pressed: false
  },
  ArrowUp: {
    pressed: false
  }

}



  //makes function run
  decreaseTimer()

function animate() {
  window.requestAnimationFrame(animate)
  c.fillStyle = 'black'
  c.fillRect(0,0, canvas.width , canvas.height)

 

  background.update()
  shop.update()

  c.fillStyle = 'rgba(255, 255, 255, 0.08)'
  c.fillRect(0,0, canvas.width , canvas.height)

  player.update()
  player2.update()

  //player idle
  player.velocity.x = 0
  player2.velocity.x = 0
  
  

  //player.image = player.sprites.idle.image
  //player.switchSprite('idle')
  if (keys.a.pressed && player.lastKey === 'a') {
    player.velocity.x = -5
    player.switchSprite('run')
  } else if (keys.d.pressed && player.lastKey === 'd'){
    player.velocity.x = 5
    player.switchSprite('run')
  } else {
   player.switchSprite('idle')
   }

  if (player.velocity.y < 0){
    player.switchSprite('jump')
  } else if (player.velocity.y > 0) {
    player.switchSprite('fall')
  }
  
  //plyer 2 idle
  player2.velocity.x = 0

  //move left or right
  if (keys.ArrowLeft.pressed && player2.lastKey === 'ArrowLeft') {
    player2.velocity.x = -5
    player2.switchSprite('run')
    } else if (keys.ArrowRight.pressed && player2.lastKey === 'ArrowRight'){
      player2.velocity.x = 5
      player2.switchSprite('run')
    } else{
      player2.switchSprite('idle')
    }

    //jump
    if (player2.velocity.y < 0){
      player2.switchSprite('jump')
    } else if (player2.velocity.y > 0) {
      player2.switchSprite('fall')
    }

    //collision detection && player2 is hit
    if (rectangularCollision({
      rectangle1: player,
      rectangle2: player2
    }
    ) 
    &&
    player.isAttacking  && player.framesCurrent === 4){

      player2.takeHit()
      player.isAttacking = false
     // player2.health -= 20
      //document.querySelector('#player2Health').style.width = player2.health + '%'
      gsap.to('#player2Health',{width:
        player2.health + '%'})
      
    }

    // player misses
    if (player.isAttacking && player.framesCurrent === 4){
      player.isAttacking = false
    }

    // player gets hit
    if (rectangularCollision({
      rectangle1: player2,
      rectangle2: player
    }
    ) 
    &&
    player2.isAttacking && player2.framesCurrent === 2){

      player.takeHit()
      player2.isAttacking = false
      //player.health -= 20
      // document.querySelector('#playerHealth').style.width = player.health + '%'
      
      gsap.to('#playerHealth',{width:
        player.health + '%'})
    }

       // player misses
       if (player2.isAttacking && player2.framesCurrent === 2){
        player2.isAttacking = false
      }
  
    //end game based on health
if (player.health <= 0 || player2.health <= 0){
  determineWinner({ player,player2, timerId})
}
}



animate()



window.addEventListener('keydown',
(event)=> {

  if (!player.dead){

  
  //console.log(event.key);
  switch (event.key){
    case 'd':
      keys.d.pressed = true
      player.lastKey = 'd'
    break
    case 'a':
      keys.a.pressed = true
      player.lastKey = 'a'
    break
    //jumps
    case 'w':
     player.velocity.y = -20
    break
    case ' ':
     player.attack()
    break
    }
  }
  //console.log(event.key);

  if(!player2.dead){
  switch(event.key){
    case 'ArrowRight':
      keys.ArrowRight.pressed = true
      player2.lastKey = 'ArrowRight'
      break
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = true
      player2.lastKey = 'ArrowLeft'
      break
      //jumps
    case 'ArrowUp':
      player2.velocity.y = -20
      break
      case 'ArrowDown':
        player2.attack()
        break
  }
  }
})

window.addEventListener('keyup',
(event)=> {
  switch (event.key){
    case 'd':
      keys.d.pressed = false
    break
    case 'a':
      keys.a.pressed = false
    break
    case 'w':
      keys.w.pressed = false
    break
  }

  //enemy keys
  switch (event.key){
    case 'ArrowRight':
      keys.ArrowRight.pressed = false
    break
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false
    break
    case 'ArrowUp':
      keys.ArrowUp.pressed = false
    break
  }
  console.log(event.key);
})