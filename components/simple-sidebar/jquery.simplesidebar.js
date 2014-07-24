//Simple Sidebar v1.0.0 by DcDeiv https://github.com/dcdeiv
// GPLv2 http://www.gnu.org/licenses/gpl-2.0-standalone.html
(function( $ ) {
	$.fn.simpleSidebar = function( options ) {
		//declaring all global variables
		var sbw, align, callbackA, callbackB,
			//allowing user customisation
			defaults  = {
				settings: {
					opener: undefined,
					wrapper: undefined, //HTML tag is not safe. Please, use a container/wrapper div
					ignore: undefined,
					data: 'ssbplugin',
					animation: {
						duration: 500, //milliseconds (0.5s = 500ms)
						easing: 'swing'
					}
				},
				sidebar: {
					align: undefined,
					width: 350, //pixels
					gap: 64, //pixels
					closingLinks: 'a',
					style: {
						zIndex: 3000
					}
				},
				mask: {
					style: {
						backgroundColor: 'black',
						opacity: 0.5,
						filter: 'Alpha(opacity=50)' //IE8 and earlier
					}
				}
			},
			config    = $.extend( true, defaults, options ),
			$sidebar  = this,
			$opener   = $( config.settings.opener ),
			$wrapper  = $( config.settings.wrapper ),
			$ignore   = $( config.settings.ignore ),
			dataName  = config.settings.data,
			duration  = config.settings.animation.duration,
			easing    = config.settings.animation.easing,
			defAlign  = config.sidebar.align,
			sbMaxW    = config.sidebar.width,
			gap       = config.sidebar.gap,
			$links    = $( config.sidebar.links ),
			defStyle  = config.sidebar.style,
			maskStyle = config.mask.style,
			winMaxW   = sbMaxW + gap,
			//selecting all fixed elements except the sidebar and the ignore elements
			$fixedEl  = $( '*' )
				.not( $ignore )
				.not( $sidebar )
				.filter(function() {
					return $( this ).css( 'position' ) == 'fixed';
				}),
			//selecting all elements.
			$elements = $fixedEl
				.add( $sidebar )
				.add( $wrapper )
				.not( $ignore ),
			w         = $( window ).width();
		
		//adding default style to $sidebar
		$sidebar
			.css( defStyle )
			//wrapping inner content to let it overflow
			.wrapInner( '<div data-' + dataName + '="sub-wrapper">' );
			
		var subWrapper = $sidebar.children().filter(function() {
			return $( this ).data( dataName ) === 'sub-wrapper' ;
		});
		
		subWrapper.css({
			width: '100%',
			height: '100%',
			overflow: 'auto'
		});
			
		//Appending to 'body' the mask-div and adding its style
		$( 'body' ).append( '<div data-' + dataName + '="mask">' );
		
		var maskDiv = $( 'body' ).children().filter(function(){
			return $( this ).data( dataName ) === 'mask' ;
		});
		
		maskDiv
			//default style by user
			.css( maskStyle )
			//style properties that cannot be ovverriden
			.css({
				//mask-div is positioned with a negative integer for a bug in mobile browsers. On scrolling the page, the div will move as the browser-navigation-bar appears (Chrome Mobile, Opera Mobile, Firefox Mobile)
				position: 'fixed',
				top: -200,
				right: -200,
				left: -200,
				bottom: -200,
				//setting the z-index to 1 level below the sidebar so that it will overlay the page but not the sidebar
				zIndex: config.sidebar.style.zIndex - 1 })
			//hiding the mask-div. This element will be triggered only when the sidebar will be opened.
			.hide();
		
		//Animate $elements to the right
		var animateToRight = function() {
			var nsbw = $sidebar.width();
			
			$elements.animate({
				marginLeft: '+=' + nsbw,
				marginRight: '-=' + nsbw
			}, {
				duration: duration,
				easing: easing,
				complete: callbackA
			});
		},
			//animate $elements to the left
			animateToLeft = function() {
				var nsbw = $sidebar.width();
				
				$elements.animate({
					marginLeft: '-=' + nsbw,
					marginRight: '+=' + nsbw
				}, {
					duration: duration,
					easing: easing,
					complete: callbackB
				});
			},
			//hiding overflow [callback(A/B)]
			overflowTrue = function() {
				$( 'body, html' ).css({
					overflow: 'hidden'
				});
				
				$( maskDiv ).fadeIn();
			},
			//adding overflow [callback(A/B)]
			overflowFalse = function() {
				$( maskDiv ).fadeOut(function() {
					$( 'body, html' ).css({
						overflow: 'auto'
					});
				});
			};
		
		//assigning value to sbw
		if ( w < winMaxW ) {
			sbw = w - gap;
		} else {
			sbw = sbMaxW;
		}
		
		//testing config.sidebar.align
		if( defAlign === undefined || defAlign === 'left' ) {
			align = 'left';
		} else {
			align = 'right';
		}
		
		//Sidebar initial position
		if ( 'left' === align ) {
			$sidebar.css({
				position: 'fixed',
				top: 0,
				left: 0,
				bottom: 0,
				width: sbw,
				marginLeft: -sbw
			});
			
			callbackA = overflowTrue;
			callbackB = overflowFalse;
			
			$opener.click( animateToRight );
			
			maskDiv.add( $links )
				.click( animateToLeft );
		} else {
			$sidebar.css({
				position: 'fixed',
				top: 0,
				bottom: 0,
				right: 0,
				width: sbw,
				marginRight: -sbw
			});
			
			callbackA = overflowFalse;
			callbackB = overflowTrue;
			
			$opener.click( animateToLeft );
			
			maskDiv.add( $links )
				.click( animateToRight );
		}
		
		//Adding responsive to $sidebar
		$( window ).resize(function() {
			var rsbw, sbMar,
				w = $( this ).width();
				
			if ( w < winMaxW ) {
				rsbw = w - gap;
			} else {
				rsbw = sbMaxW;
			}
			
			$sidebar.css({
				width: rsbw
			});
			
			//fixing $element position according to $sidebar new width (rsbw)
			if ( 'left' === align ) {
				sbMar = parseInt( $sidebar.css( 'margin-left' ) );
				
				if ( 0 > sbMar ) {
					$sidebar.css({
						marginLeft: -rsbw
					});
				} else {
					$elements.not( $sidebar )
						.css({
							marginLeft: + rsbw,
							marginRight: - rsbw
						});
				}
			} else {
				sbMar = parseInt( $sidebar.css( 'margin-right' ) );
				
				if ( 0 < sbMar ) {
					$sidebar.css({
						marginRight: -rsbw
					});
				} else {
					$elements.not( $sidebar )
						.css({
							marginLeft: - rsbw,
							marginRight: + rsbw
						});
				}
			}
		});
		
		return this;
	};
})(jQuery);