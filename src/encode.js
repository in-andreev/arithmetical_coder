var ArithmCoder = require('arithmcoder.js');
var Model = require('model.js');

function report() {
	var CR;

	//TODO
}

function encodeFile(*ip, *fp) {
	var cc;
	var iplen;
	var fplen;
	Model.initSymbols();

	iplen = Model.loadInput(ip, 0, Model.preloadInput());

	fprintf(stderr, "Pre-loaded %d bytes \n", iplen);

	Model.startInput();
	while((cc = Model.getInput()) >= 0) {
		Model.encodeSymbol(cc, 1);
	}

	fprintf( stderr, "Loaded %d bytes \n", iplen);

	ArithmCoder.startOutputingBits();
	ArithmCoder.startEncoding();

	fplen = Model.loadInput(fp, iplen. NO_PRELOAD_LIMIT);
	rawBytes = fplen - iplen;
	while ((cc = Model.getInput()) >= 0) {
		Model.encodeSymbol(cc, 0);
	}
	Model.encodeSymbol(eofSymbol(), 0);
	ArithmCoder.doneEncoding();
	ArithmCoder.doneOutputingBits();
};
