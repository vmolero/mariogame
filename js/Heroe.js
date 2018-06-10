/**
Objeto Heroe
Clip de Película que mostrará Mario moviendose por el mapa. El personaje posee su animación interna.

@class Heroe
@constructor
@extends MovieClip
**/
var Heroe = MovieClip.extend({
	/**
	Función constructora para la librería Class
	
	@method init
	@param {String} id
		Identificador del elemento.
	@param {String} escena
		Escena donde se ha creado el objeto.
	**/
	init: function(id, escena) {
		this._super(id, escena);
		
		/**
		* Constante de velocidad para la acción de caminar.
		*
		* @attribute kWalking_v
		* @default 5
		* @type Number
		*/
		this.kWalking_v = 5;
		
		/**
		* Constante de velocidad para el salto.
		*
		* @attribute kJumping_v
		* @default 27
		* @type Number
		*/
		this.kJumping_v = 27;
		
		/**
		* Booleano que nos indica si el clip se mueve rápido o no
		*
		* @attribute rapido
		* @default false
		* @type Boolean
		*/
		this.rapido = false;
		
		/**
		* Constante con vectores que definen los desplazamientos dentro del sprite con cada uno de los fotogramas de la animación.
		*
		* @attribute kPosturas
		* @type Array
		*/
		this.kPosturas = [ 
			[{ x : 81, y : 0},{ x: 0, y : 0}],
			[{ x : 0, y : 81},{ x: 81, y : 81}],
			[{ x: 481, y : 83}],
			[{ x: 561, y : 83}]
		];
		
		/**
		* Variable con información de orientación
		*
		* @attribute kPosturas
		* @default kOrientacion.derecha		
		* @type kOrientacion
		*/
		this.orientacion = this.kOrientacion.derecha;
	},
	
	/**
	La función de renderizado recoge el detector y ejecuta su función leer para prcesar los cambios de teclado
	
	@method render
	@param {JSON Object} detector
		Detector con la informacion de teclado
	@override MovieClip.render
	**/
	render: function(detector) {
		this._super(detector);
		
		this.leer( detector );
	},
	
	/**
	Procesa la información del detector y actúa en consecuencia, llamando en última instancia a mover()
	
	@method leer
	@param {JSON Object} detector
		Detector con la informacion de teclado
	**/
	leer: function(detector) {
		this.rapido = detector.acelerar;
		this.agachado = detector.abajo;
		
		
		if(!this.agachado) {
			if(this.enelsuelo && detector.arriba)
				this.saltar();
				
			if(detector.derecha || detector.izquierda)
				this.vx = this.kWalking_v * (this.rapido ? 2 : 1) * (detector.izquierda ? - 1 : 1);
			else
				this.vx = 0;
				
			this.mover();
		}
	},
	
	/**
	Establece una constante negativa de velocidad en Y que hará que el muñeco salte.
	
	@method saltar
	**/
	saltar: function() {
		this.vy = -this.kJumping_v;
		this.enelsuelo = false;
	},
	
	/**
	Establece una constante negativa de velocidad en Y que hará que el muñeco salte.
	
	@method setVelocidad
	@param {Number} vx
		Constante de velocidad en x
	@param {Number} vy
		Constante de velocidad en y
	@override MovieClip.setVelocidad
	**/
	setVelocidad: function(vx, vy) {
		
		if(this.enelsuelo && vx > 0)
			this.haciaLaDerecha();
		else if(this.enelsuelo && vx < 0)
			this.haciaLaIzquierda();
		else
			this.depie();
		
		
		if (this.vy == 0) {
			this.enelsuelo = true;
		}
		this._super(vx, vy);
	},
	
	/**
	Establece una la configuración para que el muñero camine hacia la derecha.
	
	@method haciaLaDerecha
	**/
	haciaLaDerecha: function() {
		this.orientacion = this.kOrientacion.derecha;
		this.setupFrames((this.rapido ? 8 : 4), 2, true, 'CaminaDerecha');
	},
	
	/**
	Establece una la configuración para que el muñero camine hacia la izquierda.
	
	@method haciaLaIzquierda
	**/
	haciaLaIzquierda: function() {
		this.orientacion = this.kOrientacion.izquierda;
		this.setupFrames((this.rapido ? 8 : 4), 2, true, 'CaminaIzquierda');
	},
	
	/**
	Establece una la configuración para que el muñero se quede de pie.
	
	@method depie
	**/
	depie: function() {
		this.setupFrames(1, 1, true, 'Parado');
	},
	
	/**
	Cambia la posición del objeto y calcula su nueva posición respecto a la cuadrícula. Comprueba si el muñeco sale de los márgenes y si es así, lanza un evento.
	
	@method setPosicion
	@param {Number} x
		Nueva coordenada X.
	@param {Number} y
		Nueva coordenada Y.
	@override Sprite.setPosicion
	**/
	setPosicion: function(x, y) {
		this._super(x,y);
		
				
		if(this.yy > this.escena.getAltoCuadricula())
			this.vista.trigger('muero');
	},
	
	/**
	Posiciona y resetea a Mario en la posición de inicio.
	
	@method reset
	**/
	reset: function() {
		this.setPosicion(110, 200);
		this.enelsuelo = false;
		this.setSpriteEnFotograma(this.kOrientacion.derecha, 0);
	},
	
	/**
	Cambia la posición del objeto y calcula su nueva posición respecto a la cuadrícula. Comprueba si el muñeco sale de los márgenes y si es así, lanza un evento.
	
	@method setPosicion
	@param {kOrientacion} orientacion
		orientación del Movie Clip
	@param {Number} fotograma
		Fotograma que ha de ser mostrado
	@override MovieClip.setSpriteEnFotograma
	**/
	setSpriteEnFotograma: function(orientacion, fotograma) {
		
		try {
			var pos;
			if (orientacion == this.kOrientacion.derecha) {
				pos = this.kPosturas[0][fotograma];
				
			}
			else if (orientacion == this.kOrientacion.izquierda) {
				pos = this.kPosturas[1][fotograma];
			}else if (orientacion == this.kOrientacion.arribaderecha) {
				pos = this.kPosturas[2][0];
			}else if (orientacion == this.kOrientacion.arribaizquierda) {
				pos = this.kPosturas[3][0];
			} 
			
			this.spriteOffsetX = (pos.x || 0);
			this.spriteOffsetY = (pos.y || 0);
			this._super(fotograma);
		}
		catch(e) {
			// console.log("Fotograma: " + fotograma);
		}
	}
});