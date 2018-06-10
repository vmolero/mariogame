(function (w) {
  "use strict";
  
  var engine = {},
      $ = w.$ || {},
      ENGINE = w.ENGINE || {},
      loop = (function(){
	  return window.requestAnimationFrame ||
		  window.webkitRequestAnimationFrame ||
		  window.mozRequestAnimationFrame ||
		  window.oRequestAnimationFrame ||
		  window.msRequestAnimationFrame ||
		  function(/* function */ callback, /* DOMElement */ element){
		  window.setTimeout(callback, 1000 / 60);
		  };
      })();
  
  engine.frameCount = 0;
  engine.fps = 0;
  engine.lastTime = 0;
  
  engine.MeasureFPS = function() {
	  var newTime = +(new Date());
	  var diffTime = newTime - this.lastTime; //calculate the difference between last & current frame
	  var fpsContainer = $("#fpsContainer");
	  
	  if (diffTime >= 1000) {
		  this.fps = this.frameCount;
		  this.frameCount = 0;
		  this.lastTime = newTime;
	  }
	  fpsContainer[0].innerHTML = 'FPS: ' + this.fps; //and display it in an element we append to the document in start() functio
	  this.frameCount++;
  };
  
  
  engine.mainLoop = function(){
	  //main function, called each frame
	  ENGINE.MeasureFPS();
	  
	  loop(ENGINE.mainLoop);
  };
  
  engine.start = function(){
    /* Comenzamos por construir el mapa 
       El mapa lo leemos del json generado por el MapEditor */
    
    $.getJSON("assets/mundo1.json", function(data){
      //var json = $.parseJSON(data);
      
      var items = [], map_tile_height = data.height, map_tile_width = data.width,
	  canvas = $('#background_layer'), ctx = null, sprite = $('img'),
	      ntilesperrow = 0, ntilespercolumn = 0,margin,spacing,x,y,ntiles=0,i=0,ncapa=0, pos={},mapx=0,mapy=0,pair={},
	  tileheight, tilewidth, imageheight, imagewidth, yoffset, xoffset, gather=[],storeOffset=[], firstgid=1;
	  
      ctx = canvas[0].getContext("2d");
      canvas[0].height = parseInt(data.tileheight)*parseInt(data.height);
      canvas[0].width = parseInt(data.tilewidth)*parseInt(data.width);
      
      ctx.clearRect(0, 0, canvas[0].width, canvas[0].height);
      for (ncapa = 0; ncapa < data.layers.length; ncapa++)
      {
	storeOffset=[];
	
	// sprite.attr('src',data.tilesets[ncapa].image);
      
      firstgid = parseInt(data.tilesets[ncapa].firstgid)-1;
      tileheight = parseInt(data.tilesets[ncapa].tileheight);
      tilewidth = parseInt(data.tilesets[ncapa].tilewidth);
      imageheight = parseInt(data.tilesets[ncapa].imageheight);
      imagewidth = parseInt(data.tilesets[ncapa].imagewidth);
      
      spacing = parseInt(data.tilesets[ncapa].spacing);
      margin = parseInt(data.tilesets[ncapa].margin);
      
      ntilesperrow = Math.floor(imagewidth / tilewidth);
      ntilespercolumn = Math.floor(imageheight / tileheight);
      
      gather = (function (v) {
	  var gathered = [];
	  $.each(v, function(key, val) {
	    if (parseInt(val) > 0){
	      gathered.push({key: key, value: val-firstgid});
	    }
	  });
	  return gathered;
      })(data.layers[ncapa].data);
      
      ntiles = ntilesperrow*ntilespercolumn;
      
      for (i=ntiles; i>0; i--) {
	yoffset = Math.ceil(i / ntilesperrow)-1;
        xoffset = (i-1) % ntilesperrow;
	storeOffset[i] = { x: margin + (xoffset * (tilewidth + spacing)), y: margin + (yoffset * (tileheight + spacing)) }; 
      }

      for (i=gather.length-1; i>=0; i--){
	    pair = gather[i];
	    pos = storeOffset[Math.min(pair.value,ntiles)];
	    
	    mapy = (Math.ceil(pair.key/parseInt(data.width))-1)*tilewidth;
	     mapx = ((pair.key-1)%parseInt(data.width))*tileheight;
	     ctx.drawImage(sprite[ncapa], pos.x, pos.y, tilewidth, tileheight, mapx, mapy, tilewidth, tileheight);  
	   
	}
      }

    });
    
    
    loop(ENGINE.mainLoop);
  };
  
  window.ENGINE = $.extend(ENGINE, engine);
  
}(window));