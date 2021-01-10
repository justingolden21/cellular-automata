let CELLULAR_WIDTH;
let CELLULAR_HEIGHT;

function drawCellularDisplay(ruleNum, display=$('#display') ) {
	console.time('cellular draw');

	let nextRow;
	let ruleArray = getRuleArr(ruleNum);

	const RANDOM_INITIAL = $('#initial-checkbox').is(':checked');
	const DO_STROKE = $('#grid-checkbox').is(':checked');
	const WRAP_MODE = $('#edge-select').val();

	if(!RANDOM_INITIAL) {	
		// init row at all 0s with a 1 in center
		nextRow = new Array(CELLULAR_WIDTH).fill(0);
		nextRow[Math.floor(CELLULAR_WIDTH/2)] = 1;
	} else {
		// init row with random 1s and 0s
		nextRow = [];
		for(let i=0; i<CELLULAR_WIDTH; i++) {
			nextRow[i] = Math.random() > 0.5 ? 1 : 0;
		}
	}

	let canvas = document.createElement('canvas');
	canvas.width = SQ_SIZE*CELLULAR_WIDTH;
	canvas.height = SQ_SIZE*CELLULAR_HEIGHT;
	canvas.id = 'cellular-canvas';
	canvas.title = 'Rule ' + ruleNum;

	let ctx = canvas.getContext('2d');
	ctx.lineWidth = 1;
	ctx.strokeStyle = '#66c';

	let rows = [];

	for(let i=0; i<CELLULAR_HEIGHT; i++) {
		addRowToCanvas(ctx, i, nextRow, DO_STROKE);
		rows.push(nextRow);
		nextRow = getNextRow(nextRow, ruleArray, WRAP_MODE);
	}
	display.append(canvas);

	$('#raw-data').val(rows.join('\n') );

	console.timeEnd('cellular draw');
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
