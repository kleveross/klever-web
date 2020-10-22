import React from 'react';
import copy from 'copy-to-clipboard';
import { Button, message } from 'antd';
import { CopyOutlined, CloudDownloadOutlined } from '@ant-design/icons';

interface HeaderProps {
  value: string;
  onDownload?: React.MouseEventHandler<any>;
  disabledDownload?: boolean;
}

export default function(props: HeaderProps) {
  const { value, onDownload, disabledDownload } = props;

  return (
    <div className="editor-header">
      <div className="editor-header-right">
        <Button
          onClick={() => {
            copy(value);
            message.success('复制成功');
          }}
          className="editor-header-button"
        >
          <CopyOutlined className="editor-header-icon" />
        </Button>
        {onDownload && (
          <Button
            onClick={onDownload}
            disabled={disabledDownload}
            className="editor-header-button"
          >
            <CloudDownloadOutlined className="editor-header-icon" />
          </Button>
        )}
      </div>
    </div>
  );
}
