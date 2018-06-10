/**
Objeto Contenedor que representa la Escena
Será el objeto contenedor padre de todos los elementos del juego.

@class Stage
@constructor
@extends DisplayObjectContainer
**/
var Stage = DisplayObjectContainer.extend({
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
		
		/**
		* Número de Fotogramas por Segundo en la escena
		*
		* @attribute fps
		* @readOnly
		* @default 0
		* @type Number
		*/
		this.fps = 0;
		
		/**
		* Contador de fotogramas
		*
		* @attribute frameCount
		* @default 0
		* @type Number
		*/
		this.frameCount = 0;
		
		/**
		* Representa la última vez que se hizo una medición de los FPS
		*
		* @attribute lastTime
		* @default 0
		* @type Date
		*/
		this.lastTime = 0;
		
		/**
		* Vector de clips de película que poseen animación dentro de la escena. Permite acceder más rápidamente a los objetos que han de renderizarse en cada fotograma.
		*
		* @attribute movieclips
		* @default []
		* @type Array
		*/
		this.movieclips = [];
		
		/**
		* Vector de obstaculos con los que los clips de película pueden colisionar.
		*
		* @attribute obstaculos
		* @default []
		* @type Array
		*/
		this.obstaculos = [];
		
		/**
		* Alto de la cuadrícula expresada en pixeles
		*
		* @attribute altoCuadricula
		* @default 0
		* @type Number
		*/
		this.altoCuadricula = 0;
		
		/**
		* Ancho de la cuadrícula expresada en pixeles
		*
		* @attribute anchoCuadricula
		* @default 0
		* @type Number
		*/
		this.anchoCuadricula = 0;
		
		/**
		* Tamaño de un cadradro de la cuadrícula expresada en pixeles
		*
		* @attribute tileSize
		* @default 32
		* @type Number
		*/
		this.tileSize = 32;

		var me = this;
		/**
		Evento keyup disparado al pulsar una tecla
		
		@event keydown
		@param {Function} anonima
			Función anónima que hace de callback para realizar la llamada al método delegado de la clase.
		**/
		$(document).keydown( function(evt) {
				evt.preventDefault();
				me.onKeyDown(evt);
				return false;
		});
		
		/**
		Evento keyup disparado al soltar una tecla
		
		@event keyup
		@param {Function} anonima
			Función anónima que hace de callback para realizar la llamada al método delegado de la clase.
		**/
		$(document).keyup( function(evt) {
				evt.preventDefault();
				me.onKeyUp(evt);
				return false;
		});
		
		/**
		* DisplayObject que debe ser seguido por la escena
		*
		* @attribute camara
		* @default null
		* @type DisplayObject
		*/
		this.camara = null;
		
		/**
		* Elemento jQuery que enlaza con el viewport de la pantalla del navegador
		*
		* @attribute viewport
		* @default $('#viewport')
		* @type jQuery Element
		*/
		this.viewport = $('#viewport');
	},
	
	/**
	Selecciona el objeto que debe ser seguido por la cámara.
	
	@method seguir
	@param {DisplayObject} dobj
		Objecto DisplayObject que va a ser seguido por la escena
	**/
	seguir: function(dobj) {
		this.camara = dobj;
	},
	
	/**
	Función que implementa el bucle del juego
	
	@method start
	**/
	start: function() {
		var me = this;
		(function animloop(){
		  requestAnimationFrame(animloop);
		  me.render();
		})();
		this.vista.appendTo($('#viewport'));
	},
	
	/**
	Añade una instancia secundaria de DisplayObject a esta instancia de DisplayObjectContainer
	
	@method addChild
	@param {DisplayObject} dis_obj
		Objecto DisplayObject que va a ser contenido
	@return {Number} 
		Índice del objeto dentro del vector
	@overrides DisplayObjectContainer.addChild
	**/
	addChild: function(dis_obj) {
		var indice = this._super(dis_obj);
		if  (dis_obj instanceof MovieClip) {
			this.movieclips.push(indice);
		}
		return indice;
	},
	
	/**
	Método setter para el tamaño de baldosa
	
	@method setTileSize
	@param {Number} n
		Tamaño del cuadrado que forma la cuadríacula
	**/
	setTileSize: function(n) {
		this.tileSize = n;
	},
	
	/**
	Método setter para el alto de la cuadrícula
	
	@method setAltoCuadricula
	@param {Number} h
		Nuevo alto de la cuadrícula
	**/
	setAltoCuadricula: function( h ) {
		this.altoCuadricula = h;
	},
	
	/**
	Método setter para el ancho de la cuadrícula
	
	@method setAnchoCuadricula
	@param {Number} w
		Nuevo ancho de la cuadrícula
	**/
	setAnchoCuadricula: function( w ) {
		this.anchoCuadricula = w;
	},
	
	/**
	Método getter para el ancho de la cuadrícula.
	
	@method getAnchoCuadricula
	@return {Number} 
		Anchura de la cuadrícula en pixeles
	**/
	getAnchoCuadricula: function() {
		return this.anchoCuadricula;
	},
	
	/**
	Método getter para el alto de la cuadrícula.
	
	@method getAltoCuadricula
	@return {Number} 
		Altura de la cuadrícula en pixeles
	**/
	getAltoCuadricula: function() {
		return this.altoCuadricula;
	},
	
	/**
	El renderizado de la escena consiste mover la cámara hacia el objeto que la tenga asignada.
	
	@method render
	**/
	render: function() {
		this._super();
		this.MeasureFPS();
		
		if (this.camara != null) {
			var currentWidth = this.viewport.width();
			
			if (this.camara.x >= 0 && this.camara.x < (currentWidth/3)) {
				this.centrarCamara("Inicio");
			} else if (this.camara.x >= 0 && this.camara.x >= (currentWidth/3) && (this.camara.x + (2*currentWidth/3)) < this.width) {
				this.centrarCamara("Centro");
			} else {
				this.centrarCamara("Final");
			}	
		}
	},
	
	/**
	Establece la nueva posición de la escena para simular el seguimiento de la cámara.
	
	@method centrarCamara
	@param {string} etiqueta
		Cadena de texto que representa uno de los tres estado que nos podemos encontrar
	**/
	centrarCamara: function(etiqueta) {
		switch(etiqueta) {
			case "Inicio":
				this.setPosicion(0,0);
				break;
			case "Centro":
				this.setPosicion( (-1)*this.camara.getX() + Math.round(this.viewport.width()/3) , this.getY() );
				break;
			case "Final":
				this.setPosicion( (-1)*this.getWidth() + this.viewport.width(), this.getY() );
				break;
		}
	},
	
	/**
	Nos permite obtener un obstaculo en la posición (X,Y) de la cuadrícula. Si no existe obstáculo devuelve null.
	
	@method getObstaculoEn
	@param {Number} xx
		Coordenada X del obstaculo usando como unidad de medida la cuadríacula (no en pixeles)
	@param {Number} yy
		Coordenada Y del obstaculo usando como unidad de medida la cuadríacula (no en pixeles)
	@return {DisplayObject}
	**/
	getObstaculoEn: function(xx, yy) {
		var encontrado = false;
		var tam = this.obstaculos.length;
		var obj = null;
		for (var k=tam-1; k>=0 && !encontrado;) {
			if (this.obstaculos[k].yy == yy && this.obstaculos[k].xx == xx) {
				encontrado = true;
				obj = this.obstaculos[k];
				}
			else k--;
		}
		return obj;	
	},
	
	/**
	Muestra en pantalla el número de fotogramas por segundo por pantalla
	
	@method MeasureFPS
	**/
	MeasureFPS: function() {
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
	},

	/**
	Función delegada que hace de callback para el evento de teclado keydown
	
	@method onKeyDown
	@param {Object} evt
		Objeto que representa el Evento
	**/
	onKeyDown: function(evt) {
	},
	
	/**
	Función delegada que hace de callback para el evento de teclado keyup
	
	@method onKeyUp
	@param {Object} evt
		Objeto que representa el Evento
	**/
	onKeyUp: function(evt) {
	}
});