var App = {};
var Selectors = {
  group: ".group",
  title: ".group > h2",
  content: ".group > ul"
}
$(document).ready(function(){
  App.controller = new Controller(Selectors);
});

// GROUP MODEL
var Group = function(el){
  this.el = el;
  this.init();
  this.closeContent();
}
Group.prototype = {
  init: function(){
    this.content = $(this.el).children('ul');
    this.title = $(this.el).children('h2');
    this.contentHeight = this.content.outerHeight();
    this.bindClickToOpen(); 
  },
  openContent: function(){
    this.content.height(this.contentHeight);
    this.closed = false;
  },
  closeContent: function(){
    this.content.height("0");
    this.closed = true;
  },
  toggle: function(){
    if(this.closed){
      this.openContent();
    }else{
      this.closeContent();
    }
  },
  bindClickToOpen: function(){
    var toggle = this.toggle;
    this.title.on('click', function(e){
      this.toggle();
    }.bind(this));
  }
}


// CONTROLLER
var Controller = function(selectors){
  this.selectors = selectors;
  this.init();
}
Controller.prototype = {
  init: function(){
    var groups = [];
    $(this.selectors.group).each(function(group){
      groups.push(new Group(this));
    })
    this.groups = groups;
  }
}