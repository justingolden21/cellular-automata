if ('serviceWorker' in navigator) {
	navigator.serviceWorker
		.register('sw.js')
		.then((reg) => console.log('service worker registered', reg))
		.catch((err) => console.log('service worker not registered', err));
}

let SQ_SIZE;
let animationInterval;

window.onload = () => {
	// url params, copying, and links

	let url = new URL(window.location.href);
	let ca = url.searchParams.get('ca');
	ca = verify(ca, 0, 255, -1);
	if (ca != -1) {
		u('#rule-num-input').val(ca);
	}

	u('#copied-span').css('display', 'none');
	let copiedTimeout;

	u('#copy-link-btn').on('click', () => {
		copyText(window.location.href);

		u('#copied-span').css('display', '');
		clearTimeout(copiedTimeout);
		copiedTimeout = setTimeout(
			() => u('#copied-span').css('display', 'none'),
			2500
		);
	});
	u('#link-btn').on('click', () => {
		if (u('#link-btn').html().indexOf('Unlink Rule Number') != -1) {
			u('#link-btn').html('Link Rule Number');
			window.history.replaceState(null, null, window.location.pathname); // remove url param
		} else {
			u('#link-btn').html('Unlink Rule Number');
			history.replaceState({}, '', '?ca=' + getVal('rule-num-input')); // set url param
		}
	});

	// main function and setup

	function redraw() {
		let num = getVal('rule-num-input');

		if (u('#link-btn').html().indexOf('Unlink Rule Number') != -1) {
			history.replaceState({}, '', '?ca=' + num); // set url param
		}

		const STEPS = getVal('steps-input');
		CELLULAR_WIDTH = STEPS * 2 + 1;
		CELLULAR_HEIGHT = STEPS + 1;
		SQ_SIZE = getVal('size-input');

		if (SQ_SIZE == 1 && u('#grid-checkbox').is(':checked')) {
			SQ_SIZE = 2;
			u('#size-input').val(2);
		}

		u('#display').html('');
		drawRuleDisplay(num);
		drawCellularDisplay(num);
		document.title = `Cellular Automata - Rule ${num}`;
	}

	u('input:not(#dark-checkbox), #edge-select').on('change', () => {
		handleLoading(redraw);
	});
	u('#rule-num-input').first().select();
	u('#rule-num-input').trigger('change');

	// misc btn listeners

	u('#random-btn').on('click', () =>
		u('#rule-num-input').val(random(0, 255)).trigger('change')
	);

	u('#dark-checkbox').on('change', () => {
		u('#dark-css').attr(
			'href',
			u('#dark-checkbox').is(':checked') ? 'css/dark.css' : ''
		);
		u('#background-select').trigger('change');
	});

	u('#download-img-btn').on('click', () => {
		let link = document.createElement('a');
		link.download = `Rule ${u('#rule-num').html()}.png`;
		link.href = document.getElementById('cellular-canvas').toDataURL();
		link.click();
	});

	u('#fullscreen-canvas-btn').on('click', () => {
		let elm = document.getElementById('cellular-canvas');
		if (elm.requestFullscreen) {
			elm.requestFullscreen();
		} else if (elm.webkitRequestFullscreen) {
			elm.webkitRequestFullscreen();
		} else if (elm.msRequestFullscreen) {
			elm.msRequestFullscreen();
		}
	});

	u('#all-cellular-btn').on('click', () => {
		handleLoading(openPageWithAll);
	});

	// raw data

	u('#raw-data-btn').on('click', () => {
		if (u('#raw-data-btn').html().indexOf('Show') != -1) {
			u('#raw-data-btn').html('Hide Raw Data');
			u('#raw-data').css('display', 'block');
			u('#raw-data').first().scrollIntoView();
			u('#copy-raw-data-btn').css('display', 'inline-block');
			u('#download-raw-data-btn').css('display', 'inline-block');
		} else {
			u('#raw-data-btn').html('Show Raw Data');
			u('#raw-data').css('display', 'none');
			u('#copy-raw-data-btn').css('display', 'none');
			u('#download-raw-data-btn').css('display', 'none');
		}
	});

	u('#copy-raw-data-btn').on('click', () => {
		u('#raw-data').first().select();
		document.execCommand('copy');
	});
	u('#download-raw-data-btn').on('click', () => {
		downloadFile(u('#raw-data').val(), `rule ${u('#rule-num').html()}`);
	});

	// one details open at a time

	// https://stackoverflow.com/a/36994802/4907950
	const details = document.querySelectorAll('details');
	details.forEach((targetDetail) => {
		targetDetail.addEventListener('click', () => {
			// close details that aren't the target
			details.forEach((detail) => {
				if (detail !== targetDetail) {
					detail.removeAttribute('open');
				}
			});
		});
	});
};

// utility functions

function getVal(elmID) {
	let elm = u(`#${elmID}`);
	let val = verify(
		elm.val(),
		elm.attr('min'),
		elm.attr('max'),
		elm.attr('min')
	);
	elm.val(val);
	return val;
}

function verify(num, min, max, defaultVal) {
	num = Math.max(Math.min(parseInt(num), max), min);
	return isNaN(num) ? defaultVal : num;
}

// random int between min and max (inclusive)
const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

function downloadFile(str, fileName) {
	let file;
	let properties = { type: 'plain/text' };
	try {
		file = new File([str], fileName + '.txt', properties);
	} catch (err) {
		file = new Blob([str], properties);
	}

	let link = document.createElement('a');
	link.download = fileName + '.txt';
	link.href = URL.createObjectURL(file);
	link.click();
}

function handleLoading(func) {
	u('#loading-div').css('display', '');
	setTimeout(func, 10);
	setTimeout(() => u('#loading-div').css('display', 'none'), 10);
}

function openPageWithAll() {
	let newWindow = window.open('', '', 'width=400,height=400');
	newWindow.document.write('<div id="display"></div>');
	for (let ruleNum = 0; ruleNum < 256; ruleNum++) {
		drawCellularDisplay(
			ruleNum,
			u(newWindow.document.getElementById('display'))
		);
	}
}

function copyText(txt) {
	navigator.clipboard.writeText(txt).then(
		function () {
			u('#copied-span').html('Copied!');
		},
		function (err) {
			u('#copied-span').html('Error copying to clipboard');
			console.error('Could not copy text: ', err);
		}
	);
}
