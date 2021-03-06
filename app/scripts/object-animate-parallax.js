// DOCUMENT READY
function prefixTransform(element, property) {
	element.style.webkitTransform = property;
	element.style.MozTransform = property;
	element.style.msTransform = property;
	element.style.OTransform = property;
	element.style.transform = property;
}

(function() {
	'use strict';

	// WINDOW VARS
	var windowHeight =  Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
		windowWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
		docViewTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop,
		docViewBottom = docViewTop + windowHeight,
		css3dtransforms = true,
		htmlClass = document.getElementsByTagName('HTML')[0].attributes.class.value,
		scrollTimeout,
		resizeTimeout,
		scrollHandler,
		resizeHandler;

	// GET WINDOW SPECS UTIL FUNCITON
	function updateWindowSpecs() {
			windowWidth = Math.round(Math.max(document.documentElement.clientWidth, window.innerWidth || 0));
			windowHeight = Math.round(Math.max(document.documentElement.clientHeight, window.innerHeight || 0));
			docViewTop = Math.round((window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop);
			docViewBottom = docViewTop + windowHeight;
	}

	// TEST FOR 3D TRANSFORMS
	if(htmlClass.indexOf('no-csstransforms3d') > -1) {
		css3dtransforms = false;
	}

	// O B J E C T    A N I M A T E
	function AnimatedElement(elem, defaults) {
		var elem = elem,
			defaults = defaults || {},
			move,
			slideBgDown,
			property,
			_t = this;

		// P R O P E R T I E S
		this.$element = document.getElementById(elem);
		this.name = elem;
		
		this.elementWidth = this.$element.offsetWidth;
		this.elementHeight = this.$element.offsetHeight;
		this.elementTop = this.$element.offsetTop;
		this.elementBottom = this.elementHeight + this.elementTop;

		// DEFAULTS
		this.animStart = defaults.animStart || 0;
		this.animEnd = defaults.animEnd || windowWidth;

		// M E T H O D S
		this.getScrollTop = function() {
			return docViewTop;
		};

		this.getWinWidth = function() {
			return windowWidth;
		};

		this.getWinHeight = function() {
			return windowHeight;
		};


		// IN VIEW FOR #GREY-CAR
		this.isInView = function() {
			return ( (this.elementTop <= docViewBottom) && (this.elementBottom >= docViewTop) );
		};

		// IN VIEW FOR #RED-CAR
		this.redCarInView = function() {
			if(docViewTop-this.elementWidth-this.elementHeight > this.elementBottom) {
				return false;
			} else {
				return true;
			}
		};

		// IN VIEW FOR #RED-CAR
		this.geoSunInView = function() {
			move = Math.round(Math.cos(33.45) * docViewTop * -1);
			if(move < Math.round(windowHeight * 1.1)) {
				return true;
			} else {
				return false;
			}
		};

		// ANIMATE FUNCTION - TEST FOR CSS3 TRANSFORMS
		if(css3dtransforms) {
			this.animateGeoSun = function() {
				slideBgDown = Math.round(Math.cos(33.45) * docViewTop * -1 );
				property = 'translate3d(0px, '+ slideBgDown +'px, 0)'
				prefixTransform(this.$element, property );
			}
			
		} else {
			this.animateGeoSun = function() {
				this.$element.style.top = this.$element.style.top + ( Math.cos(33.45) * (Math.round(docViewTop)) * -1 ) +'px';
			}
		}		
	} // END OBJECT ANIMATE


	// LIST VARS
	var Geo,
		GeoSun;

	// ANIMATABLE OBJECTS
	GeoSun = new AnimatedElement('geometric-sun');
	Geo = new AnimatedElement('geometric');
	

	// W I N D O W    E V E N T S
		// R E S I Z E 
		window.onresize = function() {
			if (resizeTimeout) {
				// clear the timeout, if one is pending
				clearTimeout(resizeTimeout);
				resizeTimeout = null;
			}
			resizeTimeout = setTimeout(resizeHandler, 60/1000);
		};

		resizeHandler = function(argument) {	
			updateWindowSpecs();
		}
		// E N D    R E S I Z E


		// S C R O L L 
		window.onscroll = function() {
			if (scrollTimeout) {
				// clear the timeout, if one is pending
				clearTimeout(scrollTimeout);
				scrollTimeout = null;
			}
			scrollTimeout = setTimeout(scrollHandler, 60/1000);

		};


		scrollHandler = function () {
			// UPDATE WINDOW SCROLL VARIABLE
			updateWindowSpecs();
			
			// CHECK FOR GEO-SUN VAN IN VIEW
			if(GeoSun.geoSunInView() ) {
				GeoSun.animateGeoSun();		
			}

		}
		// E N D    S C R O L L
	// E N D   W I N D O W   E V E N T S 
})();