import _ from 'lodash';
import React from 'react';
import { TimePicker } from 'antd';

export default function timePicker(props: any) {
  const { name, payload, field, style, children, ...resetProps } = props;
  const { input } = field;

  return (
    <TimePicker
      {...resetProps}
      style={_.assign({ width: 200 }, style)}
      value={input.value === '' ? undefined : input.value}
    >
      {children}
    </TimePicker>
  );
}
