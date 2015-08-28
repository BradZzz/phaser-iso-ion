angular.module('blast').service('map', function (utils) {
	var map = this
	map.world = {}
	map.world.tiles = {}
	map.world.tiles.floor = ['tile']
	map.world.tiles.grass = ['grass1']
	map.world.tiles.objs = ['cactus1']
	map.world.tiles.items = ['gold','revolver','badge','skull']
	map.world.tiles.moveables = ['rock']
	map.world.tiles.player = ['ghost']
	map.world.map = populateMap(generateMap(20), 20, 20, 20, 20)
	function generateMap (size) {
	  var gen = []
    for (var y = 0; y < size; y++) {
      var row = []
      for (var x = 0; x < size; x++) {
        row.push({ 
          x : x, 
          y : y, 
          floor : map.world.tiles.floor[0],
          object: 0,
          item: 0,
          grass: 0,
          moveable: 0,
          player: 0
        })
  	  }
      gen.push(row)
    }
    return gen
  }
	function populateMap (gen, objs, items, grass, moveables) {
	  var maxX = gen[0].length - 1
	  var maxY = gen.length-1
	  gen[utils.rand(maxX)][utils.rand(maxY)].player = map.world.tiles.player
	  while (grass > 0){
	    var x = utils.rand(maxX)
	    var y = utils.rand(maxY)
	    if (allNull(gen[x][y])) {
	      gen[x][y].grass = map.world.tiles.grass[0]
	      grass--
	    }
	  }
	  while (objs > 0){
	    var x = utils.rand(maxX)
	    var y = utils.rand(maxY)
	    if (allNull(gen[x][y])) {
	      gen[x][y].object = map.world.tiles.objs[0]
	      objs--
	    }
	  }
	  while (items > 0){
	    var x = utils.rand(maxX)
	    var y = utils.rand(maxY)
	    if (allNull(gen[x][y])) {
	      gen[x][y].item = map.world.tiles.items[0]
	      items--
	    }
	  }
	  while (moveables > 0){
	    var x = utils.rand(maxX)
	    var y = utils.rand(maxY)
	    if (allNull(gen[x][y])) {
	      gen[x][y].moveable = map.world.tiles.moveables[0]
	      moveables--
	    }
	  }
	  return gen
	}
	function allNull(tile){
	  return !(tile.grass && tile.object && tile.item && tile.player && tile.moveable)
	}
})
