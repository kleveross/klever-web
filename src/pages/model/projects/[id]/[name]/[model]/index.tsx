import _ from 'lodash';
import { Link, useParams, useRequest } from 'umi';
import React, { useState } from 'react';
import { DEFAULT_VALUE } from '@/components/utils/variable';
import { Table, Button, Tooltip } from 'antd';
import Transform from './_transform';
import { formatTime, formatSize } from '@/components/utils/index';
import { ListVersions, VersionInfo } from '@/pages/model/_action';

export default function Versions(){
  const defaultParams: { id: string, name: string, model: string } = useParams();
  const [ modelName, setModelName ] = useState({});
  const { data } = useRequest(() => VersionInfo(defaultParams.name, defaultParams.model));
  const total = _.parseInt(_.get(data, 'artifact_count', 0));
  const { tableProps, params, refresh } = useRequest(
    params => ListVersions(_.assign(params, defaultParams)),
    {
      ready: total > 0,
      paginated: true,
      defaultPageSize: 10,
      formatResult: (res: any) => {
        return {
          list: res,
          total,
        };
      },
    }
  );

  const columns = [
    {
      title: '版本',
      dataIndex: ['tags', '0', 'name'],
      key: 'name',
      render: (val: string, record: any) => {
        if(!val){
          return DEFAULT_VALUE;
        }
        return (
          <Link
            to={`/model/projects/${defaultParams.id}/${defaultParams.name}/${defaultParams.model}/${val}?digest=${_.get(record, 'digest')}`}
          >
            {val}
          </Link>
        );
      },
    },
    {
      title: 'Artifacts',
      dataIndex: 'digest',
      key: 'digest',
      render: (val: string) => _.size(val) <= 15 ? val : (
        <Tooltip title={val}>
          {val.substr(0, 15)}
        </Tooltip>
      ),
    },
    {
      title: '大小',
      dataIndex: 'size',
      key: 'size',
      render: (val: string) => formatSize(val),
    },
    {
      title: '推送时间',
      dataIndex: 'push_time',
      key: 'push_time',
      render: (val: string) => formatTime(val),
    },
    {
      title: '拉取时间',
      dataIndex: 'pull_time',
      key: 'pull_time',
      render: (val: string) => formatTime(val),
    },
    {
      title: '操作',
      key: 'action',
      render: (val: string, record: any) => {
        const disableFormats = ['caffemodel', 'h5', 'mxnetparams'];
        const formatValue = _.get(record, 'extra_attrs.format');
        const versionValue =  _.get(record, 'tags.0.name');
        const disabled = !versionValue || !_.includes(disableFormats, _.toLower(formatValue));

        return (
          <span>
            <Tooltip title={disabled ? '不支持模型转换' : undefined}>
              <Button
                size="small"
                disabled={disabled}
                onClick={() => setModelName({
                  format: formatValue,
                  version: versionValue,
                })}
              >
                模型转换
              </Button>
            </Tooltip>
          </span>
        );
      },
    },
  ];
  
  return (
    <div className="klever-layout-list">
      <Transform
        title="模型转换"
        params={defaultParams}
        format={_.get(modelName, 'format')}
        version={_.get(modelName, 'version')}
        onCancel={() => setModelName({})}
        onSuccess={() => setModelName({})}
      />
      <Table
        columns={columns}
        rowKey="digest"
        {...tableProps}
        pagination={{
          showQuickJumper: true,
          showSizeChanger: true,
          ...tableProps.pagination,
        }}
       />
    </div>
  );
}

Versions.title = (path: string, params: any) => ({
  name: params.model,
  path,
});
