let CELLULAR_WIDTH;
let CELLULAR_HEIGHT;

let nextRow;

function drawCellularDisplay(ruleNum, individualRows=false) {
	console.time('cellular draw');
	let ruleArray = getRuleArr(ruleNum);

	// init row at all 0s with a 1 in center
	nextRow = new Array(CELLULAR_WIDTH).fill(0);
	nextRow[Math.floor(CELLULAR_WIDTH/2)] = 1;

	const DO_STROKE = $('#grid-checkbox').is(':checked');
	let wrapMode = $('#edge-select').val();

	if(!individualRows) {

		let canvas = document.createElement('canvas');
		canvas.width = SQ_SIZE*CELLULAR_WIDTH;
		canvas.height = SQ_SIZE*CELLULAR_HEIGHT;
		canvas.classList = 'row-canvas';

		let ctx = canvas.getContext('2d');
		ctx.lineWidth = 1;
		ctx.strokeStyle = '#66c';

		for(let i=0; i<CELLULAR_HEIGHT; i++) {
			addRowToCanvas(ctx, i, nextRow, DO_STROKE);
			nextRow = getNextRow(nextRow, ruleArray, wrapMode);
		}
		$('#display').append(canvas);
	} else {
		for(let i=0; i<CELLULAR_HEIGHT; i++) {		
			$('#display').append(getCellularRowDisplay(nextRow, DO_STROKE) );
			nextRow = getNextRow(nextRow, ruleArray, wrapMode);
		}
	}
	console.timeEnd('cellular draw');
}

function nextFrame(ruleNum) {
	let ruleArray = getRuleArr(ruleNum);
	const DO_STROKE = $('#grid-checkbox').is(':checked');

	$('#display .row-canvas').first().remove();
	$('#display').append(getCellularRowDisplay(nextRow, DO_STROKE) );
	let wrapMode = $('#edge-select').val();
	nextRow = getNextRow(nextRow, ruleArray, wrapMode);
}

function addRowToCanvas(ctx, rowNum, arr, doStroke) {
	for(let i=0; i<CELLULAR_WIDTH; i++) {
		ctx.fillStyle = arr[i] == 1 ? 'black' : 'white';
		x = i * SQ_SIZE;
		y = rowNum * SQ_SIZE;
		ctx.fillRect(x, y, SQ_SIZE, SQ_SIZE);
		if(doStroke) {
			ctx.strokeRect(x, y, SQ_SIZE, SQ_SIZE);
		}
	}	
}

// arr.length == CELLULAR_WIDTH
function getCellularRowDisplay(arr, doStroke) {
	let canvas = document.createElement('canvas');
	canvas.width = SQ_SIZE*CELLULAR_WIDTH;
	canvas.height = SQ_SIZE*1;
	canvas.classList = 'row-canvas';

	let ctx = canvas.getContext('2d');
	ctx.lineWidth = 1;
	ctx.strokeStyle = '#66c';

	addRowToCanvas(ctx, 0, arr, doStroke);

	return canvas;
}

function getNextRow(currRow, ruleArr, wrapMode) {
	let newRow = [];
	for(let i=0; i<CELLULAR_WIDTH; i++) {
		let a = i!=0 ? currRow[i-1] : wrapMode=='wrap' ? currRow[CELLULAR_WIDTH-1] : wrapMode=='black' ? 1 : 0;
		let b = currRow[i];
		let c = i!=CELLULAR_WIDTH-1 ? currRow[i+1] : wrapMode=='wrap' ? currRow[0] : wrapMode=='black' ? 1 : 0;
		newRow.push(getCell(a, b, c, ruleArr) );
	}
	return newRow;
}

function getCell(a, b, c, ruleArr) {
	let idx = parseInt([a, b, c].join(''), 2);
	return ruleArr[ruleArr.length - idx - 1];
}