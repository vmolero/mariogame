/**
Objeto MovieClip
Representa a los objetos de pantalla que poseen la etiqueta canvas y una imagen con sprites para representar la animación.

@class MovieClip
@constructor
@extends Sprite
**/
var MovieClip = Sprite.extend({
	/**
	Función constructora para la librería Class
	
	@method init
	@param {String} domid
		Identificador del elemento.
	@param {String} escena
		Escena donde se ha creado el objeto.
	**/
	init: function(domid, escena) {
		this._super(domid, "canvas", escena);
		
		/**
		* Constante de gravedad a aplicar al clip de pelicula
		*
		* @attribute kGravedad
		* @default 2
		* @type Number
		*/
		this.kGravedad = 2;
		
		/**
		* Enumeración en formato JSON de las posibles orientaciones de un movieClip
		*
		* @attribute kOrientacion
		* @type JSON Object
		*/
		this.kOrientacion = { 
			ninguna  	: 0,
			izquierda  	: 1,
			arriba    	: 2,
			derecha 	: 3,
			abajo  		: 4
		};
		
		/**
		* Orientación que posee el clip de pelicula
		*
		* @attribute orientacion
		* @default kOrientacion.derecha
		* @type Number
		*/
		this.orientacion = this.kOrientacion.derecha;
		
		/**
		* Objeto JSON que contendrá información de detección de teclado obtenido al renderizar
		*
		* @attribute detector
		* @default {}
		* @type JSON Object
		*/
		this.detector = {};
		
		/**
		* Constante de velocidad aplicado al eje X
		*
		* @attribute vx
		* @default 0
		* @type Number
		*/
		this.vx = 0;
		
		/**
		* Constante de velocidad aplicado al eje Y
		*
		* @attribute vy
		* @default 0
		* @type Number
		*/
		this.vy = 0;
		

		/**
		* Especifica el número del fotograma en el que está situada la cabeza lectora en la línea de tiempo de la instancia de MovieClip.
		*
		* @attribute currentFrame
		* @default 0
		* @type Number
		*/
		this.currentFrame = 0;
		
		/**
		*  La etiqueta actual en la que está situada la cabeza lectora en la línea de tiempo de la instancia de MovieClip.
		*
		* @attribute currentLabel
		* @default ""
		* @type String
		*/
		this.currentLabel = "";
		

		/**
		*  Numero total de Frames que componen la animación
		*
		* @attribute totalFrames
		* @default 0
		* @type Number
		*/
		this.totalFrames = 0;
		
		/**
		*  Frecuencia con la que se actualiza la animación respecto a los fotogramas por segundo
		*
		* @attribute frameTick
		* @default 0
		* @type Number
		*/
		this.frameTick = 0;
		
		/**
		*  Contador de frames
		*
		* @attribute frameCount
		* @default 0
		* @type Number
		*/
		this.frameCount = 0;
		
		/**
		*  Booleano que nos indica si el movieclip está en el obstaculaizado por debajo
		*
		* @attribute enelsuelo
		* @default true
		* @type Boolean
		*/
		this.enelsuelo = true;
		
		/**
		*  Booleano que nos indica si se debe volver al fotograma 0 tras alcanzar el último de la animación.
		*
		* @attribute loop
		* @default true
		* @type Boolean
		*/
		this.loop = true;
	},

	/**
	Método para establecer la configuración de la animación
	
	@method setupFrames
	@param {Number} fps
		Fotogramas por segundo de la animación interna
	@param {Number} frames
		fotogramas que componen la animación
	@param {Boolean} rewind
		NOs permite establecer si hay loop en la animación
	@param {String} id
		Etiqueta para la configuración
	@return Boolean
		true sí ya está cargada esa configuración de frames, false en caso que no
	**/
	setupFrames: function(fps, frames, rewind, id) {
		if(id) {
			if(this.currentLabel === id)
				return true;
			
			this.currentLabel = id;
		}
		
		this.currentFrame = frames>1 ? 1 : 0;
		this.frameTick = frames ? (1000 / fps / 20) : 0;
		this.totalFrames = frames;
		this.loop = rewind;
		return false;
	},
	
	/**
	Mueve la cabeza lectora por la línea de tiempo del clip de película. Controla el cambio de fotograma dentro de la animación tomando como referencia lof FPS de la escena ya que la función es invocada junto a render.
	
	@method play
	**/
	play: function() {
		if(this.frameTick && this.vista) {
			this.frameCount++;
			
			if(this.frameCount >= this.frameTick) {			
				this.frameCount = 0;
				
				if(this.currentFrame === this.totalFrames)
					this.currentFrame = 0;

				
				this.setSpriteEnFotograma(this.orientacion, this.currentFrame);
				this.currentFrame++;
			}
		}
	},
	
	/**
	Método setter para el ancho.
	
	@method setWidth
	@param {Number} w
		Nueva anchura del elemento.
	@override DisplayObject.setWidth
	**/
 	setWidth: function(w) {
		this.canvas.width = w;
		this.width = w;
	},
	
	/**
	Método setter para el alto.
	
	@method setHeight
	@param {Number} h
		Nueva altura del elemento.
	@override DisplayObject.setHeight
	**/
	setHeight: function(h) {
		this.canvas.height = h;
		this.height = h;
	},	
	
	/**
	La función de renderizado recoge el detector y ejecuta su función play para llevar a cabo la animación del Movie Clip
	
	@method render
	@param {JSON Object} detector
		Detector con la informacion de teclado
	@override DisplayObject.render
	**/
	render: function(detector) {
		this._super();
		this.detector = detector;
		this.play();
	},
	
	/**
	Actualiza las constantes de velocidad y en función de éstas establece la orientación del Clip de Película.
	
	@method setVelocidad
	@param {Number} vx
		Constante de velocidad del eje X
	@param {Number} vy
		Constante de velocidad del eje Y
	**/
	setVelocidad: function(vx, vy) {
		this.vx = vx;
		this.vy = vy;
		
		if(vx > 0)
			this.orientacion = this.kOrientacion.derecha;
		else if(vx < 0)
			this.orientacion = this.kOrientacion.izquierda;
	},
	
	/**
	Obtiene las constantes de velocidad
	
	@method getVelocidad
	@return {JSON Object}
		Objeto JSON con las constantes de velocidad
	**/
	getVelocidad: function() {
		return { vx : this.vx, vy : this.vy };
	},
	
	/**
	Muestra el fotograma correspondiente que haya dado por las variables (spriteOffsetX, spriteOffsetY) que son el desplazamiento de la imagen (sprite)
	
	@method setSpriteEnFotograma
	**/
	setSpriteEnFotograma: function() {
		this.ctx.clearRect(0, 0, this.width, this.height);
		this.ctx.drawImage(this.imagen, (-1)*this.spriteOffsetX, (-1)*this.spriteOffsetY);
	},
	
	/**
	Recoge los valores de velocidad y los aplica al MovieClip haciendolo que se mueva en la escena. Incorpora la gravedad y detecta colisiones.
	
	@method mover
	**/
	mover: function() {
		
		// Cogemos las constantes de velocidad
		var vx = this.vx;
		var vy = this.vy + this.kGravedad; // La constante de velocidad y se decrement siempre en 2 debido a la gravedad.
		
				
		var x = this.x; // Posición actiual (x,y)
		var y = this.y;
		
		var dx = Math.signo(vx); // Obtiene la dirección de la X
		var dy = Math.signo(vy); // Obtiene la dirección de la Y
		
		var is = this.xx;   // Obtiene la posición i de la cuadrícula (grid)
		var ie = is;		// Asigna a ie la i de la cuadrícula
		
		var js = Math.ceil( (y + this.height) / this.escena.tileSize);  // Calcula Altura del mapa - (1 | 2) - (POsición y +31) / 32 this.escena.getAltoCuadricula() -
		var je = this.yy; // Posición j del grid
		
		var d = 0; //, b = ground_blocking.none;
		var onground = false;
		var t;
		
		if(dx > 0) {
			t = Math.floor((x + this.width + vx) / this.escena.tileSize); // El cuadrado donde caería el objeto aplicando la velocidad
			d = t - ie; // Distancia en el eje X de cuadritos (negativo?) Modulo
			t = ie;		// Asigna a t el valor de i
			//b = ground_blocking.left; // b coge el valor de bloqueo de la izda.
		} else if(dx < 0) {
			t = Math.floor((x + vx) / this.escena.tileSize); // El cuadrado donde caería el objeto aplicando la velocidad
			d = is - t;
			t = is;		
			//b = ground_blocking.right;
		}
		
		x += vx; // Suma a la X la velocidad
		
		for(var i = 0; i < d; i++) {  // Desde 0 hasta el modulo
			var dobj=null;
			var i = 0;
			var vpy = [(this.y + this.height) - 10, (this.y + this.height) - 5, (this.y + this.height)];
			do {
				var puntoY = Math.ceil(vpy[i]/ this.escena.tileSize);
				dobj = this.escena.getObstaculoEn(t+dx, puntoY);
				i++;
			} while(dobj== null && i<vpy.length);
			
			if (dobj && this.hitTestObject(dobj)) {
				vx = 0;
				x = (dx ? dobj.x - this.width - 1 : dobj.x + dobj.width + 1);
				break;
			}
			
			
			t += dx;
			//is += dx;
			//ie += dx;
		}
		
		if(dy > 0) {
			t = Math.ceil((y + this.height + vy) / this.escena.tileSize);  // - s this.escena.getAltoCuadricula() - 1 - 
			d = t - js;
			t = js;
			//b = ground_blocking.bottom;
		} else if(dy < 0) {
			t = Math.ceil((y + vy) / this.escena.tileSize) -1; //this.escena.getAltoCuadricula() - 1 - 
			d = je - t;
			t = je;
			//b = ground_blocking.top;
		} else
			d = 0;
		
		y += vy;
		
		var ycolision = false;
		for(var i = 0; i < d && !ycolision;) {
			/*if(this.collides(is, ie, t - dy, t - dy)) {
				onground = dy > 0;
				vy = 0;
				y = (t + 1) * 32 + (dy > 0 ? (1 - 1) * 32 : 0); // (s - 1) // this.escena.height - 
				break;
			}*/
			var dobj=null;
			var i = 0;
			var centroX = this.x + (this.width/2);
			var vpx = [centroX-5, centroX, centroX+5];
			do {
				var puntoX = Math.floor(vpx[i]/this.escena.tileSize);
				dobj = this.escena.getObstaculoEn(puntoX, (dy?t+dy:t-1-dy));
				i++;
			} while(dobj== null && i<vpx.length);
			
			if (dobj && this.hitTestObject(dobj)) {
				ycolision = true;
				onground = dy > 0;
				vy = 0;
				y = (dy ? dobj.y - this.height - 1 : dobj.y + dobj.height + 1);
			}
			else i++;
			
			
			t += dy;
		}
		
		this.enelsuelo = onground;
		this.setVelocidad(vx, vy);
		this.setPosicion(x, y);
		
	}
});