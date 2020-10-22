import _ from 'lodash';
import React from 'react';
import { Switch } from 'antd';

export default function switchComponent(props: any) {
  const { name, payload, field, children, ...resetProps } = props;
  const { input } = field;

  return (
    <Switch checked={!!input.value} {...resetProps}>
      {children}
    </Switch>
  );
}
