$( ()=> {
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
});

function verify(num, min, max, defaultVal) {
	num = Math.max(Math.min(parseInt(num),max),min);
	return isNaN(num) ? defaultVal : num;
}