import _ from 'lodash';
import { DEFAULT_VALUE } from '@/components/utils/variable';

type DescType = Array<{
  label: string;
  value: string;
}>;

function childValue(data: any, target: DescType) {
  _.forEach(data, (value, key) => {
    if (_.isString(value)) {
      target.push({
        label: key,
        value: value || DEFAULT_VALUE,
      });
    } else {
      childValue(value, target);
    }
  });
}

export function flatData(data: any) {
  const descData: DescType = [];
  childValue(data, descData);
  return descData;
}
