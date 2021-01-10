let SQ_SIZE;
let animationInterval;

$( ()=> {

	// url params, copying, and links

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

	// main function and setup

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

		if(SQ_SIZE==1 && $('#grid-checkbox').is(':checked') ) {
			SQ_SIZE = 2;
			$('#size-input').val(2);
		}

		$('#display').html('');
		drawRuleDisplay(num);
		drawCellularDisplay(num);
		document.title = `Cellular Automata - Rule ${num}`;
	}

	$('input:not(#dark-checkbox), #edge-select').change( ()=> {
		$('#loading-div').show();
		setTimeout(redraw, 10);
		setTimeout( ()=>$('#loading-div').hide(), 10);
	});
	$('#rule-num-input').select().change();

	// misc btn listeners

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

	$('#download-img-btn').click( ()=> {
		let link = document.createElement('a');
		link.download = `Rule ${$('#rule-num').html()}.png`;
		link.href = document.getElementsByClassName('row-canvas')[0].toDataURL();
		link.click();
	});

	$('#fullscreen-canvas-btn').click( ()=> {
		let elm = document.getElementsByClassName('row-canvas')[0];
		if(elm.requestFullscreen) {
			elm.requestFullscreen();
		} else if(elm.webkitRequestFullscreen) {
			elm.webkitRequestFullscreen();
		} else if(elm.msRequestFullscreen) {
			elm.msRequestFullscreen();
		}
	});

	$('#all-cellular-btn').click(openPageWithAll);

	// raw data

	$('#raw-data-btn').click( ()=> {
		if($('#raw-data-btn').html().indexOf('Show') != -1) {
			$('#raw-data-btn').html('Hide Raw Data');
			$('#raw-data').css('display', 'block');
			$('#raw-data')[0].scrollIntoView();
			$('#copy-raw-data-btn').css('display', 'inline-block');
			$('#download-raw-data-btn').css('display', 'inline-block');
		} else {
			$('#raw-data-btn').html('Show Raw Data');
			$('#raw-data').css('display', 'none');
			$('#copy-raw-data-btn').css('display', 'none');
			$('#download-raw-data-btn').css('display', 'none');
		}
	});

	$('#copy-raw-data-btn').click( ()=> {
		$('#raw-data').select();
		document.execCommand('copy');
	});
	$('#download-raw-data-btn').click( ()=> {
		downloadFile($('#raw-data').val(), `rule ${$('#rule-num').html()}`);
	});
	
	// one details open at a time

	// https://stackoverflow.com/a/36994802/4907950
	const details = document.querySelectorAll('details');
	details.forEach(targetDetail=> {
		targetDetail.addEventListener('click', ()=> {
			// close details that aren't the target
			details.forEach(detail => {
				if(detail !== targetDetail) {
					detail.removeAttribute('open');
				}
			});
		});
	});

});

// utility functions

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

function downloadFile(str, fileName) {
	let file;
	let properties = {type: 'plain/text'};
	try {
		file = new File([str], fileName + '.txt', properties);
	} catch(err) {
		file = new Blob([str], properties);
	}

	let link = document.createElement('a');
	link.download = fileName + '.txt';
	link.href = URL.createObjectURL(file);
	link.click();
}

function openPageWithAll() {
	let newWindow = window.open('', '', 'width=400,height=400');
	newWindow.document.write('<div id="display"></div>');
	for(let ruleNum=0; ruleNum<256; ruleNum++) {
		drawCellularDisplay(ruleNum, false, $(newWindow.document.getElementById('display') ) );
	}
}