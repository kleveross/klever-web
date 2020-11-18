import _ from 'lodash';
import React from 'react';
import { Table } from 'antd';
import Status from '@/components/status';
import { Link, useRequest, useParams } from 'umi';
import { ListModelJobs } from '@/pages/model/_action';
import { DEFAULT_VALUE } from '@/components/utils/variable';

export default function JobLists(props: any) {
  const hookParams = useParams();
  const type = _.get(hookParams, 'type');
  const convert = type === 'convert';
  const { tableProps, refresh } = useRequest(param => ListModelJobs({
    ...param,
    type,
  }), {
    paginated: true,
    defaultPageSize: 10,
    refreshDeps: [ type ],
    formatResult: (res: any) => {
      return {
        list: _.get(res, 'items') || [], 
        total: _.get(res, 'metadata.totalItems', 0),
      };
    },
  });

  const columns = [
    {
      title: '任务名',
      dataIndex: [ 'metadata', 'name' ],
      render: (val: string) => <Link to={`/model/job/${type}/${val}`}>{val}</Link>,
    },
    {
      title: '待解析模型',
      dataIndex: ['spec', 'model'],
      width: convert ? '20%' : '30%',
      render: (val: string) => {
        const model = _.split(val, '/');
        model.shift();
        return _.join(model, '/');
      },
    },
    {
      title: '任务状态',
      width: convert ? '20%' : '30%',
      dataIndex: ['status', 'phase'],
      render: (val: string, record: any) => {
        const message = _.get(record, 'status.message');

        return (
          <Status
            value={val}
            message={message}
            prefix={convert ? '转换' : '解析'}
          />
        );
      },
    },
  ];

  if(convert){
    columns.splice(2, 0,
      {
        title: '模型格式',
        dataIndex: ['spec', 'conversion', 'mmdnn', 'from'],
        width: '20%',
        render: (val: string) => val || DEFAULT_VALUE,
      },
      {
        title: '目标格式',
        dataIndex: ['spec', 'conversion', 'mmdnn', 'to'],
        width: '20%',
        render: (val: string) => val || DEFAULT_VALUE,
      }
    );
  }

  return (
    <div className="klever-layout-list">
      <Table
        columns={columns}
        rowKey={record => _.get(record, 'metadata.name')}
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

JobLists.title = (path: string, params: any) => {
  return {
    name: `模型${_.get(params, 'type') === 'convert' ? '转换' : '解析'}`,
    path,
  };
};
