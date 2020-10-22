import _ from 'lodash';
import React from 'react';
import LogUI from './logUI';
import network from './network';
import webSocket from './webSocket';

import './index.less';

type LogType = { key: number; value: string }[];

interface LogProps {
  className?: string;
  style?: React.CSSProperties;
  height?: string | number;
  loading?: boolean;
  showAllLog?: boolean;
  showLatestScreamLog?: boolean;
  hasLineNum?: boolean;
  skin?: 'dark' | 'light';
  loadingText?: string;
  downloadText?: string;
  emptyText?: string;
  continuous?: boolean;
  continuousText?: string;
  onDownload?: React.MouseEventHandler<any>;
  url?: string;
  pagingParams?: object;
  queryParams?: object;
  requestConfig?: object;
  parse?: (data: any) => string | string[];
  total: number;
  throttleWait: number;
  offsetWhenDataChange: number;
  onPageChange?: (pagingParams?: object, queryParams?: object) => void;
  onSkinChange?: (skin: string) => void;
  onFullscreen?: (fullscreen: boolean) => void;
  beforeConnected?: () => void;
}

interface LogState {
  loading: boolean;
  continuous: boolean;
  data: LogType;
}

const defaultProps = {
  total: 1000,
  requestConfig: {},
  throttleWait: 2000,
  offsetWhenDataChange: 200,
  showAllLog: false,
  showLatestScreamLog: false,
};

export default class Log extends React.PureComponent<LogProps, LogState> {
  static defaultProps = defaultProps;

  // log index value
  private index: number = 1;
  // lock for http request
  private locked: boolean = false;
  private logs: string[] = [];
  private updateThrottle: any;
  private logCoreInstance: any;
  private isWebSocket: boolean = false;
  private fetchInstance: any;

  constructor(props: LogProps) {
    super(props);
    this.state = {
      data: [],
      loading: false,
      continuous: false,
    };
  }

  componentDidMount() {
    const { url, pagingParams, queryParams, throttleWait } = this.props;
    this.fetchData(url, pagingParams, queryParams);
    this.updateThrottle = _.throttle(this.updateData, throttleWait);
  }

  UNSAFE_componentWillReceiveProps(nextProps: LogProps) {
    const { url, pagingParams, queryParams } = this.props;
    const {
      url: nextUrl,
      pagingParams: nextPagingParams,
      queryParams: nextQueryParams,
    } = nextProps;

    if (nextUrl != url || !_.isEqual(nextQueryParams, queryParams)) {
      this.reset();
      this.fetchData(nextUrl, nextPagingParams, nextQueryParams);
    } else if (!_.isEqual(pagingParams, nextPagingParams)) {
      this.fetchData(nextUrl, nextPagingParams, nextQueryParams);
    }
  }

  componentWillUnmount() {
    this.destroyNetwork();
  }

  private reset() {
    this.index = 1;
    this.logs = [];
    this.setState({
      data: [],
    });
  }

  private fetchData(url?: string, pagingParams?: object, queryParams?: object) {
    // destroy request instance first
    this.destroyNetwork();

    if (!url) {
      return;
    }

    this.isWebSocket = _.startsWith(url, 'ws');
    if (this.isWebSocket) {
      this.fetchDataWithSocket(url);
    } else {
      this.fetchDataWithHttp(url, pagingParams, queryParams);
    }
  }

  private destroyNetwork() {
    if (this.fetchInstance && this.fetchInstance.destroy) {
      this.fetchInstance && this.fetchInstance.destroy();
    }
  }

  private fetchDataWithSocket(url: string) {
    const { beforeConnected } = this.props;
    this.fetchInstance = webSocket({
      url,
      onBefore: () => {
        this.setState({
          loading: false,
          continuous: true,
        });
        beforeConnected && beforeConnected();
      },
      onData: data => {
        this.parseData(data);
      },
    });
  }

  private fetchDataWithHttp(
    url: string,
    pagingParams?: object,
    queryParams?: object,
  ) {
    if (this.locked) {
      return;
    }

    const { requestConfig, beforeConnected } = this.props;

    this.fetchInstance = network({
      url,
      requestConfig: requestConfig,
      params: _.assign({}, queryParams, pagingParams),
      onBefore: () => {
        this.locked = true;
        this.setState({
          loading: true,
          continuous: false,
        });
        beforeConnected && beforeConnected();
      },
      onComplete: () => {
        this.locked = false;
        this.setState({
          loading: false,
          continuous: false,
        });
      },
      onData: (data: any) => {
        this.parseData(data);
      },
    });
  }

  private parseData(data: any) {
    const { parse } = this.props;
    if (parse) {
      const logData = parse(data);
      if (logData && _.isString(logData)) {
        this.logs.push(logData);
      } else if (_.isArray(logData)) {
        this.logs = this.logs.concat(logData);
      }
    } else {
      this.logs = this.logs.concat(data);
    }
    this.updateThrottle();
  }

  private updateData() {
    const cacheLogs = _.map(this.logs, log => {
      return {
        key: this.index++,
        value: log,
      };
    });

    // empty cache logs
    this.logs = [];

    const {
      total,
      offsetWhenDataChange,
      showAllLog,
      showLatestScreamLog,
    } = this.props;
    const { data } = this.state;

    let nextLogs: LogType;

    if (cacheLogs.length > total && !showAllLog) {
      nextLogs = cacheLogs.slice(cacheLogs.length - total, cacheLogs.length);
    } else {
      if (data.length + cacheLogs.length > total && !showAllLog) {
        nextLogs = data
          .concat(cacheLogs)
          .slice(data.length + cacheLogs.length - total);
      } else {
        nextLogs = data.concat(cacheLogs);
      }
    }
    this.setState(
      {
        data: nextLogs,
      },
      () => {
        const bodyDOM = this.logCoreInstance.getBodyDOM();

        if (this.isWebSocket) {
          // websocket 不断追加数据的时候，需要变更对去顶部/底部按钮的状态
          this.logCoreInstance.scrollButtonUpdate();
          // scroll 至最新的实时日志位置
          showLatestScreamLog && (bodyDOM.scrollTop = bodyDOM.scrollHeight);
          return;
        }
        const originValue = bodyDOM.scrollTop;
        originValue != 0 && (bodyDOM.scrollTop += offsetWhenDataChange);
        // Less than one page, manually start loading the next page data.
        bodyDOM.offsetHeight == bodyDOM.scrollHeight && this.update();
      },
    );
  }

  private saveLogCoreInstance = (instance: any) => {
    instance && (this.logCoreInstance = instance);
  };

  private update = () => {
    const { onPageChange, pagingParams, queryParams } = this.props;

    onPageChange && onPageChange(pagingParams, queryParams);
  };

  render() {
    const { data, loading, continuous } = this.state;
    const props = _.omit(this.props, [
      'url',
      'queryParams',
      'parse',
      'total',
      'onUpdate',
    ]);

    return (
      <LogUI
        data={data}
        loading={loading}
        continuous={continuous}
        onScrollBottom={this.update}
        ref={this.saveLogCoreInstance}
        {...props}
      />
    );
  }
}
