import _ from 'lodash';
import React from 'react';
import { Tabs, Spin } from 'antd';
import Desc from '@/components/desc';
import { useParams, useLocation, useRequest } from 'umi';
import { GetVersion } from '@/pages/model/_action';

export default function Version(){
  const location = useLocation();
  const defaultParams: { name: string, model: string } = useParams();  
  const { data, loading, refresh } = useRequest(
    () => GetVersion(_.assign(defaultParams, {
      digest: _.get(location, 'query.digest'),
    })),
    {
      formatResult: (res: any) => _.map(
        _.get(res, 'extra_attrs'),
        (value, key) => ({
          label: key,
          value: _.isString(value) ? value : JSON.stringify(value),
        })
      ),
    }
  );

  return (
    <div className="klever-layout-page">
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="概览" key="1">
          {loading ? <Spin /> : <Desc data={data} />}
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
}

Version.title = (path: string, params: any) => ({
  name: params.version,
  path,
});

