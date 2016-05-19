'use strict';

const DEFAULT_LOCALE = 'en';
const NO_VALUE = -1;
const DECIMAL_SEPARATOR = '.';
const UNION_SEPARATOR = '-';
const GROUP_SEPARATOR = ' ';


module.exports = class NumberToWords {

  constructor(locale) {
    this._locale = locale || DEFAULT_LOCALE;
  }


  getLocaleData() {
    return require('./locales/' + this._locale);
  }


  toWords(n) {
    var data = this.getLocaleData();

    if (typeof n !== 'string') {
      n = n.toString();
    }

    // TODO : test number and reject if invalid

    return defaultProcessor(n, data);
  }


  toOrdinal(n) {
    throw new Error('Not implemented');
  }

}



function defaultProcessor(n, data) {
  let maxScale = Math.max.apply(Math, Object.keys(data.scale).map(Number));
  let processor = compositeProcessor(maxScale);
  let buffer = '';
  let negative = false;
  let decimalsPosition;
  let decimals;

  if (n.startsWith("-")) {
    negative = true;
    n = n.substr(1);
  }

  decimalsPosition = n.indexOf(DECIMAL_SEPARATOR);
  if (decimalsPosition >= 0) {
    decimals = n.substring(decimalsPosition + 1);
    n = n.substr(0, decimalsPosition);
  }

  buffer = processor(n, data);

  if (!buffer.length) {
    buffer = data.units[0];
  } else if (negative) {
    buffer = data.minus + GROUP_SEPARATOR + buffer;
  }

  if (decimals) {
    buffer = buffer + GROUP_SEPARATOR + data.union + GROUP_SEPARATOR.concat(SEPARATOR)
           + processor(decmals, data) + GROUP_SEPARATOR + data.scale['-' + decimals.length];
  }

  return buffer;
}


// convert big numbers
function compositeProcessor(exponent) {
  let highProcessor = hundredProcessor;
  let lowProcessor = exponent > 3 ? compositeProcessor(exponent - 3) : hundredProcessor;

  return function processor(n, data) {
    let buffer = '';
    let highName;
    let lowName;

    if (n.length < exponent) {
      highName = '';
      lowName = lowProcessor(n, data);
    } else {
      let index = n.length - exponent;
      highName = highProcessor(n.substr(0, index), data);
      lowName = lowProcessor(n.substr(index), data);
    }

    if (highName.length) {
      buffer = buffer + highName + GROUP_SEPARATOR + data.scale[exponent];

      if (lowName.length) {
        buffer = buffer + GROUP_SEPARATOR
      }
    }

    if (lowName.length) {
      buffer = buffer + lowName;
    }

    return buffer;
  };
}


// convert hundreds
function hundredProcessor(n, data) {
  let buffer = '';
  let number;
  let tensName;

  if (!n.length) {
    number = 0;
  } else if (n.length > 4) {
    number = parseInt(n.substr(n.length - 4), 10);
  } else {
    number = parseInt(n, 10);
  }

  number %= 1000;  // keep at least three digits

  if (number >= 100) {
    buffer = unitProcessor(n / 100, data) + GROUP_SEPARATOR + data.scale["2"];
  }

  tensName = tensProcessor(n % 100, data);

  if (tensName.length && buffer.length) {
    buffer = buffer + GROUP_SEPARATOR;
  }
  buffer = buffer + tensName;

  return buffer;
}


// convert tens
function tensProcessor(n, data) {
  let buffer = '';
  let tensFound = false;
  let number;

  if (n.length > 3) {
    number = parseInt(n.substr(n.length - 3), 10);
  } else {
    number = parseInt(n, 10);
  }

  number %= 100;   // keep only two digits

  if (number >= 20) {
    buffer = data.tens[((number / 10) | 0) - 2];
    number %= 10;
    tensFound = true;
  } else {
    number %= 20;
  }

  if (number) {
    if (tensFound) {
      buffer = buffer + UNION_SEPARATOR;
    }
    buffer = buffer + unitProcessor(number.toString(), data);
  }

  return buffer;
}


// convert single units
function unitProcessor(n, data) {
  let offset = NO_VALUE;
  let number;

  if (n.length > 3) {
    number = parseInt(n.substr(n.length - 3), 10);
  } else {
    number = parseInt(n, 10);
  }

  number %= 100;

  if (number < 10) {
    offset = (number % 10);
    //number /= 10;
  } else if (number < 20) {
    offset = (number % 20);
    //number /= 100;
  }

  if (offset !== NO_VALUE && offset < data.units.length) {
    return data.units[offset];
  } else {
    return '';
  }
}