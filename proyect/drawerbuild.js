/*

 * Drawerbuild Library v0.1
 * 14/1/2022

 */
 
class Drawer {
   constructor(_id, _dir="left", _size=200){
      _dir = _dir.toLowerCase();
      this.id = _id;
      this.time = 0.5;
      var this_ = this;
      
      
      //ejes
      var //propiedad
          jx, //<= desplazable
          jy, //<= estática
          //tamaño
          wx,
          wy;
          
      var type = "x";
      var size = _size+20;
      
      //asignar ejes del drawer
      if(_dir=="left"||_dir=="right"){
         //drawer x
         jx=_dir;
         jy="top";
         
         wx=size+"px";
         wy="100vh";
      } else if(_dir=="top"||_dir=="bottom"){
         //drawer y
         type="y";
         jx=_dir;
         jy="left";
         
         wx="100%";
         wy=size+"px";
      } else {
         //default
         jx="left";
         jy="top";
         
         wx=size+"px";
         wy="100vh";
      }
      
      //elementos del document
      var doc = document.getElementsByTagName("body")[0];
      var head = document.getElementsByTagName("head")[0];
      
      //obtener div
      var drawer = document.getElementById(_id);
      
      //si el div no existe
      if(drawer == null) return console.error(new Error("The DOM element '"+_id+"' not found in the document"));
      
      //crear fondo
      var shadow = document.createElement("div");
      
      
      /***asignar estilos***/
      //drawer
      drawer.setAttribute("style", 
         "position:fixed;"+
         jx+":"+-size+"px;"+
         jy+":0;"+
         
         "width:"+wx+";"+
         "height:"+wy+";"+
         
         (type=="x"?
         "overflow-y:auto;"+
         "overflow-x:hidden;"+
         "display:flex;"+
         "flex-direction:column;" :"") +
         
         "background:#ffffff;"
      );
      //body
      doc.style.margin = "0";
      //fondo
      shadow.setAttribute("style", 
         "position:fixed;"+
         "top:0;left:0;"+
         "width:100vw;"+
         "height:100vh;"+
         "background-color:rgba(0,0,0,0.5);"+
         "display:none;"
      );
      
      //animaciones
      var css = document.createElement("style");
      css.setAttribute("type","text/css");
      css.appendChild(document.createTextNode(
        "@-webkit-keyframes d-"+_id+"-open-drawer {"+
           "from {"+
              jx+":"+-size+"px;"+
           "}"+
           "to {"+
              jx+":0;"+
           "}"+
        "}"
       ));
      css.appendChild(document.createTextNode(
        "@-webkit-keyframes d-"+_id+"-close-drawer {"+
           "from {"+
              jx+":0;"+
           "}"+
           "to {"+
              jx+":"+-size+"px;"+
           "}"+
        "}"
       ));
       
      css.appendChild(
          document.createTextNode("@-webkit-keyframes d-open-shadow{from{background-color:rgba(0,0,0,0)} to{background-color:rgba(0,0,0,0.5)} }")
      );
      css.appendChild(
          document.createTextNode("@-webkit-keyframes d-close-shadow{from{background-color:rgba(0,0,0,0.5)} to{background-color:rgba(0,0,0,0)} }")
      );
      
      //eventos
      drawer.onscroll = function(e){
          this_.e__scroll(e);
      }
      
      //añadir al documento correctamente
      if(drawer.parentNode) drawer.parentNode.removeChild(drawer);
      doc.appendChild(shadow);
      doc.appendChild(drawer);
      head.appendChild(css);
      
      //globalizar
      this.__shadow = shadow;
      this.__drawer = drawer;
      this.dom = drawer;
   }
   
   
   
    ////////////////////////
   //***** ACCIONES *****//
  ////////////////////////
   open(){
      var drawer = this.__drawer;
      var shadow = this.__shadow;
      var this_ = this;
      
      this.e__open();
      shadow.onclick = function(){};
      shadow.style.display = "block";
      shadow.style.webkitAnimation = "d-open-shadow "+this.time+"s both";
      drawer.style.webkitAnimation = "d-"+this.id+"-open-drawer "+this.time+"s both";
      //finalizar animaciones
      window.setTimeout(function(){
         shadow.onclick = function(){
            this_.close();
         }
      }, this.time*1000);
   }
   
   close(){
      var drawer = this.__drawer;
      var shadow = this.__shadow;
      var this_ = this;
      
      this.e__close();
      shadow.onclick = function(){};
      shadow.style.webkitAnimation = "d-close-shadow "+this.time+"s both";
      drawer.style.webkitAnimation = "d-"+this.id+"-close-drawer "+this.time+"s both";
      //finalizar animaciones
      window.setTimeout(function(){
         shadow.style.display = "none";
         shadow.onclick = function(){
            this_.open();
         }
      }, this.time*1000);
   }
   
   //asignar eventos
   on(event, action){
      this["e__"+event] = action;
   }
   
   //insertar duración
   setDuration(n){
       this.time = n/1000;
   }
   //insertar fondo
   setBackground(n){
       this.__drawer.style.background = n;
   }
   //añadir hijo
   addChild(n){
       this.__drawer.appendChild(n);
   }
   
   //eventos default
   e__open(){}
   e__close(){}
   e__scroll(){}
}
