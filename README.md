Visit [Demo Page](http://www.the8thocean.com/misc/jqueryplugins/fitBoxScroller/demo/)

## HTML side

		<div id="unique_id">
			content
		</div>

## JAVASCRIPT side

		$('#unique_id').fixBoxScroller({options});

#### Options

*inclImage: if the content has images, this must be true ... (boolean) (default - false)
*bar: style of the scroll bar ... (object)
		{
			size: scroll bar width ... (int) (default - 20)
			backColor: scroll bar color ... (string) (default - '#f00')
			marginLeft: scroll bar margin left for box-shdow ... (int) (default - 0)
			frameBorderWidth: border width of scroll bar frame ... (int) (default - 0)
			frameBorderColor: border color of scroll bar frame ... (string) (default - '#ccc')
			frameBorderStyle: border style of scroll bar frame ... (string) (default - 'solid')
			frameBackground: background color of scroll bar frame ... (string) (default - '')
		}
*isTouchAreaBar: for mobile devices, scrolled by the scroll bar or not ... (boolean) (default - false)

#### jQuery Mousewheel plugin required (option)