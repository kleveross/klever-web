import _ from 'lodash';
import React from 'react';
import { Table } from 'antd';
import { Link, useParams, useRequest } from 'umi';
import { GetProject, VersionsInfo } from '@/pages/model/_action';

export default function Project(){
  const defaultParams: { id: string, name: string } = useParams();
  const { data } = useRequest(() => VersionsInfo(defaultParams.id));
  const total = _.parseInt(_.get(data, 'repo_count', 0));
  const { tableProps, params, refresh } = useRequest(
    params => GetProject(_.assign(params, defaultParams)),
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
      title: '模型名称',
      dataIndex: 'name',
      key: 'name',
      width: '33%',
      render: (val: string) => <Link to={`/model/projects/${defaultParams.id}/${defaultParams.name}/${_.split(val, '/').pop()}`}>{val}</Link>,
    },
    {
      title: '版本数',
      dataIndex: 'artifact_count',
      key: 'artifact_count',
      width: '33%',
      render: (val: string) => val || 0,
    },
    {
      title: '下载数',
      dataIndex: 'pull_count',
      key: 'pull_count',
      render: (val: string) => val || 0,
    },
  ];

  return (
    <div className="klever-layout-list">
      <Table
        columns={columns}
        rowKey="name"
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

Project.title = (path: string, params: any) => ({
  name: params.name,
  path,
});
