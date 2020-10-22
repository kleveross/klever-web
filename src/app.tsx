import _ from 'lodash';
import React from 'react';
import { RequestConfig } from 'umi';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';

export const request: RequestConfig = {
  errorConfig: {
    adaptor: res => {
      const message = _.get(res, 'message') || _.get(res, 'errors.0.message');

      return {
        success: !_.isUndefined(res),
        data: res,
        errorMessage: message || '未知错误',
      };
    },
  },
  // middlewares: [
  //   async function (ctx, next) {
  //     // login logic
  //     console.log('A before');
  //     await next();
  //     console.log('A after');
  //   },
  // ]
};

export const rootContainer = (container: React.ReactChildren) => {
  return <ConfigProvider locale={zhCN}>{container}</ConfigProvider>;
};
