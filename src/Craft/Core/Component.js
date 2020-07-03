
import { ComponentStack } from './ComponentStack.js';

/** 
 * Super class for all Craft-UIKit Components.
 * 
 * @packagename Craft.Core.Component
 */
export class Component {
	
	/**
	 * Component constructor.
	 */
	constructor(){
		this.packagename    = ''; // TODO: waiting ES2020 class fields (define this to use for componentId base name instead of class name)
		this.componentId    = ''; // unique identifier defined by name and serial
		this.componentname  = ''; // conceptional name, automatically generated by init() according to the this.packagename
		this.viewController = ''; // optional. viewController this component is managed by. would be set by viewController or by yourself.
		this.isViewLoaded   = false; // true after init() and render() was called
		this.visible        = false; // true while visible
		this.parent         = null; // parent Component
		
		this.view   = document.createElement('div');            // shadow host
		this.root   = '';                                       // component root based on `template`
		this.shadow = this.view.attachShadow({ mode: 'open' }); // shadow root
		this.css    = '';                                       // array of style
		
		// will be upgraded in init() if you define packagename
		this.componentname = this.constructor.name;
		this.component_serial = ComponentStack.nextSerial();
		this.componentId = this.componentname + '_' + this.component_serial;
	}
	
	/**
	 * Initialize instance values 
	 * 
	 * Upgrade this.componentname and this.componentId by this.packagename if defined.
	 * To avoid conflicting componentId, it is highly recommended to define this.packagename in the constructor of your Component sub-class.
	 * 
	 * TODO: waiting ES2020 class fields (to be able to define packagename in class field)
	 * 
	 * You should never call this method directly, and should never override this method. 
	 * This is a part of `loadView` the initialization processs of Component, but separated for readability. 
	 * 
	 * Use `viewDidLoad` for your additional initialization.
	 * 
	 * (highly recommended to be implemented as synchronous)
	 */
	init(){
		if( this.packagename ){
			this.componentname = this.packagename.replace(/[\/\.]/g,'_'); // id should not have dot
		}else{
			this.componentname = this.constructor.name;
		}
		this.componentId = this.componentname + '_' + this.component_serial;
		ComponentStack.set(this.componentId,this);
		
		this.view.id = this.componentId;
	}
	
	/**
	 * Render RootView and load stylesheet.
	 * 
	 * `template()` and `style()` can access to its instance variables via `this`. 
	 * 
	 * (highly recommended to be implemented as synchronous)
	 */
	render(){
		this.loadStyle();
		this.renderView();
	}
	
	/**
	 * Render template, and get the shadow DOM. 
	 * 
	 * If you call this method, this.root(including scoped style) will be cleared. 
	 */
	renderView(){
		let html = this.template(this.componentId).trim();
		let tmpl = document.createElement('template');
		tmpl.innerHTML = html;
		
		if( this.root ){ this.root.remove(); }
		
		this.root = tmpl.content.firstChild;
		
		this.shadow.appendChild(this.root);
	}
	
	/**
	 * Load style defined in this instance
	 */
	loadStyle(){
		if( this.style ){
			this.appendStyle( this.style(this.componentId) );
		}
	}
	
	/**
	 * Load style from text, and append it to the shadow root.
	 * 
	 * @param {String} style - stylesheet text expression
	 * @param {String} id - id for the style tag (optional)
	 */
	appendStyle(style,id){
		if( id ){
			let element = this.view.getElementById(id);
			if( element ){ this.view.removeChild(element); }
		}
		let element = document.createElement('style');
		element.textContent = style;
		element.id = id || this.componentId + '_' + ComponentStack.nextSerial();
		this.shadow.appendChild(element);
		
		if( !this.css ){ this.css = []; }
		this.css.push(element);
	}
	
	/**
	 * Remove all styles
	 */
	unloadStyle(){
		if( this.css ){
			for( let i=0; i<this.css.length; i++ ){
				this.css[i].remove();
			}
			this.css = '';
		}
	}
	
	/** 
	 * Make this.view(RootView) and this.css.
	 * 
	 * ViewController or component consumer should call this method just after instantiate the component,
	 * or whenever you want to use the instance of this component that is not yet ready (isViewLoaded is false).
	 * 
	 * You should not never override this method. 
	 * Use `viewDidLoad` for your additional initialization.
	 * 
	 * If you have to implement your own `loadView` method, you must implement yours as:
	 * 
	 * 1. this.init();  
	 * 2. this.render();  
	 *    (here, you can access to the RootView of this component)  
	 *    (your component setup is in here)  
	 * 3. set isViewLoaded to true.  
	 * 4. call this.viewDidLoad(callback);  
	 * 
	 * and incomming callback should be passed to the `viewDidLoad`.
	 * 
	 * (this is highly recommended to be implemented as synchronous)
	 * 
	 * @summary Make this.view(RootView) and this.css
	 * @argument {Function} callback - callback
	 */
	loadView(callback){
		this.init();
		this.render();
		this.isViewLoaded = true;
		this.viewDidLoad(callback);
	}
	
	/**
	 * Remove this.view (shadow DOM) from the Shadow host, and clear memory.
	 * 
	 * @argument {Function} callback - callback
	 */ 
	unloadView(callback){
		this.viewWillDisappear();
		this.view.remove();
		this.viewDidDisappear();
		this.view = '';
		this.isViewLoaded = false;
		ComponentStack.del(this.componentId);
		if( callback ){ callback() }
	}
	
	/**
	 * Lifecycle method:  
	 * Called at the end of `loadView`. Component instance loaded and ready to use this.view. 
	 * 
	 * You have to call callback at the end of yours.
	 * 
	 * @argument {Function} callback - callback
	 */
	viewDidLoad(callback){
		if( callback ){ callback() }
	}
	
	/**
	 * Lifecycle method:  
	 * Called just before appending `this.view` to the parent. 
	 * 
	 * You *must* call callback at the end of yours.
	 * 
	 * Component RootView is now on the screen (in the browser DOM tree), 
	 * and concrete ViewController should ensure to be able to access `this.view` via global DOM tree after here.
	 * 
	 * @argument {Function} callback - callback
	 */
	viewWillAppear(callback){
		if( callback ){ callback() }
	}
	
	/**
	 * Lifecycle method:  
	 * Called just after `this.view` appended to the parent.  
	 * After this method, you can access the compoenent's RootView via `document.getElementByID` and some other query selectors. 
	 * 
	 * You have to call callback at the end of yours.
	 * 
	 * @argument {Function} callback - callback
	 */
	viewDidAppear(callback){
		if( callback ){ callback() }
	}
	
	/**
	 * Lifecycle method:  
	 * Called just before removing `this.view` from its parent.  
	 * You may remove your listener defined in `viewWillAppear` or `viewDidAppear`. 
	 * 
	 * You have to call callback at the end of yours.
	 * 
	 * @argument {Function} callback - callback
	 */
	viewWillDisappear(callback){
		if( callback ){ callback() }
	}
	
	/**
	 * Lifecycle method:  
	 * Called just after `this.view` removed from its parent.
	 * 
	 * You have to call callback at the end of yours.
	 * 
	 * @argument {Function} callback - callback
	 */
	viewDidDisappear(callback){
		if( callback ){ callback() }
	}
	
	/**
	 * Append sub-view to this.view.
	 * 
	 * @param {Object} options - option
	 * @param {Element} options.target - target element to place the view
	 * @param {Craft.UI.Componenet} options.component - sub view
	 * @param {Function} callback - callback
	 * @summary Append sub-view to this.view
	 * 
	 * @example
	 * 
	 * // append btn.view at the end of panel.view.
	 * 
	 * panel.appendView(btn);
	 * 
	 * // append btn.view in '#btn' under the ShadwRoot
	 * 
	 * this.appendView({
	 *     target    : this.shadow.getElementById('btn'),
	 *     component : btn
	 * });
	 * 
	 * // if you know the structrue of panel.view, you can append btn.view directly into the deep point of the panel.
	 * 
	 * panel.appendView({
	 *     target    : panel.shadow.getElementById('btn'),
	 *     component : btn
	 * });
	 * 
	 */
	appendSubView(options){
		if( !options ){ return; }
		let target, component, callback;
		
		if( options instanceof Component ){
			target    = this.root;
			component = options;
		}else{
			target    = options.target || this.root;
			component = options.component;
			callback  = options.callback;
		}
		
		if( !component.isViewLoaded ){
			component.loadView();
		}
		
		if( this.viewController ){
			component.setViewController(this.viewController);
		}
		
		component.parent = this;
		
		component.viewWillAppear( () => {
			target.appendChild(component.view);
			if( callback ){ callback(); }
			component.viewDidAppear();
		});
	}
	
	/** 
	 * DEPRECATED: 
	 * alias for appendSubView
	 */
	appendView(options){
		this.appendSubView(options);
	}
	
	/** 
	 * DEPRECATED: 
	 * alias for appendSubView
	 */
	append(options){
		this.appendSubView(options);
	}
	
	/**
	 * Remove a sub-view from this.view
	 * 
	 * `removeView` does not call `unloadView` of the removed view.
	 * When to parge the component is a responsibility of your component consumer.
	 * 
	 * @param {Object} options - option or remove target Componenet
	 * @param {Craft.UI.Componenet} options.component - Component to be removed
	 * @param {Function} callback - callback
	 * @summary Remove a sub-view from this.view
	 * 
	 * @example
	 * 
	 * // remove this.btn.view from this.view. 
	 * 
	 * this.removeView(this.btn);
	 * 
	 */
	removeSubView(options){
		if( !options ){ return; }
		let target, component, callback;
		
		if( options instanceof Component ){
			component = options;
		}else{
			component = options.component;
			callback  = options.callback;
		}
		
		component.viewWillDisappear( () => {
			component.view.remove();
			if( callback ){ callback(); }
			component.viewDidDisappear();
		});
	}
	
	/** 
	 * DEPRECATED:
	 * TODO: remove this method
	 * alias for removeSubView
	 */
	removeView(options){
		this.removeSubView(options);
	}
	
	/** 
	 * Remove me from parent
	 */
	removeFromParent(options){
		this.parent.removeSubView(this);
	}
	
	/**
	 * TODO: 
	 * replaceView -> replaceSubView
	 * 
	 * Replace view
	 * 
	 * remove all components in the target, and append new one.
	 * 
	 * @example
	 * 
	 * let loading_indicator = new LoadingIndicator();
	 * 
	 * this.appendView(loading_indicator);
	 * 
	 * database.load(id,(data)=>{
	 *     let view = new DataView({data:data});
	 *     this.replaceView(view);
	 * });
	 * 
	 */
	replaceView(options){
		if( !options ){ return; }
		let target, component, callback;
		
		if( options instanceof Component ){
			target    = this.root;
			component = options;
		}else{
			target    = options.target || this.root;
			component = options.component;
			callback  = options.callback;
		}
		
		while(target.firstChild){
			target.removeChild(target.firstChild);
		}
		this.appendSubView({
			target    : target,
			component : component
		});
	}
	
	/**
	 * Stylesheet definition.
	 * 
	 * If you would like to cascade styles from parent class, just append super.style
	 * 
	 * ``` 
	 * style(componentId){
	 *     return　super.style(componentId) + `
	 *         .override { ... }
	 *     `;
	 * }
	 * ```
	 * 
	 * @param {String} componentId - this.componentId
	 */
	style(componentId){ return `.root {}`; }
	
	/**
	 * RootView template.
	 * 
	 * `template` must have only one element.
	 * 
	 * @param {String} componentId - this.componentId
	 */
	template(componentId){ return `<div class="root"></div>`; }
}

