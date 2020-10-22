import { defineConfig } from 'umi';
const OpenBrowserPlugin = require('open-browser-plugin');

export default defineConfig({
  title: 'klever-web',
  favicon: '/assets/favicon.ico',
  theme: {
    '@primary-color': '#4974D4',
    '@layout-body-background': '#fcfcfc',
    '@layout-header-background': '#152740',
    '@layout-header-height': '50px',
    '@layout-header-padding': '0 16px',
    '@layout-sider-background': '#2b384a',
    '@layout-trigger-height': '@layout-header-height',
    '@layout-trigger-background': '@layout-sider-background',
    '@layout-trigger-color': '#76889c',
    '@menu-dark-bg': '@layout-sider-background',
    '@menu-dark-submenu-bg': '#253141',
    '@menu-item-active-bg': '@primary-color',
    '@menu-icon-size': '24px',
    '@menu-icon-size-lg': '24px',
    '@menu-dark-item-active-bg': '@primary-color',
    '@breadcrumb-base-color': '#666',
    '@breadcrumb-last-item-color': '#151515',
    '@breadcrumb-separator-color': '@breadcrumb-base-color',
  },
  request: {
    dataField: '',
  },
  antd: {
    dark: false,
  },
  nodeModulesTransform: {
    type: 'none',
  },
  chainWebpack: (memo, config) => {
    if (config && config.env && config.env !== 'production') {
      memo.plugin('open-browser-plugin').use(OpenBrowserPlugin);
      memo.plugin('open-browser-plugin').tap(() => [
        {
          port: process.env.PORT,
        },
      ]);
    }
  },
  proxy: {
    '/api': {
      target: process.env.BASEURL,
      changeOrigin: true,
    },
  },
});
