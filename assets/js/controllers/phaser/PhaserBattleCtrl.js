angular.module('blast').controller('PhaserBattleCtrl', function (mapBattle)
{
  /*
   * What needs to be done:
   * Adventure Screen
   * World Screen
   * Player Screen
   * Battle Screen
   * Town Screen
   * Title Screen
   * End Screen
   * Scores Screen
   */
	
   /*
    * var game = new Phaser.Game(800, 400, Phaser.AUTO, 'test', null, true, false);

var BasicGame = function (game) { };

BasicGame.Boot = function (game) { };

var isoGroup, cursorPos, cursor;

BasicGame.Boot.prototype =
{
    preload: function () {
        game.load.image('tile', '../assets/tile.png');

        game.time.advancedTiming = true;

        // Add and enable the plug-in.
        game.plugins.add(new Phaser.Plugin.Isometric(game));

        // This is used to set a game canvas-based offset for the 0, 0, 0 isometric coordinate - by default
        // this point would be at screen coordinates 0, 0 (top left) which is usually undesirable.
        game.iso.anchor.setTo(0.5, 0.2);


    },
    create: function () {

        // Create a group for our tiles.
        isoGroup = game.add.group();

        // Let's make a load of tiles on a grid.
        this.spawnTiles();

        // Provide a 3D position for the cursor
        cursorPos = new Phaser.Plugin.Isometric.Point3();
    },
    update: function () {
        // Update the cursor position.
        // It's important to understand that screen-to-isometric projection means you have to specify a z position manually, as this cannot be easily
        // determined from the 2D pointer position without extra trickery. By default, the z position is 0 if not set.
        game.iso.unproject(game.input.activePointer.position, cursorPos);

        // Loop through all tiles and test to see if the 3D position from above intersects with the automatically generated IsoSprite tile bounds.
        isoGroup.forEach(function (tile) {
            var inBounds = tile.isoBounds.containsXY(cursorPos.x, cursorPos.y);
            // If it does, do a little animation and tint change.
            if (!tile.selected && inBounds) {
                tile.selected = true;
                tile.tint = 0x86bfda;
                game.add.tween(tile).to({ isoZ: 4 }, 200, Phaser.Easing.Quadratic.InOut, true);
            }
            // If not, revert back to how it was.
            else if (tile.selected && !inBounds) {
                tile.selected = false;
                tile.tint = 0xffffff;
                game.add.tween(tile).to({ isoZ: 0 }, 200, Phaser.Easing.Quadratic.InOut, true);
            }
        });
    },
    render: function () {
        game.debug.text("Move your mouse around!", 2, 36, "#ffffff");
        game.debug.text(game.time.fps || '--', 2, 14, "#a7aebe");
    },
    spawnTiles: function () {
        var tile;
        for (var xx = 0; xx < 256; xx += 38) {
            for (var yy = 0; yy < 256; yy += 38) {
                // Create a tile using the new game.add.isoSprite factory method at the specified position.
                // The last parameter is the group you want to add it to (just like game.add.sprite)
                tile = game.add.isoSprite(xx, yy, 0, 'tile', 0, isoGroup);
                tile.anchor.set(0.5, 0);
            }
        }
    }
};

game.state.add('Boot', BasicGame.Boot);
game.state.start('Boot');
    */
  
  var controls = {
      preventDbl : false,
  }
  
  var dims = {
      width : window.innerWidth,
      height : window.innerHeight,
  }
  
  var cursorPos
  var playerPos = {}
  var tween
  var floor = mapBattle

  var fluids = []
  var obstacleGroup, player, charGroup
  var playerTile
  var marker, marker2, marker3, marker4, marker5, itemGroup;
  var items;
  var floorGroup;
  var exitMarker;

  var grassGroup;

  var itemsTxt, endTxt;
  var txt = "";
  var finalTxt = "";
  var speed = 100;

  var currentItemCount = 0; // starting number of collected items
  var totalItemCount = -1; // total number of items to be collected
  var conductor = {}

  var isEven = function(someNumber){
      return (someNumber % 2 == 0) ? true : false;
  };
  
  var game = new Phaser.Game(dims.width, dims.height, Phaser.AUTO, 'game-canvas', null, false, true);
  
  var BasicGame = function (game) { };

  BasicGame.Boot = function (game) { };

  console.log('init')
  
  BasicGame.Boot.prototype =
  {
      preload: function () {
        
          game.load.atlasJSONHash('tileset', 'assets/textures/iso/tilesets/iso-1/tileset.png', 'assets/textures/iso/tilesets/iso-1/tileset.json');
          game.load.image('cactus1', 'assets/textures/iso/tiles/obstacle1.png');
          game.load.image('cactus2', 'assets/textures/iso/tiles/obstacle2.png');
          game.load.image('rock', 'assets/textures/iso/tiles/obstacle3.png');
          game.load.image('gold', 'assets/textures/iso/tiles/find1_gold.png');
          game.load.image('revolver', 'assets/textures/iso/tiles/find2_revolver.png');
          game.load.image('badge', 'assets/textures/iso/tiles/find3_badge.png');
          game.load.image('skull', 'assets/textures/iso/tiles/find4_skull.png');
          game.load.image('exit', 'assets/textures/iso/tiles/exit.png');
          game.load.image('tile', 'assets/textures/iso/tiles/tile_1.png');
          game.load.image('grass1', 'assets/textures/iso/tiles/ground_tile_grass1.png');
          game.load.image('grass2', 'assets/textures/iso/tiles/ground_tile_grass2.png');
          game.load.image('grass3', 'assets/textures/iso/tiles/ground_tile_grass3.png');
          game.load.image('mine', 'assets/textures/iso/tiles/mine.png');
          game.load.spritesheet('ghost','assets/textures/iso/characters/ghost/characterAnim.png', 70, 74);
       
          game.time.advancedTiming = true;

          // Add the Isometric plug-in to Phaser
          game.plugins.add(new Phaser.Plugin.Isometric(game));

          // Set the world size
          game.world.setBounds(0, 0, 2048, 1024);

          // Start the physical system
          game.physics.startSystem(Phaser.Plugin.Isometric.ISOARCADE);

          // set the middle of the world in the middle of the screen
          game.iso.anchor.setTo(0.5, 0.2);
          
          //game.input.onDown.add(checkClick, this);
          tween = null
          playerPos.moving = false
      },
      create: function () {
        // set the Background color of our game
        //game.stage.backgroundColor = "0xde6712";
        game.stage.backgroundColor = "0xffffff";
        
        // create groups for different tiles
        floorGroup = game.add.group()
        itemGroup = game.add.group()
        grassGroup = game.add.group()
        obstacleGroup = game.add.group()
        charGroup = game.add.group()
        
        this.cursors = game.input.keyboard.createCursorKeys();
        
          // set the gravity in our game
          game.physics.isoArcade.gravity.setTo(0, 0, -500);
          
          // create a mine object which will be our ending point in the game
          /*var mine = game.add.isoSprite(800, 100, 0, 'mine', 0, obstacleGroup);
            mine.anchor.set(0.5);
            
            game.physics.isoArcade.enable(mine);
            mine.body.collideWorldBounds = true;
            mine.body.immovable = true;
          */
          
          // create the exit marker next to the mine object
          /*exitMarker = game.add.isoSprite(830, 194, 0, 'exit', 0, itemGroup);
          game.physics.isoArcade.enable(exitMarker);
          exitMarker.body.collideWorldBounds = true;
          exitMarker.anchor.set(0.5);
          exitMarker.alpha = 0.5;*/
                
          createFloor()
          // create collectible items 
          //createItem(20)
          
          //createGrass()
          
          //createObstacles()
          
          //createMoveables()
          
          // create the collected item text
           itemsTxt = game.add.text(100, 8, txt, {
              font: "16px Arial",
              fill: "#FFFFFF",
              align: "center"
          });
           
           itemsTxt.fixedToCamera = true;
           
        // create the information text field about the status of the game   
           endTxt = game.add.text(0, 8, finalTxt, {
              font: "18px Arial",
              fill: "#FFFF00",
              align: "center"
          });
          
           endTxt.fixedToCamera = true;       
           endTxt.anchor.x = Math.round(endTxt.width * 0.5) / endTxt.width;
           endTxt.cameraOffset.x = (dims.width/3) * 2;
           
        // update both text fields
           updateText();
           updateEndText();
       
          
          //Provide a 3D position for the cursor
          cursorPos = new Phaser.Plugin.Isometric.Point3();
          conductor.moving = false
          
      },
      update: function () {
        fluids.forEach(function(fluid) {
          fluid.isoZ = (-2 * Math.sin((game.time.now + (fluid.isoX * 7)) * 0.004)) + (-1 * Math.sin((game.time.now + (fluid.isoY * 8)) * 0.005));
          fluid.alpha = Phaser.Math.clamp(1 + (fluid.isoZ * 0.1), 0.2, 1);
        }, this);
        
        var up = this.cursors.up.isDown;
        var down = this.cursors.down.isDown;
        
        var right = this.cursors.right.isDown;
        var left = this.cursors.left.isDown;
        
        // Move the player
          if (up) {
            player.body.velocity.y = -speed;
            player.body.velocity.x = -speed;
            player.animations.play('N');
          }
          else if (down)
          {
            player.body.velocity.y = speed;
            player.body.velocity.x = speed;
            player.animations.play('S');
          }
          else if (right) {
            player.body.velocity.x = speed;
            player.body.velocity.y = -speed;
            player.animations.play('E');
          }
          else if (left)
          {
            player.body.velocity.x = -speed;
            player.body.velocity.y = speed;
            player.animations.play('W');
          }
          else if (right && down)
          {
            player.body.velocity.x = speed;
            player.body.velocity.y = 0;
            player.animations.play('SE');
          }
          else if (left && down)
          {
            player.body.velocity.y = speed;
            player.body.velocity.x = 0;
            player.animations.play('SW');
          }
          else if (right && up)
          {
            player.body.velocity.x = -speed;
            player.body.velocity.y = 0;
            player.animations.play('NW');
            
          }
          else if (left && up)
          {
            player.body.velocity.y = -speed;
            player.body.velocity.x = 0;
            player.animations.play('NE');
          }
          else
          {
            player.body.velocity.x = 0;
            player.body.velocity.y = 0;
          }
        
          game.physics.isoArcade.collide(obstacleGroup);
          
          //checkItem(player)
          checkClick()
                 
           /*check = game.physics.isoArcade.overlap(exitMarker, player ,function(e){
           
            if (currentItemCount >= totalItemCount){
              console.log("END GAME GOOD! :)");
              
              updateEndText(2);
              
            }
            else
            {
              updateEndText(1);
            }
            
          });*/
          
         //endTxt.visible = check;
     
         game.iso.topologicalSort(obstacleGroup);
          
      },
      render: function () {
      }
  };

  game.state.add('Boot', BasicGame.Boot);
  game.state.start('Boot');
  
  function createMoveables(){
    var rock;
    for (var xt = 1024; xt > 0; xt -= 400) {
        for (var yt = 1024; yt > 0; yt -= 400) {
          rock = game.add.isoSprite(xt + 80, yt + 80, 0, 'rock', 0, obstacleGroup);
          rock.anchor.set(0.5);
          // Let the physics engine do its job on this tile type
          game.physics.isoArcade.enable(rock);
          // This will prevent our physic bodies from going out of the screen
          rock.body.collideWorldBounds = true;
          // set the physics bounce amount on each axis  (X, Y, Z)
          rock.body.bounce.set(0.2, 0.2, 0);
          // set the slow down rate on each axis (X, Y, Z)
          rock.body.drag.set(100, 100, 0);
        }
    }
  }
  
  function createPlayer (x, y, sprite) {
    
      console.log(x,y,sprite)

      // Create the player
      var player = game.add.isoSprite(x, y, 0, sprite, 0, charGroup)

      player.alpha = 0.9
              
      // add the animations from the spritesheet
      player.animations.add('S', [0, 1, 2, 3, 4, 5, 6, 7], 10, true)
      player.animations.add('SW', [8, 9, 10, 11, 12, 13, 14, 15], 10, true)
      player.animations.add('W', [16, 17, 18, 19, 20, 21, 22, 23], 10, true)
      player.animations.add('NW', [24, 25, 26, 27, 28, 29, 30, 31], 10, true)
      player.animations.add('N', [32, 33, 34, 35, 36, 37, 38, 39], 10, true)
      player.animations.add('NE', [40, 41, 42, 43, 44, 45, 46, 47], 10, true)
      player.animations.add('E', [48, 49, 50, 51, 52, 53, 54, 55], 10, true)
      player.animations.add('SE', [56, 57, 58, 59, 60, 61, 62, 63], 10, true)
       
      player.anchor.set(0.5)
      
      // enable physics on the player
      game.physics.isoArcade.enable(player)
      //game.physics.arcade.enable(player, Phaser.Physics.ARCADE)
      player.body.enable = false

      player.body.collideWorldBounds = true

      game.camera.follow(player)   

      var space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
      space.onDown.add(function () {
        player.body.velocity.z = 300
      }, this)
      
      player.animations.play('S')
      return player
  }

  function checkClick() {
	  
    game.iso.unproject(game.input.activePointer.position, cursorPos)
    checkCursor (cursorPos)
    /*if (game.input.activePointer.isDown)
    {
    	playerPos = cursorPos
    }*/
    if (playerPos.moving) {
    	movePlayer(cursorPos)
    }
  }
  
  
  function movePlayer(cursorPos) {
	  var difX = Math.abs(player.isoX - playerPos.position.x)
	  var difY = Math.abs(player.isoY - playerPos.position.y)
	  //console.log("Difx: " + difX)
	  //console.log("Dify: " + difY)
    //Tweens don't fucking work with physics objects. make it by hand
	if (difX < playerPos.range && difY > playerPos.range) {
		playerPos.moving = false
	}else {
		if (difX > playerPos.range){
		  if (player.isoX < playerPos.position.x) {
			  player.body.velocity.x = speed;
		  } else {
			  player.body.velocity.x = -speed;
		  }
		} 
		if (difY > playerPos.range){
		  if (player.isoY < playerPos.position.y) {
			  player.body.velocity.y = speed;
		  } else {
			  player.body.velocity.y = -speed;
		  }
		}  
	}
  }
  
  function createGrass(){
    var grassTile;
    for (var xt = 1024; xt > 0; xt -= 35) {
        for (var yt = 1024; yt > 0; yt -= 35) {
          var rnd = rndNum(20);
          if (rnd == 0) {
            grassTile = game.add.isoSprite(xt, yt, 0, 'grass1', 0, grassGroup);
            grassTile.anchor.set(0.5);
          }
          else if (rnd == 1)
          {
            grassTile = game.add.isoSprite(xt, yt, 0, 'grass2', 0, grassGroup);
            grassTile.anchor.set(0.5);
          }
          else if (rnd == 2)
          {
            grassTile = game.add.isoSprite(xt, yt, 0, 'grass3', 0, grassGroup);
            grassTile.anchor.set(0.5);
          }
        }
    }
  }
  
  function createFloor(){
    var floorTile
    var dim = floor.dim
    for (var xt = floor.world.map.length-1; xt >= 0; xt -= 1) {
        for (var yt = floor.world.map[0].length-1; yt >= 0; yt -= 1) {
          floorTile = game.add.isoSprite(xt * dim, yt * dim, 0, floor.world.map[xt][yt].floor, 0, floorGroup);
          floorTile.anchor.set(0.5);
          if (floor.world.map[xt][yt].top.type === 'char'){
            console.log("Player created")
            floorTile.topL = createPlayer((xt - 1) * dim,(yt - 1) * dim,floor.world.map[xt][yt].top.image)
            playerTile = floorTile
            player = playerTile.topL
          } else {
            floorTile.topL = 0
          }
        }
    }
    game.iso.simpleSort(floorGroup)
    game.iso.simpleSort(charGroup)
  }
  
  /*function stopTweensFor(obj) {
      // first get all of the active tweens
      var tweens = game.tweens.getAll();
    
      // filter that down to an array of all tweens of the specified object
      var currentTweens = tweens.filter(function(tween) {
        return tween._object === obj;
      });
    
      // if we have any matching tweens for the object, cycle through all of them and stop them
      if (currentTweens.length > 0) {
        for (var t = 0, len = currentTweens.length; t < len; t++) {
          currentTweens[t].stop();
        }
      }
    }*/
  
  function checkCursor (cursorPos) {
    // Update the cursor position.
    // It's important to understand that screen-to-isometric projection means you have to specify a z position manually, as this cannot be easily
    // determined from the 2D pointer position without extra trickery. By default, the z position is 0 if not set.

    // Loop through all tiles and test to see if the 3D position from above intersects with the automatically generated IsoSprite tile bounds.
    floorGroup.forEach(function (tile) {
        var inBounds = tile.isoBounds.containsXY(cursorPos.x, cursorPos.y);
        // If it does, do a little animation and tint change.
        if (!tile.selected && inBounds) {
            tile.selected = true
            if (tile.topL) {
              tile.tint = 0xFF7070
            } else {
              tile.tint = 0x86bfda 
            }
            game.add.tween(tile).to({ isoZ: 4 }, 200, Phaser.Easing.Quadratic.InOut, true) 
        }
        // If not, revert back to how it was.
        else if (tile.selected) {
        	if (!inBounds) {
                tile.selected = false
                tile.tint = 0xffffff
                game.add.tween(tile).to({ isoZ: 0 }, 200, Phaser.Easing.Quadratic.InOut, true)
            } else {
                if (!controls.preventDbl && game.input.activePointer.isDown)
                {
                	if (tween === null || !tween.isRunning) {
                  	  if (tile.topL) {
                  	    playerTile = tile
                        player = playerTile.topL
                        game.camera.follow(player)
                        controls.preventDbl = true
                        game.time.events.add(1000,function(){ controls.preventDbl = false},this)
                  	  } else {
                      	tween = game.add.tween(player).to({ isoX: tile.isoX - ((4*tile.width) / 10), isoY: tile.isoY - ( (7*tile.height) / 10) }, 1000, Phaser.Easing.Linear.None, true);
                      	tween.onComplete.add(function(){
                      	  game.iso.simpleSort(charGroup)
                      	}, this);
                        playerTile.topL = 0
                        playerTile = tile
                        playerTile.topL = player
                  	  }
                    }
                }
            }
            
        }
    });
  }
  
  
  function checkOverlap(sprite) {
    /*items.forEach(function(obj) {
      if (sprite.overlap(obj)) {
        return true
      }
    }, this);*/
    /*for (var obstacle in obstacleGroup) {
      if (sprite.overlap(obstacle)) {
        return true
      }
    }*/
    /*itemGroup.forEach(function(obj) {
      if (sprite.overlap(obj)) {
        return true
      }
    }, this);
    if (sprite.overlap(player)) {
      return true
    }*/
    return false
  }
  
  function pickObstacle (obstacle) {
    var rnd = rndNum(5)
    var xt = rndNum(1024)
    var yt = rndNum(1024)
    
    if (rnd == 0) {
      obstacle = game.add.isoSprite(xt, yt, 0, 'cactus1', 0, obstacleGroup)
    } else if (rnd == 1) {
      obstacle = game.add.isoSprite(xt, yt, 0, 'cactus2', 0, obstacleGroup)
    } else if (rnd == 2) {
      obstacle = game.add.isoSprite(xt, yt, 0, 'tileset', 'bush1', obstacleGroup)
    } else if (rnd == 3) {
      obstacle = game.add.isoSprite(xt, yt, 0, 'tileset', 'bush2', obstacleGroup)
    } else if (rnd == 4) {
      obstacle = game.add.isoSprite(xt, yt, 0, 'tileset', 'wall', obstacleGroup)
    } else if (rnd == 5) {
      obstacle = game.add.isoSprite(xt, yt, 0, 'tileset', 'window', obstacleGroup)
    } else {
      obstacle = game.add.isoSprite(xt, yt, 0, 'tileset', 'water', obstacleGroup)
      fluids.push(obstacle)
    }
    return obstacle
  }
  
  function createObstacles(){
    var obstacle;
    //for (var xt = 1024; xt > 0; xt -= 400) {
        //for (var yt = 1024; yt > 0; yt -= 400) {
        for (var i = 0; i < rndNum(20) + 10; i++) {
          
          obstacle = pickObstacle(obstacle)
          
          while (checkOverlap(obstacle)) {
            obstacle = pickObstacle(obstacle)
          }
          obstacle.anchor.set(0.5);
          // Let the physics engine do its job on this tile type
          game.physics.isoArcade.enable(obstacle);
          // This will prevent our physic bodies from going out of the screen
          obstacle.body.collideWorldBounds = true;
          // Make the cactus body immovable
          obstacle.body.immovable = true;
        }
        //}
    //}
  }
  
  function checkItem(player){
    items.forEach(function(item) {
      game.physics.isoArcade.overlap(item, player ,function(e){
        e.destroy();
        addItem();
      })
    }, this);
  }
  
  function createItem(num){
    items = []
    totalItemCount = num
    var objects = ['gold','revolver','badge','skull']
    for (var i = 0; i < num; i++) {
      var marker = game.add.isoSprite(rndNum(800), rndNum(800), 0, objects[rndNum(3)], 0, itemGroup)
      game.physics.isoArcade.enable(marker)
      marker.body.collideWorldBounds = true
      marker.anchor.set(0.5)
      items.push(marker)
    }
  }
  
  // add the collected item
  function addItem() {
    currentItemCount++;
    updateText();
  }
  
  // update the item text field
  function updateText() {
    
     txt = "ITEMS: " + currentItemCount + "/" + totalItemCount;
       itemsTxt.setText(txt);
    
  }
  
  // update the end text field
  function updateEndText(_t) {
    
    switch(_t) {
    
      case 0:
        finalTxt = "";
      break;
      
      case 1:
        finalTxt = "YOU MUST FIND ALL THE ITEMS!!!";
      break;
      
      case 2:
        finalTxt = "YOU FOUND ALL THE ITEMS!!! :)";
      break;

    }
    
    endTxt.setText(finalTxt);
      
  }
  
  // generate random number
  function rndNum(num) {
    
    return Math.round(Math.random() * num);
    
  }
  
  // add eventListener for tizenhwkey
  document.addEventListener('tizenhwkey', function(e) {
    if(e.keyName == "back") {
      try {
        tizen.application.getCurrentApplication().exit();
      } catch (error) {
        console.error("getCurrentApplication(): " + error.message);
      }
    }
  });
});
