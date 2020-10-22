

import _ from 'lodash';
import React from 'react';
import { Radio } from 'antd';

export default function radio(props: any) {
  const { name, payload = {}, field, children, ...resetProps } = props;
  const { items = [], type, nameKey = 'name', valueKey = 'value' } = payload;
  const customChildren = _.isArray(items) && _.size(items) > 0;

  if (customChildren) {
    const RadioItem = type === 'button' ? Radio.Button : Radio;
    return (
      <Radio.Group {...resetProps}>
        {_.map(items, (item: any) => (
          <RadioItem {...item} value={item[valueKey]} key={item[valueKey]}>
            {item[nameKey]}
          </RadioItem>
        ))}
      </Radio.Group>
    );
  }

  return <Radio {...resetProps}>{children}</Radio>;
}
