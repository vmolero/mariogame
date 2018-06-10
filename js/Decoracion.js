/**
Objeto Decoracion
Sprite para representar objetos no colisionables que se renderizan mediante una imagen de fondo estática.

@class Decoracion
@constructor
@extends Sprite
**/
var Decoracion = Sprite.extend({
	/**
	Función constructora para la librería Class
	
	@method init
	@param {String} id
		Identificador del elemento.
	@param {String} tipo
		Tipo de etiqueta "div o "canvas" a ser utilizada.
	@param {String} escena
		Escena donde se ha creado el objeto.
	**/
	init: function(id, tipo, escena) {
		this._super(id, tipo, escena);
	}
});