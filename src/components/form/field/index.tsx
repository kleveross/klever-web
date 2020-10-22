import _ from 'lodash';
import React from 'react';
import cx from 'classnames';
import FieldLabel from './fieldLabel';
import FieldValue, { IFieldValueProps } from './fieldValue';
import { ComponentPropsType } from './fieldValue/render';
import * as config from '../config';

export interface IFieldProps<
  FieldValue,
  T extends HTMLElement,
  U extends {
    [key: string]: React.ComponentType<ComponentPropsType<FieldValue, T>>;
  }
> extends IFieldValueProps<FieldValue, T, U> {
  /**
   * Label 名称
   */
  label?: React.ReactNode;
  /**
   * Label 的 tooltip 提示
   */
  labelTooltip?: React.ReactNode;
  /**
   * label 的宽度
   */
  labelWidth?: string | number;
  /**
   * label 的自定义样式
   */
  labelStyle?: React.CSSProperties;
  /**
   * Label 的类名
   */
  labelClassName?: string;
  /**
   * value 的自定义样式
   */
  valueStyle?: React.CSSProperties;
  /**
   * value 的类名
   */
  valueClassName?: string;
}

export default function field<
  FieldValue,
  T extends HTMLElement,
  U extends {
    [key: string]: React.ComponentType<ComponentPropsType<FieldValue, T>>;
  }
>(props: IFieldProps<FieldValue, T, U>) {
  const {
    style,
    className,
    component,
    labelWidth,
    labelStyle,
    labelClassName,
    valueStyle,
    valueClassName,
  } = props;
  // 对老业务中 ByteInput 的兼容，推荐优先使用 Storage
  let componentName: any = component;
  if (_.isString(component)) {
    // 字符串时手动转换首字母大写
    componentName = _.upperFirst(component);
    (componentName === 'ByteInput' || componentName === 'StorageSizeInput') &&
      (componentName = 'Storage');
  }

  return (
    <div
      className={cx('klever-form-field', className, {
        [`klever-form-field-${_.toLower(componentName)}`]: _.isString(
          component
        ),
      })}
      style={componentName === 'Hidden' ? { display: 'none', ...style } : style}
    >
      <FieldLabel
        {..._.pick(props, ['label', 'noLabel', 'labelTooltip', 'required'])}
        width={labelWidth}
        style={labelStyle}
        className={labelClassName}
      />
      <FieldValue
        {..._.omit(props, config.labelProps)}
        style={valueStyle}
        className={valueClassName}
        component={componentName}
      />
    </div>
  );
}

field.displayName = 'Field';
