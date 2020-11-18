import _ from 'lodash';
import React from 'react';
import { Button } from 'antd';

export default function(props: any) {
  const {
    okButtonProps,
    formRenderProps,
    onOk,
    okText,
    cancelButtonProps,
    onCancel,
    cancelText,
  } = props;

  return (
    <div className="klever-form-buttons">
      <Button
        type="primary"
        htmlType="submit"
        className="c-btn-form"
        {...okButtonProps}
        disabled={
          formRenderProps.submitting ||
          formRenderProps.validating ||
          _.get(okButtonProps, 'disabled')
        }
        loading={
          formRenderProps.submitting ||
          formRenderProps.validating ||
          _.get(okButtonProps, 'disabled')
        }
        onClick={(event: React.MouseEvent<HTMLElement>) => {
          okButtonProps &&
            okButtonProps.onClick &&
            okButtonProps.onClick(event);
          onOk && onOk(event);
        }}
      >
        {okText || '确定'}
      </Button>
      <Button
        className="c-btn-form"
        {...cancelButtonProps}
        onClick={(event: React.MouseEvent<HTMLElement>) => {
          formRenderProps.form.reset(event);
          cancelButtonProps &&
            cancelButtonProps.onClick &&
            cancelButtonProps.onClick(event);
          onCancel && onCancel(event);
        }}
        disabled={
          formRenderProps.submitting || _.get(cancelButtonProps, 'disabled')
        }
      >
        {cancelText || '取消'}
      </Button>
    </div>
  );
}
