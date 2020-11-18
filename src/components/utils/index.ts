import _ from 'lodash';
import moment from 'moment';
import { DEFAULT_VALUE } from '@/components/utils/variable';

export function formatTime(
  value: string | number,
  format: string = 'YYYY-MM-DD HH:mm:ss',
) {
  if (!value) {
    return DEFAULT_VALUE;
  }
  return moment(value).format(format);
}

export function formatSize(value: string | number) {
  if (!value) {
    return DEFAULT_VALUE;
  }

  const inputNumber = _.toNumber(value) || 0;
  if (!inputNumber || _.isNaN(inputNumber)) {
    return '0 B';
  }
  if (0 < inputNumber && inputNumber < 1 << 10) {
    return `${inputNumber} B`;
  }
  if (1 << 10 <= inputNumber && inputNumber < 1 << 20) {
    return `${Number(inputNumber / (1 << 10)).toFixed(1)} KB`;
  }
  if (1 << 20 <= inputNumber && inputNumber < 1 << 30) {
    return `${Number(inputNumber / (1 << 20)).toFixed(1)} MB`;
  } else if (1 << 30 <= inputNumber) {
    return `${Number(inputNumber / (1 << 30)).toFixed(1)} GB`;
  }
  return `${inputNumber}`;
}
