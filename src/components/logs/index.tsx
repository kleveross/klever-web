import _ from 'lodash';
import React from 'react';
import Log from '@/components/log/index';
import { Select, Card, Spin } from 'antd';
import { request, useRequest } from 'umi';

import './index.less';

interface ILogProps {
  filter: string;
  namespace: string;
}

function GetPods(params: ILogProps) {
  const { filter, namespace } = params;
  return request(`/api/v1alpha1/namespaces/${namespace}/pods`, {
    params: {
      filterBy: filter,
    },
  });
}

export default function(props: ILogProps) {
  const { namespace } = props;
  const { data, loading } = useRequest(() => GetPods(props));

  if (loading) {
    return <Spin />;
  }

  const podName = _.get(data, 'items.0.metadata.name');

  return (
    <Card className="log-root">
      <div className="log-header">
        <Select
          data-prefix="实例"
          style={{ width: 300 }}
          defaultValue={podName}
        >
          <Select.Option key={podName} value={podName}>
            {podName}
          </Select.Option>
        </Select>
      </div>
      <Log
        parse={(logData: any) =>
          _.map(_.get(logData, 'logs'), log => _.get(log, 'content'))
        }
        url={
          podName
            ? `/api/v1alpha1/namespaces/${namespace}/pods/${podName}/logs`
            : undefined
        }
      />
    </Card>
  );
}
