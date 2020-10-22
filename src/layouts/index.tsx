import React, { useState } from 'react';
import { IRouteComponentProps } from 'umi';
import { Layout } from 'antd';
import SideBar from './sidebar';
import Breadcrumb from './breadcrumb';

import './index.less';

const { Header, Content } = Layout;

export default function (props: IRouteComponentProps) {
  const { children, route } = props;
  const collapsedValue = localStorage.getItem('collapsed');
  const [ collapsed, setCollapsed ] = useState(collapsedValue === '1');

  return (
    <Layout
      hasSider
      className="klever-layout-root"
    >
      <SideBar
        collapsed={collapsed}
        onCollapsed={setCollapsed}
      />
      <Layout>
        <Header className="klever-layout-header" />
        <Content className="klever-layout-content">
          <Breadcrumb
            route={route}
            className="klever-layout-breadcrumb"
          />
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
