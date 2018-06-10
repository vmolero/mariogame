/**
Objeto MarioGameEngine
Escena específica del Juego de Mario

@class MarioGameEngine
@constructor
@extends Stage
**/
var MarioGameEngine = Stage.extend({
	/**
	Función constructora para la librería Class
	
	@method init
	@param {String} domid
		Identificador del elemento.
	@param {String} tipo
		Tipo de etiqueta "div o "canvas" a ser utilizada.
	**/
	init: function(domid, tipo) {
		this._super(domid, tipo);
		
		this.setPosicion(0,0);
		
		/**
		* Objeto JSON que representa los estado de pulsar las teclas
		*
		* @attribute detector
		* @default { "nada": true, "acelerar": false, "arriba": false, "derecha": false, "izquierda": false, "abajo": false }
		* @type JSON Object
		*/
		this.detector = { "nada": true, "acelerar": false, "arriba": false, "derecha": false, "izquierda": false, "abajo": false };
		
	},
	
	/**
	Función que implementa el bucle del juego.
	
	@method start
	@override Stage.start
	**/
	start: function() {
		this._super();
	},
	
	/**
	Método que carga en mundo en formato JSON. Lanza un evento al cargar el mapa.
	
	@method cargarMundo
	@param {String} url
		URL del archivo JSON
	@event cargarMundo
	**/
	cargarMundo: function(url) {
		var me = this;
		$.getJSON(url, function(data) {
			me.alcargarMundo(data);
			console.log(me.id);
			$(document).trigger('cargarMundo', [me.id]);
		});	
	},
	
	/**
	Método que carga los personajes en el mapa. En nuestro caso solo a Mario.
	
	@method cargarPersonajes
	@event cargarPersonajes
	**/
	cargarPersonajes: function() {
		
		var mario = new Heroe("heroe", this);
		var me = this;
		
		mario.setHeight(80);
		mario.setWidth(80);
		
		mario.vista.on('muero', function(evt) {
			mario.reset();
		});
		
		mario.vista.one('onLoadSprite', function (evt) {
			me.addChild(mario);
			mario.reset();
			me.seguir(mario);
			$(document).trigger('cargarPersonajes', [me.id]);
		});
		mario.setImagen($('#spritemario'), 80, 0);
	},
	
	/**
	Método callback que se ejecuta al haber cargado el mundo.
	
	@method alcargarMundo
	@param {JSON Object} data
		Objeto JSON con información del mapa
	**/
	alcargarMundo: function(data) {
		var items = [], map_tile_height = data.height, map_tile_width = data.width,
			ctx = null, sprite = $('img'),
			ntilesperrow = 0, ntilespercolumn = 0,margin,spacing,x,y,ntiles=0,i=0,ncapa=0, pos={},mapx=0,mapy=0,pair={},
			tileheight, tilewidth, imageheight, imagewidth, yoffset, xoffset, gather=[],storeOffset=[], firstgid=1, esobstaculo = true;
		  
		
		
		this.setHeight( parseInt(data.tileheight)*parseInt(data.height) );
		this.setWidth( parseInt(data.tilewidth)*parseInt(data.width) );
		
		this.setAltoCuadricula( parseInt(data.height) );
		this.setAnchoCuadricula( parseInt(data.width) );
		
		for (ncapa = 0; ncapa < data.layers.length; ncapa++)
		{
			storeOffset=[];
			
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
			
			var prefijo = "";
			if (data.layers[ncapa].type == "backgroundlayer") 
			{
				esobstaculo = false;
				prefijo = "fondo_";
			}
			else {
				esobstaculo = true;
				prefijo = "baldosa_";
			}
			
			for (i=gather.length-1; i>=0; i--) {
				pair = gather[i];
				pos = storeOffset[Math.min(pair.value,ntiles)];
				
				mapy = (Math.ceil(pair.key/parseInt(data.width))-1)*tilewidth;
				mapx = ((pair.key-1)%parseInt(data.width))*tileheight;
				
				var img = sprite.eq(ncapa);
				
				var cuadradito = null;
				
				
				if (esobstaculo) {
					cuadradito = new Suelo(prefijo+i, "div", this);
				}
				else cuadradito = new Decoracion(prefijo+i, "div", this);
				
				
				cuadradito.setImagen(img,pos.x, pos.y);
				cuadradito.setWidth( tilewidth );
				cuadradito.setHeight( tileheight );
				
				cuadradito.setPosicion(mapx,mapy);
				
				this.addChild(cuadradito);
			}
		}
		
	},
	
	/**
	El manejador de teclado modifica el detector de forma que luego se puede pasar a los clips de película durante el renderizado.
	
	@method manejadorTeclado
	@param {Numer} code
		Código de tecla
	@param {Boolean} status
		true o false en función de si se pulsa o suelta la tecla
	**/
	manejadorTeclado : function(code, status) {
		switch(code) {
			case 57392://CTRL on MAC
			case 17://CTRL
			case 65://A
				this.detector.acelerar = status;
				break;
			case 40://DOWN ARROW
				this.detector.abajo = status;
				break;
			case 39://RIGHT ARROW
				this.detector.derecha = status;
				break;
			case 37://LEFT ARROW
				this.detector.izquierda = status;			
				break;
			case 32: // Espacio
			case 38://UP ARROW
				this.detector.arriba = status;
				break;
			default:
				break;
		}
		this.detector.nada = !status;
	},
	
	/**
	Función delegada que hace de callback para el evento de teclado keydown Invoca a la función que se encarga de manejar actualizar el detetor.
	
	@method onKeyDown
	@param {Object} evt
		Objeto que representa el Evento
	@override Stage.onKeyDown
	**/
	onKeyDown: function(evt) {
		this._super(evt);
		this.manejadorTeclado(evt.keyCode, true);
	},
	
	/**
	Función delegada que hace de callback para el evento de teclado keyup Invoca a la función que se encarga de manejar actualizar el detetor.
	
	@method onKeyUp
	@param {Object} evt
		Objeto que representa el Evento
	@override Stage.onKeyUp
	**/
	onKeyUp: function(evt) {
		this._super(evt);
		this.manejadorTeclado(evt.keyCode, false);
	},
	
	/**
	El renderizado consiste en 1) Invocar el método que realiza las animaciones interiores de los movieClips y 2) Invocar el método render de todos los MovieClips de la escena, pasando como parámetro el detector.
	
	@method render
	**/
	render: function() {
		var i = this.movieclips.length-1;
		
		while (i>=0) 
		{
			
			this.children[this.movieclips[i]].play( this.detector );
			this.children[this.movieclips[i]].render(this.detector);

			i--;
		}
		this._super();
	},
	
	/**
	Modifica la constante de velocidad para compensar el movimiento de la cámara
	
	@method centrarCamara
	@param {string} etiqueta
		Cadena de texto que representa uno de los tres estado que nos podemos encontrar
	@override Stage.centrarCamara
	**/
	centrarCamara: function(etiqueta) {
		this._super(etiqueta)
		switch(etiqueta) {
			case "Inicio":
			case "Final":
				window.reflexion["heroe"].kWalking_v = 5;
				break;
			case "Centro":
				window.reflexion["heroe"].kWalking_v = 7;
				break;
		}
		
	}
});