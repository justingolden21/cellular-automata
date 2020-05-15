$( ()=> {
	$('#rule-num-input').select();
	$('#rule-num-input').change( ()=> {
		let num = parseInt($('#rule-num-input').val() );

		$('#display').html('');
		drawRuleDisplay(num);
		drawCellularDisplay(num);

		document.title = `Cellular Automata - Rule ${num}`;
	}).change();
});