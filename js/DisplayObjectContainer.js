/**
Objeto Contenedor de DisplayObjects
Permite utilizar un DisplayObject como contenedor de otros DisplayObjects

@class DisplayObjectContainer
@constructor
@extends DisplayObject 
**/
var DisplayObjectContainer = DisplayObject.extend({
	/**
	Función constructora para la librería Class
	
	@method init
	@param {String} id
		Identificador del elemento.
	@param {String} tipo
		Tipo de etiqueta "div o "canvas" a ser utilizada.
	**/
	init: function(id, tipo) {
		this._super(id, tipo);
		

		/**
		* Número de elementos contenidos
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
	Añade una instancia secundaria de DisplayObject a esta instancia de DisplayObjectContainer
	
	@method addChild
	@param {DisplayObject} dis_obj
		Objecto DisplayObject que va a ser contenido
	@return {Number} 
		Índice del objeto dentro del vector
	**/
	addChild: function(dis_obj) {
		this.vista.append(dis_obj.vista);
		this.children.push(dis_obj);
		
		return this.numChildren++;
	}
	
});