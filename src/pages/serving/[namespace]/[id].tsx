import _ from 'lodash';
import React from 'react';
import { useParams, useRequest } from 'umi';
import { Tabs, Spin } from 'antd';
import Log from '@/components/logs';
import Yaml from '@/components/yaml';
import Desc from '@/components/desc';
import Event from '@/components/event';
import Interface from './_interface';
import { flatData } from '@/components/desc/utils';
import { GetServing } from '@/pages/serving/_action';

export default function ServingDetail(){
  const defaultParams: { id: string, namespace: string } = useParams();
  const queryID = _.get(defaultParams, 'id');
  const namespace = _.get(defaultParams, 'namespace');
  const { data, loading } = useRequest(() => GetServing(namespace, queryID));

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
            id={queryID}
            module="servings"
            namespace={namespace}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="日志" key="log">
          <Log
            namespace={namespace}
            filter={`seldon-app=${queryID}-${_.get(data, 'spec.predictors.0.graph.name')}`}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="YAML" key="yaml">
          <Yaml
            data={data}
            name={queryID}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="接口" key="interface">
          <Interface
            url={`http://master_ip:31380/seldon/${namespace}/${queryID}/v2/models/${queryID}`}
          />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
}

ServingDetail.title = (path: string, params: any) => ({
  name: params.id,
  path,
});
