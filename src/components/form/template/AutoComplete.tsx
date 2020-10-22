
import _ from 'lodash';
import React from 'react';
import { AutoComplete } from 'antd';

export default function autoComplete(props: any) {
  const { name, payload, field, style, children, ...resetProps } = props;

  return (
    <AutoComplete {...resetProps} style={_.assign({ width: 400 }, style)}>
      {children}
    </AutoComplete>
  );
}
