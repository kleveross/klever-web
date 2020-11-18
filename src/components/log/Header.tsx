import React from 'react';
import { Button } from 'antd';
import {
  DownloadOutlined,
  LoadingOutlined,
  SkinOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
} from '@ant-design/icons';

interface HeaderProps {
  continuous: boolean;
  continuousText?: string;
  onDownload?: React.MouseEventHandler<any>;
  downloadText?: string;
  disabledDownload?: boolean;
  loading?: boolean;
  loadingText?: string;
  fullscreen?: boolean;
  onFullscreen?: React.MouseEventHandler<any>;
  onSkinChange?: React.MouseEventHandler<any>;
}

const defaultProps = {
  loading: false,
  fullscreen: false,
  continuous: false,
  disabledDownload: false,
  loadingText: '加载中',
  downloadText: '下载',
  continuousText: '持续获取中',
};

const Header = (props: HeaderProps) => {
  const {
    loading,
    loadingText,
    onSkinChange,
    onDownload,
    disabledDownload,
    fullscreen,
    onFullscreen,
    downloadText,
    continuous,
    continuousText,
  } = props;

  return (
    <div className="klever-log-header">
      <div className="klever-log-header-left">
        {loading ? (
          <LoadingOutlined className="klever-log-loading">
            {loadingText}
          </LoadingOutlined>
        ) : (
          continuous && (
            <div className="klever-log-continuous">
              {continuousText}
              <span className="klever-log-dot">...</span>
            </div>
          )
        )}
      </div>
      <div className="klever-log-header-right">
        {onDownload && (
          <Button
            onClick={onDownload}
            disabled={disabledDownload}
            className="klever-log-button download"
          >
            <DownloadOutlined className="klever-log-icon" />
            {downloadText}
          </Button>
        )}
        <Button onClick={onSkinChange} className="klever-log-button">
          <SkinOutlined className="klever-log-icon" />
        </Button>
        <Button onClick={onFullscreen} className="klever-log-button">
          {fullscreen ? (
            <FullscreenExitOutlined className="klever-log-icon" />
          ) : (
            <FullscreenOutlined className="klever-log-icon" />
          )}
        </Button>
      </div>
    </div>
  );
};

Header.defaultProps = defaultProps;

export default Header;
