let SQ_SIZE;
let animationInterval;

$( ()=> {
	// https://stackoverflow.com/a/3540295/4907950
	SQ_SIZE = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? 10: 20;
	$('#size-input').val(SQ_SIZE);

	// get url param
	let url = new URL(window.location.href);
	let ca = url.searchParams.get('ca');
	$('#rule-num-input').val(ca || 30);

	function redraw() {
		let num = getVal('rule-num-input');

		history.replaceState({}, '', '?ca=' + num); // set url param

		CELLULAR_WIDTH = getVal('width-input');
		CELLULAR_HEIGHT = getVal('height-input');
		SQ_SIZE = getVal('size-input');

		$('#display').html('');
		drawRuleDisplay(num);
		drawCellularDisplay(num);
		document.title = `Cellular Automata - Rule ${num}`;
	}

	$('input').change(redraw);
	$('#rule-num-input').select().change();

	$('#random-btn').click( ()=> 
		$('#rule-num-input').val(random(0,255) ).change()
	);

	$('#play-pause-btn').click( ()=> {
		let num = getVal('rule-num-input');
		if($('#play-pause-btn').html().indexOf('Play') != -1) {
			$('#play-pause-btn').html('Pause');
			animationInterval = setInterval( ()=> nextFrame(num), $('#speed-select').val() );
			$('#display .row-canvas').first()[0].scrollIntoView();
		} else {
			$('#play-pause-btn').html('Play');
			clearInterval(animationInterval);
		}
	});

	$('#restart-btn').click( ()=> {
		clearInterval(animationInterval);
		$('#play-pause-btn').html('Play');
		redraw();
	});

	$('#speed-select').change( ()=> {
		if($('#play-pause-btn').html().indexOf('Play') == -1) { // playing
			$('#play-pause-btn').click().click();
		}
	});

});

function getVal(elmID) {
	let elm = $(`#${elmID}`);
	let val = parseInt(elm.val() );
	val = verify(val, elm.attr('min'), elm.attr('max'), elm.attr('min') );
	elm.val(val);
	return val;
}

function verify(num, min, max, defaultVal) {
	num = Math.max(Math.min(parseInt(num),max),min);
	return isNaN(num) ? defaultVal : num;
}

// random int between min and max (inclusive)
const random = (min, max) => Math.floor(Math.random() * (max - min + 1) ) + min;