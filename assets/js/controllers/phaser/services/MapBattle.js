angular.module('blast').service('mapBattle', function (utils) {
	var map = this
	map.dim = 35
	map.calcOffset = function(tile){
	 return { x: tile.isoX - ((4*tile.width) / 10), x: tile.isoY - ( (7*tile.height) / 10) }
	}
	map.world = {}
	map.world.tiles = {}
	map.world.tiles.floor = ['tile']
	map.world.tiles.grass = ['grass1']
	map.world.tiles.objs = [{ type:'obj', move:false, image:'cactus1'}]
	map.world.tiles.items = ['gold','revolver','badge','skull']
	map.world.tiles.moveables = [{ type:'obj', move:true, image:'rock'}]
	map.world.tiles.char = [{ type:'char', image:'ghost'}]
	map.world.map = populateMap(generateMap(20), 20, 20, 20, 20, 10)
	function generateMap (size) {
	  var gen = []
    for (var y = 0; y < size; y++) {
      var row = []
      for (var x = 0; x < size; x++) {
        row.push({ 
          x : x, 
          y : y, 
          floor : map.world.tiles.floor[0],
          middle: 0,
          top: 0,
        })
  	  }
      gen.push(row)
    }
    return gen
  }
	function populateMap (gen, objs, items, grass, moveables, chars) {
	  var maxX = gen[0].length - 1
	  var maxY = gen.length-1
	  //gen[utils.rand(maxX)][utils.rand(maxY)].player = map.world.tiles.player
	  while (chars > 0){
	    console.log('chars')
      var x = utils.rand(maxX)
      var y = utils.rand(maxY)
      if (!gen[x][y].top) {
        gen[x][y].top = map.world.tiles.char[0]
        chars--
      }
    }
	  /*while (grass > 0){
	   console.log('grass')
	    var x = utils.rand(maxX)
	    var y = utils.rand(maxY)
	    if (!gen[x][y].floor) {
	      gen[x][y].floor = map.world.tiles.grass[0]
	      grass--
	    }
	  }*/
	  while (objs > 0){
	  console.log('objs')
	    var x = utils.rand(maxX)
	    var y = utils.rand(maxY)
	    if (!gen[x][y].top) {
	      gen[x][y].top = map.world.tiles.objs[0]
	      objs--
	    }
	  }
	  while (items > 0){
	  console.log('items')
	    var x = utils.rand(maxX)
	    var y = utils.rand(maxY)
	    if (!gen[x][y].middle) {
	      gen[x][y].middle = map.world.tiles.items[0]
	      items--
	    }
	  }
	  while (moveables > 0){
	  console.log('moveables')
	    var x = utils.rand(maxX)
	    var y = utils.rand(maxY)
	    if (!gen[x][y].top) {
	      gen[x][y].top = map.world.tiles.moveables[0]
	      moveables--
	    }
	  }
	  return gen
	}
	
})
