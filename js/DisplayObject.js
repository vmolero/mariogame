/**
Objeto Principal de la jerarqu�a
Define las prpiedades comunes a todos los objetos de pantalla

@class DisplayObject
@constructor
**/
var DisplayObject = Class.extend({
	
	/**
	Funci�n constructora para la librer�a Class
	
	@method init
	@param {String} id
		Identificador del elemento.
	@param {String} tipo
		Tipo de etiqueta "div o "canvas" a ser utilizada.
	**/
	init: function(id, tipo) {
		/**
		* Tipo de etiqueta div | canvas
		*
		* @attribute tipo
		* @readOnly
		* @default "canvas"
		* @type string
		*/
		this.tipo  = tipo || "canvas";
		
		
		window.reflexion = window.reflexion || {};
		window.reflexion[id] = this;
		
		
		/**
		* Representa el id del DOM como objeto jQuery
		*
		* @attribute vista
		* @readOnly
		* @type jQuery Element
		*/
		this.vista = $("<"+this.tipo +" id='" + id + "'></"+this.tipo +">");
		this.vista.css('position','absolute');
		

		/**
		* Identificador del objeto
		*
		* @attribute id
		* @readOnly
		* @type string
		*/
		this.id = id;
	
		
		/**
		* Indica la altura del objeto de visualizaci�n, expresada en p�xeles.
		*
		* @attribute height
		* @default 0
		* @type Number
		*/
		this.height = 0;
		
		/**
		* Indica la anchura del objeto de visualizaci�n, expresada en p�xeles.
		*
		* @attribute width
		* @default 0
		* @type Number
		*/
		this.width = 0;
		
		/**
		* Indica si el objeto de visualizaci�n es visible.
		*
		* @attribute visible
		* @default true
		* @type Boolean
		*/
		this.visible = true;

 	 	/**
		* Indica la coordenada x de la instancia de DisplayObject en relaci�n a las coordenadas locales del DisplayObjectContainer principal.
		*
		* @attribute x
		* @default 0
		* @type Number
		*/
		this.x = 0;

 	 	/**
		* Indica la coordenada y de la instancia de DisplayObject en relaci�n a las coordenadas locales del DisplayObjectContainer principal.
		*
		* @attribute y
		* @default 0
		* @type Number
		*/
		this.y = 0;
		
		
		this.vista.click(this.onClick);
	},
	
	/**
	Devuelve un rect�ngulo que define el �rea del objeto de visualizaci�n relativo al sistema de coordenadas del objeto que lo contiene.
	
	@method getBounds
	@return {JSONObject}	Representaci�n en formato JSON de los puntos de un rect�ngulo.
	**/
	getBounds: function() {
		return { a: [this.x, this.y], b: [this.x+this.width, this.y], c: [this.x,this.y+this.height], d: [this.x+this.width, this.y+this.height] }
	},
	
	/**
	Eval�a el objeto de visualizaci�n para comprobar si se solapa o presenta un punto de intersecci�n con el objeto de visualizaci�n 'display_object'.
	
	@method hitTestObject
	@param {DisplayObject} display_object
		DisplayObject con el que comprobar la intersecci�n.
	@return {Boolean} 
		true si existe solapamiento, false en caso contrario.
	**/
	hitTestObject: function(display_object)
	{
		var RectA = this.getBounds();
		var RectB = display_object.getBounds();
		
		if (RectA.a[0] < RectB.b[0] && RectA.b[0] > RectB.a[0] &&
    RectA.a[1] < RectB.c[1] && RectA.c[1] > RectB.b[1])
			return false;
		else return true;
	},
	
	/**
	M�todo getter para X.
	
	@method getX
	@return {Number} 
		Coordenada X del elemento.
	**/
	getX: function() {
		return this.x;
	},
	
	/**
	M�todo setter para X.
	
	@method setX
	@param {Number} x
		Nueva coordenada X.
	**/
	setX: function(x) {
		this.setPosicion(x, this.y);
	},
	
	/**
	M�todo getter para Y.
	
	@method getY
	@return {Number} 
		Coordenada Y del elemento.
	**/
	getY: function() {
		return this.y;
	},
	
	/**
	M�todo setter para Y.
	
	@method setX
	@param {Number} y
		Nueva coordenada Y.
	**/
	setY: function(y) {
		this.setPosicion(this.x, y);
	},
	
	/**
	M�todo getter para el ancho.
	
	@method getWidth
	@return {Number} 
		Anchura del elemento.
	**/
	getWidth: function() {
		return this.width;
	},
	
	/**
	M�todo setter para el ancho.
	
	@method setWidth
	@param {Number} w
		Nueva anchura del elemento.
	**/
	setWidth: function(w) {
		this.vista.width(w);
		this.width = w;
	},
	
	/**
	M�todo getter para el alto.
	
	@method getHeight
	@return {Number} 
		Altura del elemento.
	**/
	getHeight: function() {
		return this.height;
	},
	
	/**
	M�todo setter para el alto.
	
	@method setHeight
	@param {Number} h
		Nueva altura del elemento.
	**/
	setHeight: function(h) {
		this.vista.height(h);
		this.height = h;
	},
	
	/**
	Funci�n que detecta el prefijo a aplicar en funci�n del navegador.
	
	@method detectPropertyPrefix
	@param {String} property
		Propiedad CSS3
	@return {String} | {Boolean}
		La propiedad CSS3 si es compatible. False si no es compatible
	**/
	detectPropertyPrefix: function(property) {
	   var prefixes = ['Moz', 'Ms', 'Webkit', 'O'];
	   for (var i=0, j=prefixes.length; i < j; i++) {
		   if (typeof document.body.style[prefixes[i]+property] !== 'undefined') {
			   return prefixes[i]+property;
		   }
	   }    
	   return false;    
	},
	
	/**
	M�todo para mover el objeto a una determinada posici�n. Usa CSS3, funci�n translate,
	si no est� soportada usa como alternativa CSS2.1
	
	@method setPosicion
	@param {Number} x
		Coordenada x.
	@param {Number} y
		Coordenada y.
	**/
	setPosicion: function (x,y) {
		var transformSupport =  this.detectPropertyPrefix('Transform');
		if (transformSupport === false) {
		   this.vista.css('top', y + "px");
		   this.vista.css('left',  x + "px");
		} else {
		   this.vista[0].style[transformSupport] = 'translate(' + x + 'px, ' + y + 'px)';
		}
		
		this.x = x;
		this.y = y;
	},
	
	/**
	M�todo (abstracto) que debe ser implementado por las clases que Stage, Sprite o Movieclip
	
	@method render
	**/
	render: function() {
	}

});