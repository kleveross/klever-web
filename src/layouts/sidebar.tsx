import React from 'react';
import { Link } from 'umi';
import { Layout, Menu } from 'antd';
import Icon from '@ant-design/icons';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { ReactComponent as ModelManage } from './img/modelManage.svg';
import { ReactComponent as ModelServing } from './img/modelServing.svg';

interface ISideBarProps {
  collapsed: boolean;
  onCollapsed: (collapsed: boolean) => void;
}

export default function(props: ISideBarProps) {
  const { collapsed, onCollapsed } = props;

  return (
    <Layout.Sider width={184} trigger={null} collapsible collapsed={collapsed}>
      <div className="klever-sidebar-logo">
        <img src={require('./img/logo.png')} />
      </div>
      <div
        className="klever-sidebar-trigger"
        onClick={() => {
          onCollapsed(!collapsed);
          localStorage.setItem('collapsed', collapsed ? '0' : '1');
        }}
      >
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </div>
      <Menu
        theme="dark"
        mode="inline"
        className="klever-sidebar-menu"
        defaultOpenKeys={['model-manage']}
        defaultSelectedKeys={['projects']}
      >
        <Menu.SubMenu
          title="模型管理"
          key="model-manage"
          icon={<Icon component={ModelManage} />}
        >
          <Menu.Item key="projects">
            <Link to="/model/projects">项目</Link>
          </Menu.Item>
          <Menu.Item key="extract">
            <Link to="/model/job/extract">模型解析</Link>
          </Menu.Item>
          <Menu.Item key="convert">
            <Link to="/model/job/convert">模型转换</Link>
          </Menu.Item>
        </Menu.SubMenu>
        <Menu.SubMenu
          title="模型服务"
          key="model-serving"
          icon={<Icon component={ModelServing} />}
        >
          <Menu.Item key="serving">
            <Link to="/serving">在线服务</Link>
          </Menu.Item>
        </Menu.SubMenu>
      </Menu>
    </Layout.Sider>
  );
}
