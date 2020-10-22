import _ from 'lodash';
import React from 'react';
import { InputNumber } from 'antd';

export default function inputNumber(props: any) {
  const { name, payload, field, style, children, ...resetProps } = props;

  return (
    <InputNumber {...resetProps} style={_.assign({ width: 100 }, style)}>
      {children}
    </InputNumber>
  );
}
