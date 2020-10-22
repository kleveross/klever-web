import _ from 'lodash';
import React from 'react';
import { Badge, Tooltip } from 'antd';

interface Iprops {
  value: string;
  message?: string;
  prefix?: string;
}

export default function(props: Iprops) {
  const { value, message, prefix = '' } = props;
  const dataKey = _.toLower(value);
  const dataMap = {
    pending: {
      status: 'default',
      text: '等待中',
    },
    running: {
      status: 'processing',
      text: `${prefix}中`,
    },
    deleting: {
      status: 'warning',
      text: '删除中',
    },
    succeeded: {
      status: 'success',
      text: `${prefix}成功`,
    },
    failed: {
      status: 'error',
      text: `${prefix}失败`,
    },
  };

  if (message && _.isEqual(dataKey, 'failed')) {
    return (
      <Tooltip title={message}>
        <Badge
          status={_.get(dataMap, [dataKey, 'status'])}
          text={_.get(dataMap, [dataKey, 'text'])}
        />
      </Tooltip>
    );
  }

  return (
    <Badge
      status={_.get(dataMap, [dataKey, 'status'])}
      text={_.get(dataMap, [dataKey, 'text'])}
    />
  );
}
