let CELLULAR_WIDTH = 31;
let CELLULAR_HEIGHT = 20;

function drawCellularDisplay(ruleNum) {
	let ruleArray = getRuleArr(ruleNum);

	// init row at all 0s with a 1 in center
	let nextRow = new Array(CELLULAR_WIDTH).fill(0);
	nextRow[Math.floor(CELLULAR_WIDTH/2)] = 1;

	for(let i=0; i<CELLULAR_HEIGHT; i++) {
		$('#display').append(getCellularRowDisplay(nextRow) );
		nextRow = getNextRow(nextRow, ruleArray);
	}
}

// arr.length == CELLULAR_WIDTH
function getCellularRowDisplay(arr) {

	let canvas = document.createElement('canvas');
	canvas.width = SQ_SIZE*CELLULAR_WIDTH;
	canvas.height = SQ_SIZE*1;
	canvas.classList = 'row-canvas';

	let ctx = canvas.getContext('2d');

	ctx.lineWidth = 1;
	ctx.strokeStyle = '#66c';

	for(let i=0; i<CELLULAR_WIDTH; i++) {
		ctx.fillStyle = arr[i] == 1 ? 'black' : 'white';
		x = i * SQ_SIZE;
		y = 0;
		ctx.fillRect(x, y, SQ_SIZE, SQ_SIZE);
		ctx.strokeRect(x, y, SQ_SIZE, SQ_SIZE);
	}

	return canvas;
}

function getNextRow(currRow, ruleArr) {
	let newRow = [];
	for(let i=0; i<CELLULAR_WIDTH; i++) {
		let a = i==0? 0 : currRow[i-1];
		let b = currRow[i];
		let c = i==CELLULAR_WIDTH-1? 0 : currRow[i+1];
		newRow.push(getCell(a, b, c, ruleArr) );
	}
	return newRow;
}

function getCell(a, b, c, ruleArr) {
	let idx = parseInt([a, b, c].join(''), 2);
	return ruleArr[ruleArr.length - idx - 1];
}