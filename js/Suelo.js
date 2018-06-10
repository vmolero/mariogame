/**
Objeto Suelo
Sprite para representar objetos colisionables que se renderizan mediante una imagen de fondo estática.

@class Suelo
@constructor
@extends Sprite
**/
var Suelo = Sprite.extend({
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
		
	},
	
	/**
	Al posicionarse en la escena se añade el vector de obstáculos de ésta
	
	@method setPosicion
	@param {Number} x
		Coordenada x.
	@param {Number} y
		Coordenada y.
	@overrides DisplayObject.setPosicion
	**/
	setPosicion: function(x,y) {
		this._super(x,y);
		try {
			this.escena.obstaculos.push(this);
		} catch(e) {
			console.log(e);
		}
	}
	
});