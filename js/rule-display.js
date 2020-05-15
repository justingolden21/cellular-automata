function drawRuleDisplay(ruleNum) {
	let ruleArray = getRuleArr(ruleNum);
	$('#rule-num').html(ruleNum);

	for(let i=0, j=7; i<8; i++, j--) {
		$('#display').append(getRuleSectionDisplay([Math.floor(j/4)%2, Math.floor(j/2)%2, j%2, ruleArray[i] ]) );
	}
	$('#display').append(`<p>${ruleArray.join('')}<sub>2</sub></p>`);
}

const COORDS = [
	{x:0,y:0},
	{x:1,y:0},
	{x:2,y:0},
	{x:1,y:1}
];

function getRuleSectionDisplay(arr) {
	let canvas = document.createElement('canvas');
	canvas.width = SQ_SIZE*3;
	canvas.height = SQ_SIZE*3;
	canvas.classList = 'rule-canvas';

	let ctx = canvas.getContext('2d');

	ctx.lineWidth = 2;
	ctx.strokeStyle = 'grey';

	for(let i=0; i<4; i++) {
		ctx.fillStyle = arr[i] == 1 ? 'black' : 'white';
		x = COORDS[i].x * SQ_SIZE;
		y = COORDS[i].y * SQ_SIZE;
		ctx.fillRect(x, y, SQ_SIZE, SQ_SIZE);
		ctx.strokeRect(x, y, SQ_SIZE, SQ_SIZE);
	}

	ctx.fillStyle = 'black';
	ctx.textAlign = 'center';
	ctx.font = `${SQ_SIZE}px Arial`;
	ctx.fillText(arr[3], 1.5*SQ_SIZE, 3*SQ_SIZE);

	return canvas;
}

/* @example
getRuleNum([0, 0, 0, 1, 1, 1, 1, 0])
30
*/
function getRuleNum(arr) {
	return parseInt(arr.join(''),2);
}

/* @example
getRuleArr(30)
[0, 0, 0, 1, 1, 1, 1, 0]
*/
function getRuleArr(num) {
	let arr = num.toString(2).split('').map(x=>parseInt(x) );
	return (new Array(8-arr.length).fill(0) ).concat(arr);
}