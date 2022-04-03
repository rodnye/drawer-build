# Muestra
- Mira la librería en acción [aquí](https://2ao6d1.mimo.run/index.html) !!
- El código del ejemplo está [aquí](https://github.com/RodnyE/drawer-build/blob/main/work/index.html)

# Instrucciones para la librería DrawerBuild

## ¿Qué es DrawerBuild?
DrawerBuild es una útil librería para crear drawers desplegables de manera sencilla para su web.

## ¿Cómo insertar DrawerBuild?
Es muy fácil de insertar en un proyecto html, simplemente agréguela con la etiqueta ```<script>``` y el atributo con la url de donde está ubicado el archivo:
```
<script src="/carpeta/drawerbuild.min.js"></script>
```
## Uso
En el html cree una etiqueta `div` con los elementos dentro quiera para su drawer, y pongale una id `drawer`:
```
<div id="drawer"></div>
```

Para transformar este div en un menú desplegable, en su script llame a la clase Drawer y pongale como parámetro la id del `div`:
```
const dw = new Drawer("drawer");
```

Con esto ya ha logrado convertir el div.

## Abrir y cerrar drawer
Para abrir el drawer se utilizan los métodos `open()` y `close()`:
```
//se abre el drawer
dw.open()

//se cierra el drawer
dw.close()
```

Ejemplo simple de su uso:
```
<button onclick="dw.open()"> Menu </button>
```

# Métodos de DrawerBuild
## Clase
```
new Drawer(id, options)
```
- `id`: {String} (requerido) la id del elemento `div` que se va a transformar
- `options`: {Object} (opcional) configuraciones para el drawer

## Opciones
```
{
  position: "left",  //posición del drawer (left, right, top, bottom)
  
  size: 300,  //tamaño del drawer respecto a su dirección

  duration: 200, //duracion de aparición

  exitDuration: 200, //duracion de desaparición

  background: "white", //color del drawer

  opacity: 0.6, //opacidad de la sombra

  draggable: true, //habilitar deslizado tactil

  animation: "linear", //animación de entrada
}
```

## Animaciones disponibles
- linear
- elastic
- elasticIn
- elasticOut
- bounce
- bounceIn
- bounceOut
- slip
- smooth
- smoothX2
- smoothX3
- power
- powerX2
- powerX3
- arc
- arcIn
- arcOut

## Métodos

- `dom` => DOMElement del `div` contenedor.
- `open()` => abrir drawer
- `close()` => cerrar drawer
- `lock()` => deshabilitar deslizamiento
- `unlock()` => habilitar deslizamiento
- `setDuration( <miliseconds> )` => insertar velocidad de aparición del drawer
- `setExitDuration( <miliseconds> )` => insertar velocidad de desaparición del drawer
- `setBackground( <color> )` => cambiar el color del drawer, puede ser color sólido o hexadecimal
- `setShadowBackground( <color> )` => cambiar el color de la sombra del fondo, puede ser color sólido o hexadecimal
- `setOpacity( <fraction 0 to 1> )` => nivel de opacidad de la sombra, debe ser un número del 0 al 1
- `enableShadowEvent( <boolean> )` => habilitar o deshabilitar el evento de la sombra del drawer


## Eventos

```
dw.on( <event>, <callback>)
```
#### _event_
  - `"open"`: se desencadena al abrir el drawer
  - `"close"`: se desencadena al cerrar el drawer
  - `"click"`: se desencadena al hacer click en los elementos dentro del drawer
