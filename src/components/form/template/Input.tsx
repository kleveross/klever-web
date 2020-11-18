

import _ from 'lodash';
import React from 'react';
import { Input } from 'antd';

export default function input(props: any) {
  const { name, payload = {}, field, style, children, ...resetProps } = props;
  const { items = [], valueKey = 'value' } = payload;
  const customChildren = _.isArray(items) && _.size(items) > 0;

  if (customChildren) {
    return (
      <Input.Group {...resetProps} style={style}>
        {_.map(items, (item: any) => (
          <Input {...item} key={item[valueKey]} />
        ))}
      </Input.Group>
    );
  }

  return (
    <Input {...resetProps} style={_.assign({ width: 400 }, style)}>
      {children}
    </Input>
  );
}
