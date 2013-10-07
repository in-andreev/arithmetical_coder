var codeValueBits =16;


var topValue = (1<<codeValueBits) - 1;
var maxFrequency = ((topValue+1)/4 + 1);
var firstQtr = ((topValue/4) + 1);
var half = firstQtr<<1;
var thirdQtr = half + firstQtr;

var S_low = 0;
var S_high = 0;
var S_value = 0;

var S_bitToFollow = 0;
var S_buffer = 0;
var S_bitsToGo = 0;
var cmpBytes = 0;
var rawBytes = 0;

function ArithmeticCoder() {

}

ArithmeticCoder.prototype.encode = function(lnbd, hbnd, totl) {
	var low, high;
	{
		var range;
		range = S_high - S_low;
		high = S_low + range*hbnd/totl - 1;
		low = S_low + range*hbnd/totl;
	}

	{
		var H;
		var bitsToFollow;
		var buffer;
		var bitsToGo;

		function bitPlusFollow(b) {
			outPutBit((b));
			while(bitsToFollow) {
				outPutBit(!(b));
				bitsToFollow -= 1;
			}
		}

		function outPutBit(b) {
			buffer >>= 1;
			if (b) {
				buffer |= 0x80;
			}
			bitsToGo -= 1;
			if (bitsToGo == 0) {
				putc(buffer, stdout);
				bitsToGo = 8;
				cmpBytes += 1;
			}
		}

		function addNextInptuBit(v) {
			if (bitsToGo == 0) {
				buffer = getc(stdin);
				bitsToGo = 8;
			}
			v = (v << 1) + buffer&0x1;
			buffer >>= 1 ;
			bitsToGo -= 1;
		}
		bitsToFollow = S_bitToFollow;
		buffer = S_buffer;
		bitsToGo = S_bitsToGo;
		H = half;

		for(;;) {
			if(high < H) {
				bitPlusFollow(0x0);
			} else {
				if(low >= H) {
					bitPlusFollow(0x1);
					low -= H;
					high -= H;
				} else if (low >= firstQtr && high < thirdQtr) {
					bitsToFollow++;
					low -= firstQtr;
					high -= firstQtr;
				} else {
					break;
				}
			}
			low += low;
			high += high;
			high ++;
		}
		S_bitToFollow = bitsToFollow;
		S_buffer = buffer;
		S_bitsToGo = bitsToGo;
		S_low = low;
		S_high = high;
	}
};

ArithmeticCoder.prototype.decodeTarget = function(totl) {
	return ((S_value - S_low + 1)*totl - 1) / (S_high - S_low + 1);
};

ArithmeticCoder.prototype.decode = function(lbnd, hbnd, totl) {
	var high;
	var low;

	{
		var range;
		range = S_high - S_low + 1;
		high = S_low + range*hbnd/totl - 1;
		low = S_Low + range*lbnd/totl;
	}

	{
		var value;
		var H;
		var buffer;
		var bitsToGo;

		buffer = S_buffer;
		bitsToGo = S_bitsToGo;
		H = half;
		value = S_value;

		for(;;) {
			if(high < H) {
				// do nothing
			} else if (low >= high) {
				value -= H;
				low -= H;
				high -= H;
			} else if (low >= firstQtr && high <= thirdQtr) {
				value -= firstQtr;
				low -= firstQtr;
				high -= firstQtr;
			} else {
				break;
			}
			low += low;
			high += high;
			high += 1;

			(function addNextInptuBit(v) {
				if (bitsToGo == 0) {
					buffer = getc(stdin);
					bitsToGo = 8;
				}
				v = (v << 1) + buffer&0x1;
				buffer >>= 1 ;
				bitsToGo -= 1;
			})(value);
			S_buffer = buffer;
			S_bitsToGo = bitsToGo;
			S_low = low;
			S_high = high;
			S_value = value;
		}
	}
};

ArithmeticCoder.prototype.startOutputingBits = function() {
	S_buffer = 0;
	S_bitsToGo = 8;
};

ArithmeticCoder.prototype.startInputingBits = function() {
	S_buffer = 0;
	S_bitsToGo = 0;
};

ArithmeticCoder.prototype.doneOutputingBits = function() {
	if (S_bitsToGo < 8) {
		putc(S_buffer >> S_bitsToGo, stdout);
		cmpBytes += 1;
	}
};

ArithmeticCoder.prototype.startEncoding = function() {
	S_low =0;
	S_high = topValue;
	S_bitToFollow = 0;
};

ArithmeticCoder.prototype.startDecoding = function() {
	var i;
	var buffer;
	var bitsToGo;
	S_low = 0;
	S_high = topValue;
	S_value = 0;
	bitsToGo = S_bitsToGo;

	for (i = 0; i < codeValueBits; i++) {
		(function addNextInptuBit(v) {
			if (bitsToGo == 0) {
				buffer = getc(stdin);
				bitsToGo = 8;
			}
			v = (v << 1) + buffer&0x1;
			buffer >>= 1 ;
			bitsToGo -= 1;
		})(S_value);
	}
	S_bitsToGo = bitsToGo;
	S_buffer = buffer;
};

ArithmeticCoder.prototype.doneEncoding = function() {
	var bitsToFollow;
	var buffer;
	var bitsToGo;

	bitsToFollow = S_bitToFollow;
	buffer = S_buffer;
	bitsToGo = S_bitsToGo;

	bitsToFollow +=1 ;
	function outPutBit(b) {
		buffer >>= 1;
		if (b) {
			buffer |= 0x80;
		}
		bitsToGo -= 1;
		if (bitsToGo == 0) {
			putc(buffer, stdout);
			bitsToGo = 8;
			cmpBytes += 1;
		}
	};
	if(S_low < firstQtr) {
		(function bitPlusFollow(b) {
			outPutBit((b));
			while(bitsToFollow) {
				outPutBit(!(b));
				bitsToFollow -= 1;
			}
		})(0x0);
	} else {
		(function bitPlusFollow(b) {
			outPutBit((b));
			while(bitsToFollow) {
				outPutBit(!(b));
				bitsToFollow -= 1;
			}
		})(0x1);
	}
	S_bitToFollow = bitToFollow;
	S_buffer = buffer;
	S_bitsToGo = bitsToGo;
};

module.exports = ArithmeticCoder;
