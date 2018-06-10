/**
Objeto Contenedor de DisplayObjects
Permite utilizar un DisplayObject como contenedor de otros DisplayObjects

@class DisplayObjectContainer
@constructor
@extends DisplayObject 
**/
var DisplayObjectContainer = DisplayObject.extend({
	/**
	Funci�n constructora para la librer�a Class
	
	@method init
	@param {String} id
		Identificador del elemento.
	@param {String} tipo
		Tipo de etiqueta "div o "canvas" a ser utilizada.
	**/
	init: function(id, tipo) {
		this._super(id, tipo);
		

		/**
		* N�mero de elementos contenidos
		*
		* @attribute numChildren
		* @readOnly
		* @default 0
		* @type Number
		*/
		this.numChildren = 0;
		
		/**
		* Vector de elementos contenidos
		*
		* @attribute children
		* @default []
		* @type Array
		*/
		this.children = [];
	},
	
	/**
	A�ade una instancia secundaria de DisplayObject a esta instancia de DisplayObjectContainer
	
	@method addChild
	@param {DisplayObject} dis_obj
		Objecto DisplayObject que va a ser contenido
	@return {Number} 
		�ndice del objeto dentro del vector
	**/
	addChild: function(dis_obj) {
		this.vista.append(dis_obj.vista);
		this.children.push(dis_obj);
		
		return this.numChildren++;
	}
	
});