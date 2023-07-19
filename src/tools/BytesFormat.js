const BYTE_UNITS = [
  'B',
  'kB',
  'MB',
  'GB',
  'TB',
  'PB',
  'EB',
  'ZB',
  'YB',
];

const BIBYTE_UNITS = [
  'B',
  'kiB',
  'MiB',
  'GiB',
  'TiB',
  'PiB',
  'EiB',
  'ZiB',
  'YiB',
];

const BIT_UNITS = [
  'b',
  'kbit',
  'Mbit',
  'Gbit',
  'Tbit',
  'Pbit',
  'Ebit',
  'Zbit',
  'Ybit',
];

const BIBIT_UNITS = [
  'b',
  'kibit',
  'Mibit',
  'Gibit',
  'Tibit',
  'Pibit',
  'Eibit',
  'Zibit',
  'Yibit',
];

const toLocaleString = (number, locale, options) => {
  let result = number;
  if (typeof locale === 'string' || Array.isArray(locale)) {
    result = number.toLocaleString(locale, options);
  } else if (locale === true || options !== undefined) {
    result = number.toLocaleString(undefined, options);
  }

  return result;
};

export default function bytesFormat(number, options) {
  if (!Number.isFinite(number)) {
    throw new TypeError(`Expected a finite number, got ${typeof number}: ${number}`);
  }

  // eslint-disable-next-line no-param-reassign
  options = {
    bits: false,
    binary: false,
    space: true,
    ...options,
  };
  // eslint-disable-next-line no-param-reassign,no-nested-ternary
  const UNITS = options.bits
    ? (options.binary ? BIBIT_UNITS : BIT_UNITS)
    : (options.binary ? BIBYTE_UNITS : BYTE_UNITS);

  const separator = options.space ? ' ' : '';

  if (options.signed && number === 0) {
    return ` 0${separator}${UNITS[0]}`;
  }

  const isNegative = number < 0;
  // eslint-disable-next-line no-param-reassign,no-nested-ternary
  const prefix = isNegative ? '-' : (options.signed ? '+' : '');

  if (isNegative) {
    // eslint-disable-next-line no-param-reassign
    number = -number;
  }

  let localeOptions;

  if (options.minimumFractionDigits !== undefined) {
    localeOptions = { minimumFractionDigits: options.minimumFractionDigits };
  }

  if (options.maximumFractionDigits !== undefined) {
    localeOptions = { maximumFractionDigits: options.maximumFractionDigits, ...localeOptions };
  }

  if (number < 1) {
    const numberString = toLocaleString(number, options.locale, localeOptions);
    return prefix + numberString + separator + UNITS[0];
  }

  const exponent = Math.min(Math.floor(options.binary ? Math.log(number) / Math.log(1024) : Math.log10(number) / 3), UNITS.length - 1);
  // eslint-disable-next-line no-param-reassign
  number /= (options.binary ? 1024 : 1000) ** exponent;

  if (!localeOptions) {
    // eslint-disable-next-line no-param-reassign
    number = number.toPrecision(3);
  }

  const numberString = toLocaleString(Number(number), options.locale, localeOptions);

  const unit = UNITS[exponent];

  return prefix + numberString + separator + unit;
}