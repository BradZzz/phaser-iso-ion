angular.module('blast').controller('PhaserAdventureCtrl', function ()
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
  
  
  /*var game = new Phaser.Game(800, 400, Phaser.AUTO, 'game-canvas', null, true, false);

  var BasicGame = function (game) { };

  BasicGame.Boot = function (game) { };

  var isoGroup, player;

  BasicGame.Boot.prototype =
  {
      preload: function () {
          game.load.image('cube', 'assets/textures/iso/cube.png');

          game.time.advancedTiming = true;

          // Add and enable the plug-in.
          game.plugins.add(new Phaser.Plugin.Isometric(game));

          // Start the IsoArcade physics system.
          game.physics.startSystem(Phaser.Plugin.Isometric.ISOARCADE);

          // This is used to set a game canvas-based offset for the 0, 0, 0 isometric coordinate - by default
          // this point would be at screen coordinates 0, 0 (top left) which is usually undesirable.
          game.iso.anchor.setTo(0.5, 0.2);

                  
      },
      create: function () {
          // Create a group for our tiles, so we can use Group.sort
          isoGroup = game.add.group();

          // Set the global gravity for IsoArcade.
          game.physics.isoArcade.gravity.setTo(0, 0, -500);

          // Let's make a load of cubes on a grid, but do it back-to-front so they get added out of order.
          var cube;
          for (var xx = 256; xx > 0; xx -= 80) {
              for (var yy = 256; yy > 0; yy -= 80) {
                  // Create a cube using the new game.add.isoSprite factory method at the specified position.
                  // The last parameter is the group you want to add it to (just like game.add.sprite)
                  cube = game.add.isoSprite(xx, yy, 0, 'cube', 0, isoGroup);
                  cube.anchor.set(0.5);

                  // Enable the physics body on this cube.
                  game.physics.isoArcade.enable(cube);

                  // Collide with the world bounds so it doesn't go falling forever or fly off the screen!
                  cube.body.collideWorldBounds = true;

                  // Add a full bounce on the x and y axes, and a bit on the z axis. 
                  cube.body.bounce.set(1, 1, 0.2);

                  // Add some X and Y drag to make cubes slow down after being pushed.
                  cube.body.drag.set(100, 100, 0);
              }
          }

          // Create another cube as our 'player', and set it up just like the cubes above.
          player = game.add.isoSprite(128, 128, 0, 'cube', 0, isoGroup);
          player.tint = 0x86bfda;
          player.anchor.set(0.5);
          game.physics.isoArcade.enable(player);
          player.body.collideWorldBounds = true;

          // Set up our controls.
          this.cursors = game.input.keyboard.createCursorKeys();

          this.game.input.keyboard.addKeyCapture([
              Phaser.Keyboard.LEFT,
              Phaser.Keyboard.RIGHT,
              Phaser.Keyboard.UP,
              Phaser.Keyboard.DOWN,
              Phaser.Keyboard.SPACEBAR
          ]);

          var space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

          space.onDown.add(function () {
              player.body.velocity.z = 300;
          }, this);
      },
      update: function () {
          // Move the player at this speed.
          var speed = 100;

          if (this.cursors.up.isDown) {
              player.body.velocity.y = -speed;
          }
          else if (this.cursors.down.isDown) {
              player.body.velocity.y = speed;
          }
          else {
              player.body.velocity.y = 0;
          }

          if (this.cursors.left.isDown) {
              player.body.velocity.x = -speed;
          }
          else if (this.cursors.right.isDown) {
              player.body.velocity.x = speed;
          }
          else {
              player.body.velocity.x = 0;
          }

          // Our collision and sorting code again.
          game.physics.isoArcade.collide(isoGroup);
          game.iso.topologicalSort(isoGroup);
      },
      render: function () {
          game.debug.text("Move with cursors, jump with space!", 2, 36, "#ffffff");
          game.debug.text(game.time.fps || '--', 2, 14, "#a7aebe");
      }
  };

  game.state.add('Boot', BasicGame.Boot);
  game.state.start('Boot');*/
  
//using canvas here just because it runs faster for the body debug stuff
  /*var game = new Phaser.Game(800, 400, Phaser.AUTO, 'game-canvas', null, true, false);

  var BasicGame = function (game) { };

  BasicGame.Boot = function (game) {
      // nothing here
  };

  var isoGroup, water = [];
  var player;

  BasicGame.Boot.prototype =
  {
      preload: function () {
          game.time.advancedTiming = true;
          game.debug.renderShadow = false;
          game.stage.disableVisibilityChange = true;

          game.plugins.add(new Phaser.Plugin.Isometric(game));

          game.load.atlasJSONHash('tileset', 'assets/textures/iso/tilesets/iso-1/tileset.png', 'assets/textures/iso/tilesets/iso-1/tileset.json');
          game.load.image('cube', 'assets/textures/iso/cube.png');
          
          game.physics.startSystem(Phaser.Plugin.Isometric.ISOARCADE);
          game.iso.anchor.setTo(0.5, 0.1);
      },
      create: function () {
          isoGroup = game.add.group();
          
          game.physics.isoArcade.gravity.setTo(0, 0, -500);
          
          player = game.add.isoSprite(64, 64, 0, 'cube', 0);
          player.tint = 0x86bfda;
          player.anchor.set(1.5);
          //player.anchor.setTo(0.5, 0.1);
          game.physics.isoArcade.enable(player);
          player.body.collideWorldBounds = true;
          game.physics.arcade.collide(player, isoGroup);
          
          this.cursors = game.input.keyboard.createCursorKeys();
          
          this.game.input.keyboard.addKeyCapture([
            Phaser.Keyboard.LEFT,
            Phaser.Keyboard.RIGHT,
            Phaser.Keyboard.UP,
            Phaser.Keyboard.DOWN,
            Phaser.Keyboard.SPACEBAR
          ]);
    
          var space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    
          space.onDown.add(function () {
            player.body.velocity.z = 300;
          }, this);
          
          // we won't really be using IsoArcade physics, but I've enabled it anyway so the debug bodies can be seen
          isoGroup.enableBody = true;
          isoGroup.physicsBodyType = Phaser.Plugin.Isometric.ISOARCADE;

          game.physics.isoArcade.enable(isoGroup);
          
          var tileArray = [];
          tileArray[0] = 'water';
          tileArray[1] = 'sand';
          tileArray[2] = 'grass';
          tileArray[3] = 'stone';
          tileArray[4] = 'wood';
          tileArray[5] = 'watersand';
          tileArray[6] = 'grasssand';
          tileArray[7] = 'sandstone';
          tileArray[8] = 'bush1';
          tileArray[9] = 'bush2';
          tileArray[10] = 'mushroom';
          tileArray[11] = 'wall';
          tileArray[12] = 'window';

          var tiles = [
              9, 2, 1, 1, 4, 4, 1, 6, 2, 10, 2,
              2, 6, 1, 0, 4, 4, 0, 0, 2, 2, 2,
              6, 1, 0, 0, 4, 4, 0, 0, 8, 8, 2,
              0, 0, 0, 0, 4, 4, 0, 0, 0, 9, 2,
              0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0,
              0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0,
              0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0,
              0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0,
              11, 11, 12, 11, 3, 3, 11, 12, 11, 11, 11,
              3, 7, 3, 3, 3, 3, 3, 3, 7, 3, 3,
              7, 1, 7, 7, 3, 3, 7, 7, 1, 1, 7
          ];

          var size = 32;

          var i = 0, tile;
          for (var y = size; y <= game.physics.isoArcade.bounds.frontY - size; y += size) {
              for (var x = size; x <= game.physics.isoArcade.bounds.frontX - size; x += size) {
                  // this bit would've been so much cleaner if I'd ordered the tileArray better, but I can't be bothered fixing it :P
                  tile = game.add.isoSprite(x, y, tileArray[tiles[i]].match("water") ? 0 : game.rnd.pick([2, 3, 4]), 'tileset', tileArray[tiles[i]], isoGroup);
                  tile.anchor.set(0.5, 1);
                  tile.smoothed = false;
                  tile.body.moves = false;
                  if (tiles[i] === 4) {
                      tile.isoZ += 6;
                  }
                  if (tiles[i] <= 10 && (tiles[i] < 5 || tiles[i] > 6)) {
                      tile.scale.x = game.rnd.pick([-1, 1]);
                  }
                  if (tiles[i] === 0) {
                      water.push(tile);
                  }
                  i++;
              }
          }
      },
      update: function () {
          water.forEach(function (w) {
              w.isoZ = (-2 * Math.sin((game.time.now + (w.isoX * 7)) * 0.004)) + (-1 * Math.sin((game.time.now + (w.isoY * 8)) * 0.005));
              w.alpha = Phaser.Math.clamp(1 + (w.isoZ * 0.1), 0.2, 1);
          });
          
          // Move the player at this speed.
          var speed = 100;

          if (this.cursors.up.isDown) {
              player.body.velocity.y = -speed;
          }
          else if (this.cursors.down.isDown) {
              player.body.velocity.y = speed;
          }
          else {
              player.body.velocity.y = 0;
          }

          if (this.cursors.left.isDown) {
              player.body.velocity.x = -speed;
          }
          else if (this.cursors.right.isDown) {
              player.body.velocity.x = speed;
          }
          else {
              player.body.velocity.x = 0;
          }

          // Our collision and sorting code again.
          game.physics.isoArcade.collide(isoGroup);
          //game.iso.topologicalSort(isoGroup);
      },
      render: function () {
          isoGroup.forEach(function (tile) {
              game.debug.body(tile, 'rgba(189, 221, 235, 0.6)', false);
          });
          game.debug.text(game.time.fps || '--', 2, 14, "#a7aebe");
          // game.debug.text(Phaser.VERSION, 2, game.world.height - 2, "#ffff00");
      }
  };

  game.state.add('Boot', BasicGame.Boot);
  game.state.start('Boot');*/
  
  var width = window.innerWidth;
  var height = window.innerHeight;

  var fluids = []
  var obstacleGroup, player;
  var marker, marker2, marker3, marker4, marker5, itemGroup;
  var items;
  var floorGroup;
  var exitMarker;

  var grassGroup;

  var itemsTxt, endTxt;
  var txt = "";
  var finalTxt = "";

  var currentItemCount = 0; // starting number of collected items
  var totalItemCount = -1; // total number of items to be collected

  var check;

  var controls;
  var cN, cS, cE, cW, cSE, cNE, cSW, cNW;

  var Ndown = false, Sdown = false, Edown = false, Wdown = false, SEdown = false, NEdown = false, SWdown = false, NWdown = false;

  var isEven = function(someNumber){
      return (someNumber % 2 == 0) ? true : false;
  };
  
  var game = new Phaser.Game(width, height, Phaser.AUTO, 'game-canvas', null, false, true);
  
  var BasicGame = function (game) { };

  BasicGame.Boot = function (game) { };

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
          game.load.image('tile', 'assets/textures/iso/tiles/ground_tile.png');
          game.load.image('grass1', 'assets/textures/iso/tiles/ground_tile_grass1.png');
          game.load.image('grass2', 'assets/textures/iso/tiles/ground_tile_grass2.png');
          game.load.image('grass3', 'assets/textures/iso/tiles/ground_tile_grass3.png');
          game.load.image('mine', 'assets/textures/iso/tiles/mine.png');
          game.load.spritesheet('characterAnim','assets/textures/iso/characters/ghost/characterAnim.png', 70, 74);
       
          game.time.advancedTiming = true;

          // Add the Isometric plug-in to Phaser
          game.plugins.add(new Phaser.Plugin.Isometric(game));

          // Set the world size
          game.world.setBounds(0, 0, 2048, 1024);

          // Start the physical system
          game.physics.startSystem(Phaser.Plugin.Isometric.ISOARCADE);

          // set the middle of the world in the middle of the screen
          game.iso.anchor.setTo(0.5, 0);
      },
      create: function () {
          
        // set the Background color of our game
        game.stage.backgroundColor = "0xde6712";
        
        // create groups for different tiles
        floorGroup = game.add.group();
        itemGroup = game.add.group();
        grassGroup = game.add.group();
        obstacleGroup = game.add.group();
        
        this.cursors = game.input.keyboard.createCursorKeys();
        
          // set the gravity in our game
          game.physics.isoArcade.gravity.setTo(0, 0, -500);
    
          // create the floor tiles
          var floorTile;
          for (var xt = 1024; xt > 0; xt -= 35) {
              for (var yt = 1024; yt > 0; yt -= 35) {
                floorTile = game.add.isoSprite(xt, yt, 0, 'tile', 0, floorGroup);
                floorTile.anchor.set(0.5);

              }
          }
          
          
          // create a mine object which will be our ending point in the game
          var mine = game.add.isoSprite(800, 100, 0, 'mine', 0, obstacleGroup);
            mine.anchor.set(0.5);
            
            game.physics.isoArcade.enable(mine);
            mine.body.collideWorldBounds = true;
            mine.body.immovable = true;
          
          
          // create the exit marker next to the mine object
          exitMarker = game.add.isoSprite(830, 194, 0, 'exit', 0, itemGroup);
          game.physics.isoArcade.enable(exitMarker);
          exitMarker.body.collideWorldBounds = true;
          exitMarker.anchor.set(0.5);
          exitMarker.alpha = 0.5;
                
          // create collectible items 
          createItem(20)
          
          createGrass()
          
          createObstacles()
          
          createMoveables()
          
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
           endTxt.cameraOffset.x = (width/3) * 2;
           
        // update both text fields
           updateText();
           updateEndText();
        
          // Creste the player
          player = game.add.isoSprite(350, 280, 0, 'characterAnim', 0, obstacleGroup);
          
          player.alpha = 0.6;
                  
          // add the animations from the spritesheet
          player.animations.add('S', [0, 1, 2, 3, 4, 5, 6, 7], 10, true);
          player.animations.add('SW', [8, 9, 10, 11, 12, 13, 14, 15], 10, true);
          player.animations.add('W', [16, 17, 18, 19, 20, 21, 22, 23], 10, true);
          player.animations.add('NW', [24, 25, 26, 27, 28, 29, 30, 31], 10, true);
          player.animations.add('N', [32, 33, 34, 35, 36, 37, 38, 39], 10, true);
          player.animations.add('NE', [40, 41, 42, 43, 44, 45, 46, 47], 10, true);
          player.animations.add('E', [48, 49, 50, 51, 52, 53, 54, 55], 10, true);
          player.animations.add('SE', [56, 57, 58, 59, 60, 61, 62, 63], 10, true);
           
          player.anchor.set(0.5);
          
          // enable physics on the player
          game.physics.isoArcade.enable(player);
          player.body.collideWorldBounds = true;

          game.camera.follow(player);
          
          var space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
          space.onDown.add(function () {
            player.body.velocity.z = 300;
          }, this);
          
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
          var speed = 100;
         
          if (Ndown == true || up) {
            player.body.velocity.y = -speed;
            player.body.velocity.x = -speed;
            player.animations.play('N');
          }
          else if (Sdown == true || down)
          {
            player.body.velocity.y = speed;
            player.body.velocity.x = speed;
            player.animations.play('S');
          }
          else if (Edown == true || right) {
            player.body.velocity.x = speed;
            player.body.velocity.y = -speed;
            player.animations.play('E');
          }
          else if (Wdown == true || left)
          {
            player.body.velocity.x = -speed;
            player.body.velocity.y = speed;
            player.animations.play('W');
          }
          else if (SEdown == true || (right && down))
          {
            player.body.velocity.x = speed;
            player.body.velocity.y = 0;
            player.animations.play('SE');
          }
          else if (SWdown == true || (left && down))
          {
            player.body.velocity.y = speed;
            player.body.velocity.x = 0;
            player.animations.play('SW');
          }
          else if (NWdown == true || (right && up))
          {
            player.body.velocity.x = -speed;
            player.body.velocity.y = 0;
            player.animations.play('NW');
            
          }
          else if (NEdown == true|| (left && up))
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
          
          checkItem(player)
                 
         check = game.physics.isoArcade.overlap(exitMarker, player ,function(e){
            
            if (currentItemCount >= totalItemCount){
              console.log("END GAME GOOD! :)");
              
              updateEndText(2);
              
            }
            else
            {
              updateEndText(1);
            }
            
          });
          
         endTxt.visible = check;
     
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
