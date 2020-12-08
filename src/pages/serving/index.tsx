import _ from 'lodash';
import React from 'react';
import { Link, useRequest } from 'umi';
import { Table } from 'antd';
import Add from './_add';
import Status from '@/components/status';
import { ListServings } from './_action';
import { DEFAULT_VALUE } from '@/components/utils/variable';

export default function Servings() {
  const { tableProps, refresh } = useRequest(params => ListServings(params), {
    paginated: true,
    defaultPageSize: 10,
    formatResult: (res: any) => ({
      list: _.get(res, 'items') || [],
      total: _.get(res, 'metadata.totalItems') || 0,
    }),
  });

  const columns = [
    {
      title: '服务名',
      dataIndex: ['metadata', 'name'],
      key: 'name',
      width: '20%',
      render: (val: string, record: any) => (
        <Link
          style={{ wordBreak: 'break-all' }}
          to={`/serving/${_.get(record, 'metadata.namespace')}/${val}`}
        >
          {val}
        </Link>
      ),
    },
    {
      title: '模型',
      dataIndex: ['spec', 'predictors', '0', 'graph', 'modelUri'],
      key: 'model',
      width: '20%',
      render: (val: string) => {
        if (!val) {
          return DEFAULT_VALUE;
        }
        return val.split('harbor-system/').pop() || DEFAULT_VALUE;
      },
    },
    {
      title: '模型格式',
      dataIndex: ['spec', 'predictors', '0', 'graph'],
      key: 'format',
      width: '20%',
      render: (val: any) => {
        const parameters = _.get(val, 'parameters') || [];
        const formatParameter = _.find(parameters, ['name', 'format']);
        return _.get(formatParameter, 'value') || DEFAULT_VALUE;
      },
    },
    {
      title: '模型服务器',
      dataIndex: 'repo_count',
      key: 'repo_count',
      width: '20%',
      render: (val: string) => val || DEFAULT_VALUE,
    },
    {
      title: '服务状态',
      dataIndex: ['status', 'state'],
      key: 'repo_count',
      render: (val: string, record: any) => {
        const message = _.get(record, 'status.message');

        return <Status module="serving" value={val} message={message} />;
      },
    },
  ];

  return (
    <div className="klever-layout-list">
      <Add onSuccess={refresh}>创建服务</Add>
      <Table
        columns={columns}
        rowKey="project_id"
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

Servings.title = (path: string) => ({
  name: '在线服务',
  path,
});
