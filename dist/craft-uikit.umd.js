!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.Craft=e():t.Craft=e()}(window,function(){return function(t){var e={};function i(n){if(e[n])return e[n].exports;var o=e[n]={i:n,l:!1,exports:{}};return t[n].call(o.exports,o,o.exports,i),o.l=!0,o.exports}return i.m=t,i.c=e,i.d=function(t,e,n){i.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},i.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i.t=function(t,e){if(1&e&&(t=i(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)i.d(n,o,function(e){return t[e]}.bind(null,o));return n},i.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return i.d(e,"a",e),e},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},i.p="",i(i.s=0)}([function(t,e,i){"use strict";const n=i(1);t.exports=n.default||n},function(t,e,i){"use strict";i.r(e);var n={packagename:"Craft.Core.Defaults",BASE_DIV_NAME:"CraftRoot",ALLOW_COMPONENT_SHORTCUT:!1},o={packagename:"Craft.Core.Context",rootViewController:"",app:"",setApp:function(t){this.app=t},getApp:function(){return this.app},setRootElement:function(t){this.rootElement=t},getRootElement:function(){return this.rootElement},setRootViewController:function(t){this.rootViewController=t,this.rootElement||(this.rootElement=document.getElementById(n.BASE_DIV_NAME)),t.viewWillAppear(),t.isViewLoaded||t.loadView(),this.rootElement.appendChild(t.view),t.viewDidAppear(),window.addEventListener("popstate",e=>{t.didReceivePopstate(e)})},getRootViewController:function(){return this.rootViewController}},s={packagename:"Craft.Core.Bootstrap",boot:function(t){if(!t)throw"no app";o.setApp(t);let e=window.location.hash.match(/^#\/(.*)/),i="";e&&(i=e[1]),o.getApp().didBootApplication({entryPoint:i})}},a={packagename:"Craft.Core.ComponentStack",counter:0,container:{},push:function(t){this.container[t.componentId]=t},set:function(t,e){this.container[t]=e,n.ALLOW_COMPONENT_SHORTCUT&&(window[t]=e)},get:function(t){return this.container[t]},del:function(t){delete this.container[t],n.ALLOW_COMPONENT_SHORTCUT&&delete window[t]},nextSerial:function(){return this.counter++}},r={packagename:"Craft.Core.KeyboardManager",keyboard_actions:{},handler:function(t){Craft.Core.KeyboardManager.action(t.keyCode)},activate:function(){window.addEventListener("keyup",this.handler)},deactivate:function(){window.removeEventListener("keyup",this.handler)},register:function(t,e,i){t&&e&&i&&(this.keyboard_actions[e]||(this.keyboard_actions[e]={}),this.keyboard_actions[e][t]=i)},remove:function(t){if(t)for(var e=Object.keys(this.keyboard_actions),i=0;i<e.length;i++)delete this.keyboard_actions[e[i]][t]},action:function(t){if(this.keyboard_actions[t])for(var e=Object.keys(this.keyboard_actions[t]),i=0;i<e.length;i++){(0,this.keyboard_actions[t][e[i]])()}},clear:function(){this.keyboard_actions={};let t=Object.keys(this.keyboard_actions);for(let e=0;e<t.length;e++){let i=t[e];if(!this.keyboard_actions[i])continue;let n=Object.keys(this.keyboard_actions[i]);for(let t=0;e<n.length;t++)this.remove(this.keyboard_actions[i][n[t]])}}},h={packagename:"Craft.Core.NotificationCenter",EventListeners:{},add:function(t,e){this.EventListeners[t]||(this.EventListeners[t]={listeners:{},serial:1});var i=this.EventListeners[t].listeners,n=this.EventListeners[t].serial++;return e.serial=n,i[n]=e,n},listen:function(t,e){var i={method:e,once:!1};return this.add(t,i)},once:function(t,e){var i={method:e,once:!0};return this.add(t,i)},do_notify:function(t,e){if(this.EventListeners[t]){for(var i=this.EventListeners[t].listeners,n=Object.keys(i),o=[],s=0;s<n.length;s++){var a=n[s],r=i[a];(0,r.method)(e),r.once&&o.push(a)}for(s=0;s<o.length;s++)delete i[o[s]]}},notify:function(t,e){for(var i=Object.keys(this.EventListeners),n=[],o=0;o<i.length;o++){var s=i[o],a=s.replace("/","\\/").replace(".","\\.").replace("*",".*");t.match(a)&&n.push(s)}for(o=0;o<n.length;o++)this.do_notify(n[o],e)},remove:function(t,e){this.EventListeners[t]&&delete this.EventListeners[t].listeners[e]}};class l{constructor(){this.packagename="",this.componentId="",this.name="",this.viewController="",this.isViewLoaded=!1,this.visible=!1,this.view=document.createElement("div"),this.root="",this.shadow=this.view.attachShadow({mode:"open"}),this.css=""}init(){this.packagename?this.name=this.packagename.replace(/[\/\.]/g,"_"):this.name=this.constructor.name,this.componentId=this.name+"_"+a.nextSerial(),a.set(this.componentId,this),this.view.id=this.componentId}render(){this.loadStyle(),this.renderView()}renderView(){let t=this.template(this.componentId).trim(),e=document.createElement("template");e.innerHTML=t,this.root&&this.root.remove(),this.root=e.content.firstChild,this.shadow.appendChild(this.root)}loadStyle(){this.style&&this.appendStyle(this.style(this.componentId))}appendStyle(t,e){if(e){let t=this.view.getElementById(e);t&&this.view.removeChild(t)}let i=document.createElement("style");i.textContent=t,i.id=e||this.componentId+"_"+a.nextSerial(),this.shadow.appendChild(i),this.css||(this.css=[]),this.css.push(i)}unloadStyle(){if(this.css){for(let t=0;t<this.css.length;t++)this.css[t].remove();this.css=""}}loadView(t){this.init(),this.render(),this.isViewLoaded=!0,this.viewDidLoad(t)}unloadView(t){this.viewWillDisappear(),this.view.remove(),this.viewDidDisappear(),this.view="",this.isViewLoaded=!1,a.del(this.componentId),t&&t()}viewDidLoad(t){t&&t()}viewWillAppear(t){t&&t()}viewDidAppear(t){t&&t()}viewWillDisappear(t){t&&t()}viewDidDisappear(t){t&&t()}show(t){this.view.style.display="block",this.visible=!0,t&&t()}hide(t){this.view.style.display="none",this.visible=!1,t&&t()}appendView(t){if(!t)return;let e,i,n;t instanceof l?(e=this.root,i=t):(e=t.target||this.root,i=t.component,n=t.callback),i.isViewLoaded||i.loadView(),i.viewWillAppear(()=>{i.show(),e.appendChild(i.view),n&&n(),i.viewDidAppear()})}append(t){this.appendView(t)}removeView(t){if(!t)return;let e,i;t instanceof l?e=t:(e=t.component,i=t.callback),e.viewWillDisappear(()=>{e.hide(),e.view.remove(),i&&i(),e.viewDidDisappear()})}remove(t){this.removeView(t)}style(t){return".root {}"}template(t){return'<div class="root"></div>'}}var d={packagename:"Craft.Core.Transition",animate:function(t){new c(t).animate()}};class c{constructor(t){this.packagename="Craft.Core.Transition.Animator",this.DEFAULT_DURATION=150,this.DEFAULT_EASE="ease-in",this.options=t}animate(){let t=this.options.element,e=this.options.properties||{},i=this.options.duration||this.DEFAULT_DURATION,n=this.options.delay||0,o=this.options.ease||this.DEFAULT_EASE,s=this.options.callback;if(!t)return;let a=!1,r=[],h=Object.keys(e);for(let e=0;e<h.length;e++)r.push(h[e]+" "+String(i)+"ms "+o+" "+n+"ms"),0===e&&(t.style[h[e]]=window.getComputedStyle(t).getPropertyValue(h[e]));let l=r.join(", ");t.style.transition=l;let d=function(e){a||(a=!0,clearTimeout(c),t.removeEventListener("transitionend",d),t.style.transition="",s&&s())};t.addEventListener("transitionend",d);let c=setTimeout(d,parseInt(i)+parseInt(n)+50);h.map(function(i){t.style[i]=e[i]})}}var p={packagename:"Craft.Core.Gesture",enableTap:function(t){return new u(t)},enableSwipe:function(t){return new w(t)}};class u{constructor(t){this.packagename="Craft.Core.Gesture.Tap",this.target=t.target,this.tapHandler=t.tap,"ontouchend"in window?this.target.addEventListener("touchend",this.handleTouchEnd.bind(this),!1):this.target.addEventListener("mouseup",this.handleTouchEnd.bind(this),!1)}handleTouchEnd(t){this.tapHandler&&this.tapHandler(t)}}class w{constructor(t){this.packagename="Craft.Core.Gesture.Swipe",this.target=t.target,this.target.addEventListener("touchstart",this.handleTouchStart.bind(this),!1),this.target.addEventListener("touchmove",this.handleTouchMove.bind(this),!1),this.swipeLeftHandler=t.left,this.swipeRightHandler=t.right,this.swipeUpHandler=t.up,this.swipeDownHandler=t.down,this.DIFF_THRESHOLD=t.DIFF_THRESHOLD||50,this.TIME_THRESHOLD=t.TIME_THRESHOLD||40,this.MULTI_THRESHOLD=t.MULTI_THRESHOLD||60,this.xDown=null,this.yDown=null,this.tDown=null,this.lastMultiTouch=null}handleTouchStart(t){let e=t.touches[0];this.xDown=e.clientX,this.yDown=e.clientY,this.tDown=Date.now()}handleTouchMove(t){if(!this.xDown||!this.yDown||!this.tDown)return;if(t.touches.length>1)return void(this.lastMultiTouch=Date.now());let e=t.touches[0].clientX,i=t.touches[0].clientY,n=this.xDown-e,o=this.yDown-i,s=Date.now()-this.tDown,a=Date.now()-this.lastMultiTouch;Math.abs(n)+Math.abs(o)<this.DIFF_THRESHOLD||s<this.TIME_THRESHOLD||a<this.MULTI_THRESHOLD||(Math.abs(n)>Math.abs(o)?n>0?this.swipeLeftHandler&&this.swipeLeftHandler(t):this.swipeRightHandler&&this.swipeRightHandler(t):o>0?this.swipeUpHandler&&this.swipeUpHandler(t):this.swipeDownHandler&&this.swipeDownHandler(t),this.xDown=null,this.yDown=null,this.tDown=null)}}class f extends l{getViewController(){return this.viewController}setViewController(t){this.viewController=t}}class m extends f{constructor(){super(),this.packagename="Craft.UI.DefaultViewController"}viewDidLoad(t){this.enableContentTapped(),t&&t()}enableContentTapped(){p.enableTap({target:this.view,tap:t=>{h.notify("ContentTapped",t)}})}appendView(t){if(!t)return;let e;(e=t instanceof l?t:t.component).setViewController(this),super.appendView(t)}append(t){this.appendView(t)}removeView(t){super.removeView(t)}style(){return"\n\t\t\t* { box-sizing:border-box; margin:0; padding:0; }\n\t\t\t:host {\n\t\t\t\theight: 100%;\n\t\t\t\twidth: 100%;\n\t\t\t\tmargin: 0px;\n\t\t\t\toverflow: hidden;\n\t\t\t\tbox-sizing: border-box;\n\t\t\t}\n\t\t\t.root {\n\t\t\t\theight: 100%;\n\t\t\t\twidth: 100%;\n\t\t\t\tmargin: 0px;\n\t\t\t\toverflow: hidden;\n\t\t\t\tbox-sizing: border-box;\n\t\t\t}\n\t\t"}template(){return'\n\t\t\t<div class="root"></div>\n\t\t'}}var v={hasDisplayCutout:function(){let t=/iPad|iPhone|iPod/.test(navigator.userAgent),e=window.devicePixelRatio||1,i=window.screen.width*e,n=window.screen.height*e;return!(!t||1125!==i||2436!==n)||(!(!t||1242!==i||2688!==n)||!(!t||828!==i||1792!==n))}};const g={};g.Core={Bootstrap:s,Context:o,Defaults:n,ComponentStack:a,KeyboardManager:r,NotificationCenter:h,Component:l,StickComponent:class extends l{init(){this.packagename?this.name=this.packagename.replace(/[\/\.]/g,"_"):this.name=this.constructor.name,this.componentId=this.name,ComponentStack.set(this.componentId,this)}},Transition:d,Gesture:p},g.UI={View:f,DefaultViewController:m,DefaultRootViewController:class extends m{constructor(){super(),this.packagename="Craft.UI.DefaultRootViewController"}bringup(){this.didReceivePopstate()}didReceivePopstate(t){let e=window.location.hash.match(/^#\/(.*)/),i="";e&&(i=e[1]),this.resolveRoutingRequest(i,t)}pushState(t){let e=t.state,i=t.path;window.history.pushState(e,null,i)}resolveRoutingRequest(t,e){}},ModalViewController:class extends f{constructor(){super(),this.packagename="Craft.UI.ModalViewController",this.MaskConfig={},this.MaskConfig.color="#000",this.MaskConfig.opacity=.5,this.AnimationConfig={},this.AnimationConfig.duration=150,this.AnimationConfig.delayShow=0,this.AnimationConfig.delayHide=150,this.mask="",this.container="",this.content="",this.viewController=""}viewDidLoad(t){this.mask=this.shadow.getElementById("mask"),this.container=this.shadow.getElementById("container"),this.view.addEventListener("touchmove",t=>{t.preventDefault()}),this.mask.addEventListener("touchmove",t=>{t.preventDefault()})}setContent(t){t.isViewLoaded||t.loadView(),this.content=t,this.content.setViewController(this),this.container.style["margin-top"]=String(window.screen.height)+"px",this.container.innerHTML="",this.content.viewWillAppear(),this.container.appendChild(this.content.view)}showMask(t){this.mask.style.display="block",this.mask.style.opacity=this.MaskConfig.opacity,this.mask.style["background-color"]=this.MaskConfig.color,t&&t()}hideMask(t){d.animate({element:this.mask,properties:{opacity:0},duration:this.AnimationConfig.duration,delay:this.AnimationConfig.delayHide,callback:()=>{this.mask.style.display="none",t&&t()}})}showContent(t){this.showMask(),this.content.viewDidAppear(),d.animate({element:this.container,properties:{"margin-top":"0px"},duration:this.AnimationConfig.duration,delay:this.AnimationConfig.delayShow,callback:t})}hideContent(t){this.hideMask(),this.content.viewWillDisappear(),d.animate({element:this.container,properties:{"margin-top":String(window.screen.height)+"px"},duration:this.AnimationConfig.duration,delay:this.AnimationConfig.delay,callback:()=>{this.content.viewDidDisappear(),this.hideMask(t)}})}style(){return"\n\t\t\t* { \n\t\t\t\tbox-sizing:border-box; margin:0; padding:0;\n\t\t\t}\n\t\t\t:host {\n\t\t\t\tposition: fixed;\n\t\t\t\ttop: 0;\n\t\t\t\tleft: 0;\n\t\t\t\twidth: 100vw;\n\t\t\t\theight: 100vh;\n\t\t\t\toverflow-x: hidden;\n\t\t\t\toverflow-y: hidden;\n\t\t\t\t-webkit-tap-highlight-color:rgba(0,0,0,0);\n\t\t\t\t-webkit-touch-callout: none;\n\t\t\t}\n\t\t\t.root {\n\t\t\t\twidth: 100vw;\n\t\t\t\theight: 100vh;\n\t\t\t\t-webkit-tap-highlight-color:rgba(0,0,0,0);\n\t\t\t\t-webkit-touch-callout: none;\n\t\t\t}\n\t\t\t.mask {\n\t\t\t\tposition: fixed;\n\t\t\t\ttop: 0;\n\t\t\t\tleft: 0;\n\t\t\t\twidth: 100vw;\n\t\t\t\theight: 100vh;\n\t\t\t\tpadding-top: env(safe-area-inset-top);\n\t\t\t\tpadding-bottom: env(safe-area-inset-bottom);\n\t\t\t\tbackground-color: #000;\n\t\t\t\topacity: 0.5;\n\t\t\t\toverflow-x: hidden;\n\t\t\t\toverflow-y: hidden;\n\t\t\t\t-webkit-tap-highlight-color:rgba(0,0,0,0);\n\t\t\t\t-webkit-touch-callout: none;\n\t\t\t}\n\t\t\t.container {\n\t\t\t\tdisplay: block;\n\t\t\t\tposition: absolute;\n\t\t\t\ttop: 0px;\n\t\t\t\tleft: 0px;\n\t\t\t\tmargin-top: 0px;\n\t\t\t\tpadding-top: env(safe-area-inset-top);\n\t\t\t\tpadding-bottom: env(safe-area-inset-bottom);\n\t\t\t\tmin-width: 100vw;\n\t\t\t\theight: 100vh;\n\t\t\t\tcolor: #000;\n\t\t\t\toverflow-x: hidden;\n\t\t\t\toverflow-y: hidden;\n\t\t\t}\n\t\t"}template(){return'\n\t\t\t<div class="root">\n\t\t\t\t<div id="mask" class="mask"></div>\n\t\t\t\t<div id="container" class="container"></div>\n\t\t\t</div>\n\t\t'}},Device:v},g.Widget={},g.usePackage=function(t){t.inject(g)};e.default=g}])});