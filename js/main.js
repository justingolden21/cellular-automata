let SQ_SIZE;
let animationInterval;

$( ()=> {
	// https://stackoverflow.com/a/3540295/4907950
	SQ_SIZE = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? 5: 10;
	$('#size-input').val(SQ_SIZE);

	// get url param
	let url = new URL(window.location.href);
	let ca = url.searchParams.get('ca');
	ca = verify(ca, 0, 255, -1);
	if(ca != -1) {
		$('#rule-num-input').val(ca);
	}

	$('#copied-span').css('display', 'none');
	let copiedTimeout;

	$('#copy-link-btn').click( ()=> {
		let tmp = $('<input type="text">').appendTo(document.body);
		tmp.val(window.location.href);
		tmp.select();
		document.execCommand('copy');
		tmp.remove();

		$('#copied-span').css('display', '');
		clearTimeout(copiedTimeout);
		copiedTimeout = setTimeout( ()=> $('#copied-span').css('display', 'none'), 2500);
	});
	$('#link-btn').click( ()=> {
		if($('#link-btn').html().indexOf('Unlink Rule Number') != -1) {
			$('#link-btn').html('Link Rule Number');
			window.history.replaceState(null, null, window.location.pathname); // remove url param
		} else {
			$('#link-btn').html('Unlink Rule Number');
			history.replaceState({}, '', '?ca=' + getVal('rule-num-input') ); // set url param
		}
	});

	function redraw() {
		if($('#play-pause-btn').html().indexOf('Play') == -1) {
			$('#play-pause-btn').click();
		}

		let num = getVal('rule-num-input');

		if($('#link-btn').html().indexOf('Unlink Rule Number') != -1) {
			history.replaceState({}, '', '?ca=' + num); // set url param
		}

		const STEPS = getVal('steps-input');
		CELLULAR_WIDTH = STEPS*2+1;
		CELLULAR_HEIGHT = STEPS+1;
		SQ_SIZE = getVal('size-input');

		$('#display').html('');
		drawRuleDisplay(num);
		drawCellularDisplay(num);
		document.title = `Cellular Automata - Rule ${num}`;
	}

	$('input').change( ()=> {
		$('#loading-div').show();
		setTimeout(redraw, 10);
		setTimeout( ()=>$('#loading-div').hide(), 10);
	});
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

			// prepare for animation
			$('#display .row-canvas').remove();
			
			$('#loading-div').show();
			setTimeout( ()=> drawCellularDisplay(num, true), 10);
			setTimeout( ()=>$('#loading-div').hide(), 10);
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

	$('#dark-checkbox').change( ()=> {
		$('#dark-css').attr('href', $('#dark-checkbox').is(':checked') ? 'css/dark.css' : '');
		$('#background-select').change();
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