

import _ from 'lodash';
import React from 'react';
import { Input } from 'antd';

export default function textArea(props: any) {
  const { name, payload, field, style, children, ...resetProps } = props;

  return (
    <Input.TextArea
      rows={4}
      {...resetProps}
      style={_.assign({ width: 400, resize: 'none' }, style)}
    >
      {children}
    </Input.TextArea>
  );
}
