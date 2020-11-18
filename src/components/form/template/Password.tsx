

import _ from 'lodash';
import React from 'react';
import { Input } from 'antd';

export default function password(props: any) {
  const { name, payload, field, style, children, ...resetProps } = props;

  return (
    <Input.Password {...resetProps} style={_.assign({ width: 200 }, style)}>
      {children}
    </Input.Password>
  );
}
