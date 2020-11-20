import _ from 'lodash';
import React from 'react';
import { DatePicker } from 'antd';

export default function datePicker(props: any) {
  const { name, payload, field, children, ...resetProps } = props;
  const { input } = field;

  return (
    <DatePicker
      {...resetProps}
      value={input.value === '' ? undefined : input.value}
    >
      {children}
    </DatePicker>
  );
}
