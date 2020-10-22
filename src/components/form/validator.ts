import _ from 'lodash';

export const required = (val: any) => {
  if (_.isBoolean(val)) {
    return;
  }
  if (_.isNumber(val)) {
    return;
  }
  if (
    !val ||
    _.isEmpty(val) ||
    (_.isArray(val) && _.join(val, '').length <= 0)
  ) {
    return '不能为空';
  }
};
