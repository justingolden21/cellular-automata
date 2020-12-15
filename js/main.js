let SQ_SIZE;

$( ()=> {
	// https://stackoverflow.com/a/3540295/4907950
	SQ_SIZE = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? 10: 20;
	$('#size-input').val(SQ_SIZE);

	function redraw() {
		let num = parseInt($('#rule-num-input').val() );
		num = verify(num, 0, 255, 0);
		$('#rule-num-input').val(num);

		let width = parseInt($('#width-input').val() );
		width = verify(width, 10, 100, 35);
		CELLULAR_WIDTH = width;
		$('#width-input').val(width);
		let height = parseInt($('#height-input').val() );
		height = verify(height, 10, 100, 20);
		CELLULAR_HEIGHT = height;
		$('#height-input').val(height);
		let size = parseInt($('#size-input').val() );
		size = verify(size, 2, 30, 10);
		SQ_SIZE = size;
		$('#size-input').val(size);

		$('#display').html('');
		drawRuleDisplay(num);
		drawCellularDisplay(num);
		document.title = `Cellular Automata - Rule ${num}`;
	}

	$('input').change(redraw);
	$('#rule-num-input').select().change();

	$('#random-btn').click( ()=> {
		$('#rule-num-input').val(random(0,255) ).change();
	});
});

function verify(num, min, max, defaultVal) {
	num = Math.max(Math.min(parseInt(num),max),min);
	return isNaN(num) ? defaultVal : num;
}

// random int between min and max (inclusive)
const random = (min, max) => Math.floor(Math.random() * (max - min + 1) ) + min;