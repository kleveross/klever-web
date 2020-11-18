import _ from 'lodash';
import React from 'react';
import { Link, useRequest } from 'umi';
import { Table } from 'antd';
import Add from './_add';
import { formatTime } from '@/components/utils/index';
import { ListProjects, ProjectsInfo } from '../_action';

export default function Projects() {
  const { data } = useRequest(() => ProjectsInfo());
  const private_project_count = _.parseInt(
    _.get(data, 'private_project_count', 0),
  );
  const public_project_count = _.parseInt(
    _.get(data, 'public_project_count', 0),
  );
  const total = private_project_count + public_project_count;
  const { tableProps, refresh } = useRequest(params => ListProjects(params), {
    ready: total > 0,
    paginated: true,
    defaultPageSize: 10,
    formatResult: (res: any) => {
      return {
        list: res,
        total,
      };
    },
  });

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: '33%',
      render: (val: string, record: any) => (
        <Link
          style={{ wordBreak: 'break-all' }}
          to={`/model/projects/${_.get(record, 'project_id')}/${val}`}
        >
          {val}
        </Link>
      ),
    },
    {
      title: '模型数',
      dataIndex: 'repo_count',
      key: 'repo_count',
      width: '33%',
      render: (val: string) => val || 0,
    },
    {
      title: '创建时间',
      dataIndex: 'creation_time',
      key: 'creation_time',
      render: (val: string) => formatTime(val),
    },
  ];

  return (
    <div className="klever-layout-list">
      <Add onSuccess={refresh}>创建项目</Add>
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

Projects.title = (path: string) => ({
  name: '项目',
  path,
});
