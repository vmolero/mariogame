/**
Objeto Sprite
Representa a los objetos de pantalla que poseen una imagen de fondo estática y que no poseen animación propia.

@class Stage
@constructor
@extends DisplayObjectContainer
**/
var Sprite = DisplayObjectContainer.extend({
	/**
	Función constructora para la librería Class
	
	@method init
	@param {String} domid
		Identificador del elemento.
	@param {String} tipo
		Tipo de etiqueta "div o "canvas" a ser utilizada.
	@param {String} escena
		Escena donde se ha creado el objeto.
	**/
	init: function(domid, tipo, escena) {
		this._super(domid, tipo);
		
		/**
		* Representa la imagen de fondo como DOM Element
		*
		* @attribute imagen
		* @default null
		* @type DOM ELement
		*/
		this.imagen = null;
		
		/**
		* Representa el desplazamiento X de la imagen de fondo (sprite)
		*
		* @attribute spriteOffsetX
		* @default 0
		* @type Number
		*/
		this.spriteOffsetX = 0;
		
		/**
		* Representa el desplazamiento Y de la imagen de fondo (sprite)
		*
		* @attribute spriteOffsetY
		* @default 0
		* @type Number
		*/
		this.spriteOffsetY = 0;
		
		/**
		* Escena en la que está contenido el Sprite
		*
		* @attribute escena
		* @type Stage
		*/
		this.escena = escena;
		
		/**
		* Representa la coordenada X de la cuadrícula (número de cuadrados, no piseles)
		*
		* @attribute xx
		* @default 0
		* @type Number
		*/
		this.xx = 0;
		
		/**
		* Representa la coordenada Y de la cuadrícula (número de cuadrados, no piseles)
		*
		* @attribute yy
		* @default 0
		* @type Number
		*/
		this.yy = 0;
		
		if (this.tipo  == "canvas") {
			
			/**
			* Canvas del Sprite como elemento del DOM
			*
			* @attribute canvas
			* @type DOM Element
			*/
			this.canvas = this.vista[0];
			
			/**
			* Contexto 2D obtenido del canvas
			*
			* @attribute ctx
			* @type Canvas Context
			*/
			this.ctx = this.canvas.getContext("2d");
		}
	
	},
	
	/**
	Método que inicializa la imagen de fondo o carga la imagen en caso del canvas.
	
	@method setImagen
	@param {jQuery Element} img
		Imagen a ser cargada como objeto jQuery
	@param {String} x
		Coordenada x de desplazamiento de la imagen.
	@param {String} y
		Coordenada y de desplazamiento de la imagen.
	@event onLoadSprite
		Se dispara al haber cargado la imagen.
	**/
	setImagen: function(img, x, y) {
		this.spriteOffsetX = (-1)*(x || 0);
		this.spriteOffsetY = (-1)*(y || 0);
		
		if (this.tipo  == "div") {
			this.vista.css({
				backgroundImage : img ? 'url(' + img.attr('src') + ')' : 'none',
				backgroundPosition : '-' + (x || 0) + 'px -' + (y || 0) + 'px',
			});
			this.vista.trigger('onLoadSprite');
		}
		else if (this.tipo  == "canvas") {
			var im = new Image();
			var me = this;
			im.onload = function() {
				me.imagen = im;
				me.vista.trigger('onLoadSprite');
			}
			im.src = img.attr('src');
		}
	},
	
	/**
	Función que implementa el bucle del juego.
	
	@method setVisible
	@param {Boolean} v
		Establece si el elemento se muestra o no en pantalla
	**/
	setVisible: function(v) {
		if (v) this.vista.show();
		else this.vista.hide();
	},
	
	/**
	Método setter para establecer el desplazamiento de la imagen de fondo (sprite)
	
	@method setOffset
	@param {Number} x
		Nueva coordenada X.
	@param {Number} y
		Nueva coordenada Y.
	**/
	setOffset: function(x, y) {
		this.spriteOffsetX = x;
		this.spriteOffsetY = y;
	},
	
	/**
	Cambia la posición del objeto y calcula su nueva posición respecto a la cuadrícula.
	
	@method setPosicion
	@param {Number} x
		Nueva coordenada X.
	@param {Number} y
		Nueva coordenada Y.
	@override DisplayObject.setPosicion
	**/
	setPosicion: function(x, y) {
		this._super(x, y);
		
		this.xx = Math.floor((x + (this.escena.tileSize/2)) / this.escena.tileSize);
		this.yy = Math.ceil((y + (this.height/2)) / this.escena.tileSize); // this.escena.getAltoCuadricula() - 1 - 
	},
	
	/**
	Ninguna acción se toma puesto que las imagenes de fondo son estáticas.
	
	@method render
	@override DisplayObject.render
	**/
	render: function() {
		this._super();
	}
	
});