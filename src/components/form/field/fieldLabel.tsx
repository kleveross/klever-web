import _ from 'lodash';
import React from 'react';
import cx from 'classnames';
import { Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

export interface IFieldLabelProps {
  /**
   * 是否有必填标识
   */
  required?: boolean;
  /**
   * Label 名称
   */
  label?: React.ReactNode;
  /**
   * Label 的 tooltip 提示
   */
  labelTooltip?: React.ReactNode;
  /**
   * 自定义的 css class
   */
  className?: string;
  /**
   * 自定义的 style 样式
   */
  style?: React.CSSProperties;
  /**
   * 自定义文本宽度
   */
  width?: string | number;
}

export default function fieldLabel(props: IFieldLabelProps) {
  const { required, className, label, labelTooltip, style, width } = props;

  if (!label) {
    return null;
  }

  return (
    <label
      style={_.assign({}, style, { width })}
      className={cx('klever-form-label', className)}
    >
      {required && <span className="klever-form-label-required">*</span>}
      {label}
      {labelTooltip && (
        <Tooltip title={labelTooltip}>
          <QuestionCircleOutlined
            className="klever-form-label-tooltip-icon"
          />
        </Tooltip>
      )}
    </label>
  );
}
