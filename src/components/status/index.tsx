import _ from 'lodash';
import React from 'react';
import { Badge, Tooltip } from 'antd';
import { statusMap } from './config';

interface Iprops {
  value: string;
  module?: 'model' | 'serving';
  message?: string;
  prefix?: string;
}

export default function(props: Iprops) {
  const { value, message, prefix = '', module = 'model' } = props;
  const dataKey = _.toLower(value);
  const dataMap = statusMap[module];
  const statusColor = _.get(dataMap, [dataKey, 'status']) || '';
  const statusText = (_.get(dataMap, [dataKey, 'text']) || '').replace(
    '$1',
    prefix,
  );

  if (message && _.isEqual(dataKey, 'failed')) {
    return (
      <Tooltip title={message}>
        <Badge text={statusText} status={statusColor} />
      </Tooltip>
    );
  }

  return <Badge text={statusText} status={statusColor} />;
}
