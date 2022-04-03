/*

 *
 */

class Drawer {
  constructor(id, cfg) {
    cfg = cfg?cfg: {};
    this.id = id;
    var drawer = document.getElementById(id),
    shadow = document.createElement("div"),
    body = document.getElementsByTagName("body")[0],
    This = this;
    /* @param options => {
         position: left, top, right, bottom
         duration: 0
         draggable: true
         background: color
         size: 0
         enableEventBg: true
         opacity
         animation: 
           linear
           elastic, elasticIn, elasticOut
           bounce, bounceIn, bounceOut
           slip
           smooth, smoothX2, smoothX3
           power, powerX2, powerX3
           arc, arcIn, arcOut
       }
    */
    cfg.position = or(typeof cfg.position == "string"? /^(left|right|top|bottom)$/.test(cfg.position.toLowerCase())? cfg.position:undefined:undefined, "left").toLowerCase();
    cfg.duration = or(cfg.duration, 200);
    cfg.exitDuration = or(cfg.exitDuration, cfg.duration);
    cfg.size = or(cfg.size, screen.width*0.7);
    cfg.background = or(cfg.background, "#ffffff");
    cfg.opacity = or(cfg.opacity, 0.6);
    cfg.draggable = or(cfg.draggable, true);
    cfg.enableEventBg = or(cfg.enableEventBg, true);
    cfg.animation = or(cfg.animation, "arc");

    var 
      //propiedades
      eje_mov, //eje desplazable
      eje_est, //eje inmovil
      v_mov, //valor del eje movil
      v_est; //valor del eje inmovil

    eje_mov = cfg.position;
    v_mov = cfg.size;

    if (eje_mov == "left" || eje_mov == "right") {
      eje_est = "top";
      v_est = screen.height;
    }
    if (eje_mov == "top" || eje_mov == "bottom") {
      eje_est = "left";
      v_est = screen.width;
    }


    //estilos
    shadow.setAttribute("style",
      "margin: 0; padding: 0;" +
      "background-color: rgba(0,0,0,1);" +
      "width: "+screen.width+"px;" +
      "height: "+screen.height+"px;" +
      "filter: opacity(0);"+
      "position: fixed;" +
      "top: 0; left: 0;"
    );
    drawer.setAttribute("style",
      "margin: 0; padding: 0;" +
      "background-color: "+cfg.background+";"+
      "position: fixed;"+
      "height:"+ (eje_est == "top"?screen.height: v_mov)+"px;" +
      "width: "+ (eje_est == "left"?screen.width: v_mov)+"px;" +
      eje_mov + ":-" + v_mov+"px;" +
      eje_est + ":0;"
    );

    //evento
    if (cfg.enableEventBg) shadow.onclick = function() {
      if (This.cfg.enableEventBg && !This.isMove) This.close();
    };

    //añadir menu
    shadow.style.display = "none";
    if (drawer.parentNode) drawer.parentNode.removeChild(drawer);
    body.appendChild(shadow);
    body.appendChild(drawer);

    this.defaultEvents();
    this.shadow = shadow;
    this.drawer = drawer;
    this.cfg = cfg;
    this.isOpen = false;
    this.isMove = false;
    this.position = -cfg.size;
    
    //arrastrar
    if(cfg.draggable) {
      let vlayer = 0;
      let H = eje_est=="top";
      let R = eje_mov=="right"||eje_mov=="bottom";
      let _screen = screen[H?"width":"height"];
      
      drawer.ontouchstart = function(e){
        if(This.cfg.draggable) drawer.drag = true;
        e = e.changedTouches[0][H?"screenX":"screenY"]
        vlayer = (!R? e : _screen-e) - This.position;
      }
      drawer.ontouchmove = function(e){
        if(drawer.drag) {
        e = e.changedTouches[0];
        var vpos = This.position;
        var vpage = e[H?"screenX":"screenY"];
   
        if(R) vpage = _screen - vpage;
        vpos = vpage - vlayer;
        
        if(vpos<=0) {
          This.position = vpos;
          drawer.style[eje_mov] = vpos+"px";
        }
        }
      }
      drawer.ontouchend = function(e){
        drawer.drag = false;
        vlayer = 0;
        let apos = This.position;
        
        if(-This.position < This.cfg.size/2) {
          This.eventHandler.open();
          Drawer.utils.animate(function(porc){
            This.position = apos * (1 - porc);
            This.drawer.style[eje_mov] = This.position + "px"
          }, 200).start();
        }
        else {
          This.isMove = true;
          Drawer.utils.animate(function(porc){
            This.position = -(v_mov * porc + -apos);
            This.drawer.style[eje_mov] = This.position + "px";
            This.shadow.style.filter = "opacity("+ This.cfg.opacity * (1-porc) +")";
          }, 200)
          .finish(function(){
            This.isOpen = false;
            This.isMove = false;
            This.shadow.style.display = "none";
          })
          .start();
          This.eventHandler.close();
        }
      }
    }
    
    
    //tipo de animacion
    this.animation =
      //linear
      cfg.animation === "linear"? undefined:
      //elastico (en desarrollo)
      cfg.animation === "elasticIn"? function(n) {return Math.pow(2, 10 * (n - 1)) * Math.cos(20 * Math.PI * This.position / 3 * n)}:
      cfg.animation === "elasticOut"? invertirA(function(n){return Math.pow(2, 10 * (n - 1)) * Math.cos(20 * Math.PI * This.position / 3 * n)}) :
      //rebote
      cfg.animation === "bounceIn"? function(n) {
      for (let a = 0, b = 1; 1; a += b, b /= 2)
        if (n >= (7 - 4 * a) / 11)
        return -Math.pow((11 - 6 * a - 11 * n) / 4, 2) + Math.pow(b, 2)
    }:
      cfg.animation === "bounceOut" || cfg.animation === "bounce"? invertirA(function(n) {
      for (let a = 0, b = 1; 1; a += b, b /= 2)
        if (n >= (7 - 4 * a) / 11)
        return -Math.pow((11 - 6 * a - 11 * n) / 4, 2) + Math.pow(b, 2)
    }):
      //patinar
      cfg.animation === "slip"? invertirA(function(n) {return Math.pow(n, 0.5)}):
      //suavizado
      cfg.animation === "smooth"? invertirA(function(n) {return Math.pow(n, 2)}):
      cfg.animation === "power"? function(n) {return Math.pow(n, 2)}:
      cfg.animation === "smoothX2"? invertirA(function(n) {return Math.pow(n, 4)}):
      cfg.animation === "powerX2"? function(n) {return Math.pow(n, 4)}:
      cfg.animation === "smoothX3"? invertirA(function(n) {return Math.pow(n, 8)}):
      cfg.animation === "powerX3"? function(n) {return Math.pow(n, 8)}:
      //arco
      cfg.animation === "arcIn" || cfg.animation === "arc"? function(n) {
      return 1 - Math.sin(Math.acos(n))}:
      cfg.animation === "arcOut"? invertirA(function(n) {
      return 1 - Math.sin(Math.acos(n))}):
      //estandar
      invertirA(function(n) {return 1 - Math.sin(Math.acos(n))});
    
    
    function or(n, v) {
      return n !== undefined?n: v
    };
    function invertirA(fn) {return function(n) {return 1 - fn(1 - n)}};

    //limpiar memoria
    or = null;
    invertirA = null;
    shadow = null;
    body = null;
    cfg = null;
    
  }

   ////////////////////////
  //***** ACCIONES *****//
 ////////////////////////
  open() {
      var
      This = this,
      cfg = this.cfg,
      drawer = this.drawer,
      shadow = this.shadow;

      shadow.style.display = "block";
      this.isMove = true;
      var animation = Drawer.utils.animate(function(porc) {
        This.position = - cfg.size * (1 - porc);
        drawer.style[cfg.position] = This.position + "px";
        shadow.style.filter = "opacity("+ (cfg.opacity*porc) +")";
      }, cfg.duration, this.animation);
      animation.start()
      animation.finish(function() {
        This.isOpen = true;
        This.isMove = false;
        
        //limpiar memoria
        drawer = null;
        shadow = null;
        cfg = null;
        This = null;
      });
      
      animation = null;
      this.eventHandler.open();
  }
  
  close() {
    var
    This = this,
    cfg = this.cfg,
    drawer = this.drawer,
    shadow = this.shadow;

    this.isMove = true;
    var animation = Drawer.utils.animate(function(porc) {
      This.position = - cfg.size * porc;
      drawer.style[cfg.position] = This.position + "px";
      shadow.style.filter = "opacity("+ cfg.opacity*(1-porc)+")";
    }, cfg.exitDuration);
    animation.start()
    animation.finish(function() {
      This.isOpen = false;
      This.isMove = false;
      shadow.style.display = "none";
      
      //limpiar memoria
      This = null;
      shadow = null;
      drawer = null;
      cfg = null;
    });
    
    animation = null;
    this.eventHandler.close();
  }
  
   ////////////////////////
  //***** Estilos *****///
 ////////////////////////
 setBackground(color){this.drawer.style.backgroundColor = color}
 setDuration(time){this.cfg.duration = time}
 setExitDuration(time){this.cfg.exitDuration = time};
 
 setOpacity(porc){
   this.cfg.opacity = porc;
   if(this.isOpen) this.shadow.style.filter = "opacity("+porc+")";
 }
 setShadowBackground(color){this.shadow.style.backgroundColor = color}
 enableShadowEvent(boo){this.cfg.enableEventBg = boo}
  
   ////////////////////////
  //***** EVENTOS *****///
 ////////////////////////
  on(event, callback) {
    this.eventHandler[event] = callback;
    switch(event){
      case "click": this.drawer.onclick = callback; break;
    }
  }
 lock(){this.cfg.draggable = false}
 unlock(){this.cfg.draggable = true}
  
  defaultEvents() {
    this.eventHandler = {};
    this.eventHandler.open = function() {};
    this.eventHandler.close = function() {};
    this.eventHandler.click = function() {};
  }
}

Drawer.utils = {};
Drawer.utils.animate = function(draw, duration, timing) {

  var start,
  running = true,
  finish = function() {};
  if (!timing) timing = function(n) {
    return n
  };

  function animate(time) {
    // timeFraction va de 0 a 1
    var timeFraction = (time - start) / duration;
    if (timeFraction > 1) timeFraction = 1;

    // calcular el estado actual de la animación
    var progress = timing(timeFraction)

    draw(progress); // dibujar

    if (timeFraction < 1 && running) window.requestAnimationFrame(animate);
    else finish();
  }

  return {
    start: function() {
      running = true;
      start = performance.now();
      window.requestAnimationFrame(animate);
      return this;
    },
    stop: function() {
      running = false;
      return this;
    },
    finish: function(fn) {
      finish = fn;
      return this;
    },
  }
}