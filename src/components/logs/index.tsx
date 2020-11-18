import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import Log from '@/components/log/index';
import { Select, Card, Spin } from 'antd';
import { request, useRequest } from 'umi';

import './index.less';

interface ILogProps {
  id: string;
  namespace: string;
}

function GetPods(params: ILogProps) {
  const { id, namespace } = params;
  return request(`/api/v1alpha1/namespaces/${namespace}/pods`, {
    params: {
      filterBy: `job-name:${id}`,
    },
  });
}

export default function(props: ILogProps) {
  const { namespace } = props;
  const [pod, setPod] = useState('');
  const { data, loading } = useRequest(() => GetPods(props));
  const firstPod = _.get(data, 'items.0.metadata.name');

  useEffect(() => {
    firstPod && setPod(firstPod);
  }, [firstPod]);

  if (loading) {
    return <Spin />;
  }

  return (
    <Card className="log-root">
      <div className="log-header">
        <Select
          data-prefix="实例"
          style={{ width: 300 }}
          defaultValue={firstPod}
          onChange={(val: string) => setPod(val)}
        >
          {_.map(_.get(data, 'items'), item => {
            const name = _.get(item, 'metadata.name');
            // const status = _.get(item, 'status.phase');
            return (
              <Select.Option key={name} value={name}>
                {name}
              </Select.Option>
            );
          })}
        </Select>
      </div>
      <Log
        parse={(logData: any) =>
          _.map(_.get(logData, 'logs'), log => _.get(log, 'content'))
        }
        url={
          pod
            ? `/api/v1alpha1/namespaces/${namespace}/pods/${pod}/logs`
            : undefined
        }
      />
    </Card>
  );
}
