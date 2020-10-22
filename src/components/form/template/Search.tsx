import _ from 'lodash';
import React from 'react';
import { Input } from 'antd';

export default function search(props: any) {
  const { name, payload, field, style, children, ...resetProps } = props;

  return (
    <Input.Search {...resetProps} style={_.assign({ width: 200 }, style)}>
      {children}
    </Input.Search>
  );
}
