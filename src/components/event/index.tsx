import _ from 'lodash';
import React from 'react';
import { Table, Card } from 'antd';
import { request, useRequest } from 'umi';
import { formatTime } from '@/components/utils/index';

import './index.less';

interface IEventProps {
  id: string;
  namespace: string;
}

function GetEvents(params: {
  current: number;
  pageSize: number;
  gender?: string;
  id: string;
  namespace: string;
}) {
  const { id, namespace, current, pageSize: limit } = params;
  return request(
    `/api/v1alpha1/namespaces/${namespace}/modeljobs/${id}/events`,
    {
      params: {
        start: current - 1,
        limit,
      },
    },
  );
}

export default function(props: IEventProps) {
  const { tableProps, params, refresh } = useRequest(
    params => GetEvents(_.assign(params, props)),
    {
      paginated: true,
      defaultPageSize: 10,
      formatResult: (res: any) => {
        return {
          list: _.get(res, 'items') || [],
          total: _.get(res, 'metadata.totalItems', 0),
        };
      },
    },
  );

  const columns = [
    {
      width: '40%',
      title: 'message',
      dataIndex: 'message',
      render: (val: string) => (
        <div style={{ wordBreak: 'break-all' }}>{val}</div>
      ),
    },
    {
      dataIndex: 'reason',
      title: 'reason',
    },
    {
      dataIndex: 'firstTimestamp',
      title: 'First Seen',
      render: (val: string) => formatTime(val),
    },
    {
      dataIndex: 'lastTimestamp',
      title: 'Last Seen',
      render: (val: string) => formatTime(val),
      // defaultSortOrder: 'descend',
      // sortDirections: ['descend'],
      // sorter: (a: any, b: any) => a.name.length - b.name.length,
    },
  ];

  return (
    <Card className="event-root">
      <Table
        columns={columns}
        rowKey="message"
        {...tableProps}
        pagination={{
          showQuickJumper: true,
          showSizeChanger: true,
          ...tableProps.pagination,
        }}
      />
    </Card>
  );
}
