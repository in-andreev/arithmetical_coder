var Model = require('model.js');
var ArithmCoder = require('arithmcoder.js');

function decode_file(*ip, *fp) {
	var symbol;
	var eofSym;

	Model.initSymbols();
	eofSym = Model.eofSymbol();

	Model.loadInput(ip, 0);

	Model.startInput();

	while ((symbol = Model.getInput()) >= 0) {
		Model.encodeSymbol(symbol, 1);
	}

	ArithmCoder.startInputingBits();
	ArithmCoder.startDecoding();
	while((symbol = Model.decodeSymbol()) < eofSymb) {
		putChar(symbol);
	}
}


