$(document).ready(function(){
  
});

// GROUP MODEL
var Group = function(el){
  this.closed = true;
  this.el = el;
}
Group.prototype = {
  open: function(){
    this.el.children('ul').height = initial;
    this.closed = false;
  },
  close: function(){
    this.el.children('ul').height = 0;
    this.closed = true;
  },
  toggle: function(){
    if(this.closed){
      this.open();
    }else{
      this.close();
    }
  }
}