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
		docScrolled = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop,
		docViewBottom = docScrolled + windowHeight,
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
			docScrolled = Math.round((window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop);
			docViewBottom = docScrolled + windowHeight;
	}

	// TEST FOR 3D TRANSFORMS
	if(htmlClass.indexOf('no-csstransforms3d') > -1) {
		css3dtransforms = false;
	}

	// O B J E C T    A N I M A T E
	function AnimatedElement(elem, options) {
		var elem = elem,
			options = options || {},
			move,
			scrollArea,
			userScroll,
			stepping,
			percent,
			slideBgDown,
			property,
			_t = this;

		// P R O P E R T I E S
		this.$element = document.getElementById(elem);
		this.name = elem;
		
		this.elementWidth = this.$element.offsetWidth;
		this.elementHeight = this.$element.offsetHeight;
		// IF OFFSET TOP IS 0, GET PARENT OFFSET
		this.elementTop = this.$element.offsetTop ? this.$element.offsetTop : this.$element.offsetParent.offsetTop; 
		this.elementBottom = this.elementHeight + this.elementTop;
		this.scrollInView = windowHeight - this.elementTop;

		// console.log('Thisi is this.scrollInView: ' + this.scrollInView);

		// options
		this.animStart = options.animStart || 0;
		this.animEnd = options.animEnd || windowWidth;
		this.animDistance = options.animDistance || false;

		// console.log('This is animDistance: ' + this.animDistance);

		// M E T H O D S
		this.getScrollTop = function() {
			return docScrolled;
		};

		this.getWinWidth = function() {
			return windowWidth;
		};

		this.getWinHeight = function() {
			return windowHeight;
		};


		// IN VIEW FOR #GREY-CAR
		this.isInView = function() {

			return ( (this.elementTop <= docViewBottom) && (this.elementBottom >= docScrolled) );
		};

		// IN VIEW FOR #RED-CAR
		this.redCarInView = function() {
			if(docScrolled-this.elementWidth-this.elementHeight > this.elementBottom) {
				return false;
			} else {
				return true;
			}
		};

		// IN VIEW FOR #GEO-SUN
		this.geoSunInView = function() {
			// CHECK FOR BOUNDARY
			if( (this.elementTop <= docViewBottom) && (this.elementBottom >= docScrolled) ) {
				// console.log('This is true Mahn!');

				return true;
			} else {
				// console.log('This is FALSE Mahn!');
				return false;
			}
		};

		// ANIMATE FUNCTION - TEST FOR CSS3 TRANSFORMS
		// HERE YOU ARE GOING TO DEFINE WHEN AND WHERE
		if(css3dtransforms) {
			this.animateGeoSun = function() {
				scrollArea = windowHeight - (windowHeight - this.elementTop) + this.elementHeight;
				userScroll = docScrolled;
				percent = docScrolled/scrollArea;
				move = Math.round(this.animDistance * percent);

				// slideBgDown = Math.round(Math.cos(33.45) * docScrolled * -1 );
				property = 'translate3d('+ move +'px, 0, 0)';
				prefixTransform(this.$element, property );
			}
			
		} else {
			this.animateGeoSun = function() {
				this.$element.style.top = this.$element.style.top + ( Math.cos(33.45) * (Math.round(docScrolled)) * -1 ) +'px';
			}
		}		
	} // END OBJECT ANIMATE


	// LIST VARS
	var geoOptions,
		GeoSun;

	// GEO SUN OPTIONS
	geoOptions = {
		animDistance:280
	}

	// ANIMATABLE OBJECTS
	GeoSun = new AnimatedElement('geometric-sun', geoOptions);
	

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

		resizeHandler = function() {	
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
			// if(GeoSun.geoSunInView() ) {
			if(GeoSun.geoSunInView() ) {
				GeoSun.animateGeoSun();		
			}

		}
		// E N D    S C R O L L
	// E N D   W I N D O W   E V E N T S 
})();