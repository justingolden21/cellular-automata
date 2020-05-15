let SQ_SIZE;

$( ()=> {
	// https://stackoverflow.com/a/3540295/4907950
	SQ_SIZE = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? 10: 20;

	$('#rule-num-input').select();
	$('#rule-num-input').change( ()=> {
		let num = parseInt($('#rule-num-input').val() );
		num = verify(num, 0, 255, 0);
		$('#rule-num-input').val(num);

		$('#display').html('');
		drawRuleDisplay(num);
		drawCellularDisplay(num);
		document.title = `Cellular Automata - Rule ${num}`;
	}).change();

	$('#random-btn').click( ()=> {
		$('#rule-num-input').val(random(0,255) ).change();
	});
	$('#enter-btn').click($('#rule-num-input').change);
});

function verify(num, min, max, defaultVal) {
	num = Math.max(Math.min(parseInt(num),max),min);
	return isNaN(num) ? defaultVal : num;
}

// random int between min and max (inclusive)
const random = (min, max) => Math.floor(Math.random() * (max - min + 1) ) + min;