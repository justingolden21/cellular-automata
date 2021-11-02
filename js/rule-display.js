function drawRuleDisplay(ruleNum) {
	let ruleArray = getRuleArr(ruleNum);
	u('#rule-num').html(ruleNum);

	for (let i = 0, j = 7; i < 8; i++, j--) {
		u('#display').append(
			getRuleSectionDisplay([
				Math.floor(j / 4) % 2,
				Math.floor(j / 2) % 2,
				j % 2,
				ruleArray[i],
			])
		);
	}
	u('#display').append(`<p>${ruleArray.join('')}<sub>2</sub></p>`);
	let classification = getRuleClassification(ruleNum);
	u('#display').append(
		`<p>Class ${classification} &mdash; ${getClassificationDescription(
			classification
		)}</p>`
	);

	// equivalent rules
	let equivalentRules = getEquivalentRules(ruleNum);
	if (equivalentRules.length > 0) {
		let ruleLinks = '';
		for (let equRule of equivalentRules) {
			ruleLinks += `<a onclick="u('#rule-num-input').val(${equRule}).trigger('change')">${equRule}</a>, `;
		}
		ruleLinks = ruleLinks.substring(0, ruleLinks.length - 2); // remove last comma
		u('#display').append(
			`<p>Equivalent to rule${
				equivalentRules.length > 1 ? 's' : ''
			} ${ruleLinks} </p>`
		);
	}
    console.log(ruleNum)
    if(ruleNum == 30) u('#display').append('<p><b>Solve a Rule 30 problem to win $10,000: <a target="_blank" href="https://www.rule30prize.org/">Rule 30 Prize</a></b></p>');
	u('#display').append('<hr>');
}

const COORDS = [
	{ x: 0, y: 0 },
	{ x: 1, y: 0 },
	{ x: 2, y: 0 },
	{ x: 1, y: 1 },
];

function getRuleSectionDisplay(arr) {
	const SQ_SIZE = 10;

	let canvas = document.createElement('canvas');
	canvas.width = SQ_SIZE * 3;
	canvas.height = SQ_SIZE * 3;
	canvas.classList = 'rule-canvas';

	let ctx = canvas.getContext('2d');

	ctx.fillStyle = 'white';
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	ctx.lineWidth = 1;
	ctx.strokeStyle = '#66c';

	const DO_STROKE = u('#grid-checkbox').is(':checked');

	for (let i = 0; i < 4; i++) {
		ctx.fillStyle = arr[i] == 1 ? 'black' : 'white';
		x = COORDS[i].x * SQ_SIZE;
		y = COORDS[i].y * SQ_SIZE;
		ctx.fillRect(x, y, SQ_SIZE, SQ_SIZE);
		if (DO_STROKE) {
			ctx.strokeRect(x, y, SQ_SIZE, SQ_SIZE);
		}
	}

	ctx.fillStyle = 'black';
	ctx.textAlign = 'center';
	ctx.font = `${SQ_SIZE}px Arial`;
	ctx.fillText(arr[3], 1.5 * SQ_SIZE, 3 * SQ_SIZE);

	return canvas;
}

/* @example
getRuleNum([0, 0, 0, 1, 1, 1, 1, 0])
30
*/
function getRuleNum(arr) {
	return parseInt(arr.join(''), 2);
}

/* @example
getRuleArr(30)
[0, 0, 0, 1, 1, 1, 1, 0]
*/
function getRuleArr(num) {
	let arr = num
		.toString(2)
		.split('')
		.map((x) => parseInt(x));
	return new Array(8 - arr.length).fill(0).concat(arr);
}
