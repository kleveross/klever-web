import _ from 'lodash';
import React from 'react';
import { Checkbox } from 'antd';

export default function checkbox(props: any) {
  const { name, payload = {}, field, children, ...resetProps } = props;
  const { input } = field;
  const { items = [], nameKey = 'name', valueKey = 'value' } = payload;
  const customChildren = _.isArray(items) && _.size(items) > 0;

  if (customChildren) {
    return (
      <Checkbox.Group
        {...resetProps}
        // 兼容 CheckboxGroup 的值，它的值需要是一个数组类型
        value={
          _.isArray(input.value)
            ? input.value
            : input.value
            ? [input.value]
            : []
        }
      >
        {_.map(items, (item: any) => (
          <Checkbox {...item} value={item[valueKey]} key={item[valueKey]}>
            {item[nameKey]}
          </Checkbox>
        ))}
      </Checkbox.Group>
    );
  }

  return (
    <Checkbox checked={!!input.value} {...resetProps}>
      {children}
    </Checkbox>
  );
}
