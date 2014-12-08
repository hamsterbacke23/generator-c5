//////////////////////////////////////////////
// Can this be included in a different way? //
//////////////////////////////////////////////
/*!
* mustache.js - Logic-less {{mustache}} templates with JavaScript
* http://github.com/janl/mustache.js
*/
var Mustache;(function(a){"undefined"!=typeof module&&module.exports?module.exports=a:"function"==typeof define?define(a):Mustache=a})(function(){function h(a,b){return RegExp.prototype.test.call(a,b)}function i(a){return!h(d,a)}function k(a){return a.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&")}function m(a){return(a+"").replace(/[&<>"'\/]/g,function(a){return l[a]})}function n(a){this.string=a,this.tail=a,this.pos=0}function o(a,b){this.view=a,this.parent=b,this.clearCache()}function p(){this.clearCache()}function q(a){for(var d,b=a[3],c=b;(d=a[4])&&d.length;)a=d[d.length-1],c=a[3];return[b,c]}function r(a){function c(a,c,d){if(!b[a]){var e=r(c);b[a]=function(a,b){return e(a,b,d)}}return b[a]}var b={};return function(b,d,e){for(var g,h,f="",i=0,j=a.length;j>i;++i)switch(g=a[i],g[0]){case"#":h=e.slice.apply(e,q(g)),f+=b._section(g[1],d,h,c(i,g[4],e));break;case"^":f+=b._inverted(g[1],d,c(i,g[4],e));break;case">":f+=b._partial(g[1],d);break;case"&":f+=b._name(g[1],d);break;case"name":f+=b._escaped(g[1],d);break;case"text":f+=g[1]}return f}}function s(a){for(var e,f,b=[],c=b,d=[],g=0;a.length>g;++g)switch(e=a[g],e[0]){case"#":case"^":e[4]=[],d.push(e),c.push(e),c=e[4];break;case"/":if(0===d.length)throw Error("Unopened section: "+e[1]);if(f=d.pop(),f[1]!==e[1])throw Error("Unclosed section: "+f[1]);c=d.length>0?d[d.length-1][4]:b;break;default:c.push(e)}if(f=d.pop())throw Error("Unclosed section: "+f[1]);return b}function t(a){for(var b,c,d=[],e=0;a.length>e;++e)b=a[e],c&&"text"===c[0]&&"text"===b[0]?(c[1]+=b[1],c[3]=b[3]):(c=b,d.push(b));return d}function u(a){if(2!==a.length)throw Error("Invalid tags: "+a.join(" "));return[RegExp(k(a[0])+"\\s*"),RegExp("\\s*"+k(a[1]))]}var a={};a.name="mustache.js",a.version="0.7.1",a.tags=["{{","}}"],a.Scanner=n,a.Context=o,a.Writer=p;var b=/\s*/,c=/\s+/,d=/\S/,e=/\s*=/,f=/\s*\}/,g=/#|\^|\/|>|\{|&|=|!/,j=Array.isArray||function(a){return"[object Array]"===Object.prototype.toString.call(a)},l={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","/":"&#x2F;"};a.escape=m,n.prototype.eos=function(){return""===this.tail},n.prototype.scan=function(a){var b=this.tail.match(a);return b&&0===b.index?(this.tail=this.tail.substring(b[0].length),this.pos+=b[0].length,b[0]):""},n.prototype.scanUntil=function(a){var b,c=this.tail.search(a);switch(c){case-1:b=this.tail,this.pos+=this.tail.length,this.tail="";break;case 0:b="";break;default:b=this.tail.substring(0,c),this.tail=this.tail.substring(c),this.pos+=c}return b},o.make=function(a){return a instanceof o?a:new o(a)},o.prototype.clearCache=function(){this._cache={}},o.prototype.push=function(a){return new o(a,this)},o.prototype.lookup=function(a){var b=this._cache[a];if(!b){if("."===a)b=this.view;else for(var c=this;c;){if(a.indexOf(".")>0){var d=a.split("."),e=0;for(b=c.view;b&&d.length>e;)b=b[d[e++]]}else b=c.view[a];if(null!=b)break;c=c.parent}this._cache[a]=b}return"function"==typeof b&&(b=b.call(this.view)),b},p.prototype.clearCache=function(){this._cache={},this._partialCache={}},p.prototype.compile=function(b,c){var d=this._cache[b];if(!d){var e=a.parse(b,c);d=this._cache[b]=this.compileTokens(e,b)}return d},p.prototype.compilePartial=function(a,b,c){var d=this.compile(b,c);return this._partialCache[a]=d,d},p.prototype.compileTokens=function(a,b){var c=r(a),d=this;return function(a,e){if(e)if("function"==typeof e)d._loadPartial=e;else for(var f in e)d.compilePartial(f,e[f]);return c(d,o.make(a),b)}},p.prototype.render=function(a,b,c){return this.compile(a)(b,c)},p.prototype._section=function(a,b,c,d){var e=b.lookup(a);switch(typeof e){case"object":if(j(e)){for(var f="",g=0,h=e.length;h>g;++g)f+=d(this,b.push(e[g]));return f}return e?d(this,b.push(e)):"";case"function":var i=this,k=function(a){return i.render(a,b)},l=e.call(b.view,c,k);return null!=l?l:"";default:if(e)return d(this,b)}return""},p.prototype._inverted=function(a,b,c){var d=b.lookup(a);return!d||j(d)&&0===d.length?c(this,b):""},p.prototype._partial=function(a,b){a in this._partialCache||!this._loadPartial||this.compilePartial(a,this._loadPartial(a));var c=this._partialCache[a];return c?c(b):""},p.prototype._name=function(a,b){var c=b.lookup(a);return"function"==typeof c&&(c=c.call(b.view)),null==c?"":c+""},p.prototype._escaped=function(b,c){return a.escape(this._name(b,c))},a.parse=function(d,h){function r(){if(p&&!q)for(;o.length;)m.splice(o.pop(),1);else o=[];p=!1,q=!1}d=d||"",h=h||a.tags;for(var v,w,x,y,j=u(h),l=new n(d),m=[],o=[],p=!1,q=!1;!l.eos();){if(v=l.pos,x=l.scanUntil(j[0]))for(var z=0,A=x.length;A>z;++z)y=x.charAt(z),i(y)?o.push(m.length):q=!0,m.push(["text",y,v,v+1]),v+=1,"\n"===y&&r();if(v=l.pos,!l.scan(j[0]))break;if(p=!0,w=l.scan(g)||"name",l.scan(b),"="===w)x=l.scanUntil(e),l.scan(e),l.scanUntil(j[1]);else if("{"===w){var B=RegExp("\\s*"+k("}"+h[1]));x=l.scanUntil(B),l.scan(f),l.scanUntil(j[1]),w="&"}else x=l.scanUntil(j[1]);if(!l.scan(j[1]))throw Error("Unclosed tag at "+l.pos);m.push([w,x,v,l.pos]),("name"===w||"{"===w||"&"===w)&&(q=!0),"="===w&&(h=x.split(c),j=u(h))}return m=t(m),s(m)};var v=new p;return a.clearCache=function(){return v.clearCache()},a.compile=function(a,b){return v.compile(a,b)},a.compilePartial=function(a,b,c){return v.compilePartial(a,b,c)},a.compileTokens=function(a,b){return v.compileTokens(a,b)},a.render=function(a,b,c){return v.render(a,b,c)},a.to_html=function(b,c,d,e){var f=a.render(b,c,d);return"function"!=typeof e?f:(e(f),void 0)},a}());

$(function() {

  //////////
  // vars //
  //////////
  var $blockForm               = $('#ccm-block-fields');
  var $omcontents              = $blockForm.find('.omcontents');
  var rowContainerSelector     = '.collection-group';
  var removeHandleSelector     = '.remove_handle';
  var titleInputSelector       = '.heading';
  var mtpl                     = getMustacheTemplate('rowtpl');
  var newRowTitle              = 'Neue Slide';

  ///////////////
  // functions //
  ///////////////
  function updateTitleBar($el) {
    var $container = $el.closest(rowContainerSelector);
    var text1 = $container.find(titleInputSelector).val();
    if(text1 != '') {
      $el.closest(rowContainerSelector).find('.handle').text(text1);
    }
    text1 = '';
  };

  function getMustacheTemplate(type) {
    var html = $('.' + type).html().replace('<!--', '').replace('-->',''); // get html and uncomment
    var tpl = Mustache.compile(html)
    return tpl;
  }

  function updateRemoveHandles() {
    if($blockForm.find(removeHandleSelector).length > 1) {
      $blockForm.find(removeHandleSelector).show();
    } else {
      $blockForm.find(removeHandleSelector).hide();
    }
  }


  if(typeof Mustache == 'undefined') {
    console.log('Mustache is undefined!');
  }

  function addRow() {
    var index = $(rowContainerSelector).length;
    var output = mtpl({heading: newRowTitle, index: index});
    $omcontents.append(output);
    <% if(tiny){ %>
    var tinyConfig = <%=blockcchandle.toUpperCase() + '_TINYCONFIG'%>; //see elements/editor_config.php
    tinyConfig.editor_selector = 'ccm-advanced-editor' + index;
    tinyMCE.init(tinyConfig);
    <% }//endif %>

    updateRemoveHandles();
  }



  //////////////////////////
  //  add and remove rows //
  //////////////////////////
  $blockForm.find('.addrow').on('click', function(e){
    e.preventDefault();
    e.stopPropagation();
    addRow();
    return false;
  })

  $blockForm.on('click', '.handle', function(e){
     e.preventDefault();
    $(this).next('.panel').slideToggle();
  });

  $blockForm.on('click', '.remove_handle', function(e){
    e.preventDefault();
    var $ctn;
    if($(rowContainerSelector).length > 1) {
      $ctn = $(this).closest(rowContainerSelector).hide();
      $ctn.find('input.deleterowinput').val('yes');
    }
    updateRemoveHandles();
  });


  //////////
  // init //
  //////////
  function init() {
    updateRemoveHandles();
    if($(rowContainerSelector).length == 0){
      addRow();
    }
  }
  init();


  //////////////
  // Sortable //
  //////////////
  $('.sortable-links').sortable({
    items : rowContainerSelector,
    handle: '.sort_handle',
    // helper: 'clone', // clone on sort makes troubles with radiobuttons in row
    axis: 'y'
    <% if(tiny){ %>
    ,start: function(event,ui){
      var nid = $(ui.item[0]).find('.advancedEditor').attr('id');
      tinyMCE.execCommand('mceRemoveControl', false, nid);
    }
    ,stop: function(event,ui){
      var nid = $(ui.item[0]).find('.advancedEditor').attr('id');
      tinyMCE.execCommand('mceAddControl', false, nid);
    }
    <% }//endif %>
  });

    //update newRowTitle
  $blockForm.on('focusout', titleInputSelector, function() {
    updateTitleBar($(this));
  });

  /////////////////////////
  // Radio Button Panels //
  /////////////////////////
  //var $radioButtons = $('input[type="radio"]');
  // $('#ccm-tab-content-media .radio-group, #ccm-tab-content-link .radio-group').hide();
  // $radioButtons.each(function(){
  //   if($(this).attr('checked')) {
  //     $(this).parent().next('.radio-group').show();
  //   }
  // });

  // $radioButtons.click(function(){
  //   $section = $(this).closest('section');
  //   $section.find('.radio-group').hide();
  //   $(this).parent().next('.radio-group').show();
  // });

});

