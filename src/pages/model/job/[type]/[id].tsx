import _ from 'lodash';
import React from 'react';
import { useParams, useRequest } from 'umi';
import { Tabs, Spin } from 'antd';
import Log from '@/components/logs';
import Yaml from '@/components/yaml';
import Desc from '@/components/desc';
import Event from '@/components/event';
import { flatData } from '@/components/desc/utils';
import { GetModelJob } from '@/pages/model/_action';

export default function JobList(){  
  const defaultParams: { id: string } = useParams();
  const { data, loading } = useRequest(() => GetModelJob(defaultParams.id));

  if(loading){
    return <Spin />;
  }

  return (
    <div className="klever-layout-page">
      <Tabs defaultActiveKey="overview">
        <Tabs.TabPane tab="概览" key="overview">
          <Desc data={flatData(data)} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="事件" key="event">
          <Event
            id={defaultParams.id}
            namespace={_.get(data, 'metadata.namespace')}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="日志" key="log">
          <Log
            id={defaultParams.id}
            namespace={_.get(data, 'metadata.namespace')}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="YAML" key="yaml">
          <Yaml
            data={data}
            name={defaultParams.id}
          />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
}

JobList.title = (path: string, params: any) => ({
  name: params.id,
  path,
});
