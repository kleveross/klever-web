import _ from 'lodash';
import React, { useEffect } from 'react';
import cx from 'classnames';
import { Button } from 'antd';
import FieldLabel from './fieldLabel';
import {
  FieldArray as FinalFieldArray,
  FieldArrayProps,
  FieldArrayRenderProps,
} from 'react-final-form-arrays';
import { Omit } from '../omit';

// 将一些属性提出来，重新定义
type OmitFieldArrayProps = Omit<
  FieldArrayProps<any, any>,
  'render' | 'component'
>;

export interface IFieldArrayProps extends OmitFieldArrayProps {
  /**
   * FieldArray 的 name 值
   */
  name: string;
  /**
   * 用来处理新增和删除数组项的修改器，值一般为 form.mutators，详情请看示例
   */
  mutators?: any;
  /**
   * 是否有必填标识，FieldArray 不会自动加上必填校验，需要自定义必填校验
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
   * FieldArray 下方的 tip 提示
   */
  tips?: React.ReactNode;
  /**
   * label 的宽度
   */
  labelWidth?: string | number;
  /**
   * label 的自定义样式
   */
  labelStyle?: React.CSSProperties;
  /**
   * Label 的 tooltip 提示
   */
  labelClassName?: string;
  /**
   * 如何渲染一个数组表单项
   */
  renderFieldItem: (
    name: string,
    index: number,
    fields: any,
    values: any
  ) => JSX.Element;
  /**
   * 是否至少要有一个 FormItem，如果是，则最后剩下的 FormItem 不能被删除
   */
  atLeastOne?: boolean;
  /**
   * 自定义如何渲染 FieldItem 的删除按钮
   */
  renderRemoveOperator?: (fields: any, index: number) => JSX.Element;
  /**
   * 自定义如何删除 FieldItem 的操作
   */
  onRemoveFieldItem?: (fields: any, index: number) => void;
  /**
   * 自定义如何渲染 FieldItem 的增加按钮
   */
  renderAddOperator?: (mutators: any, name: string) => JSX.Element;
  /**
   * 自定义如何添加 FieldItem 的操作
   */
  onAddFieldItem?: (mutators: any, name: string) => void;
  /**
   * 自定义样式
   */
  style?: React.CSSProperties;
  /**
   * 自定义 css 类
   */
  className?: string;
  /**
   * 表单值
   */
  values?: { [key: string]: any };
  /**
   * 最多支持添加多少表单项，要使此项参数生效，需要传 values 参数进来
   */
  maxLength?: number;
  payload?: any;
  /**
   * 添加按钮文案
   */
  addText?: string;
  /**
   * 是否禁用
   */
  disabled?: boolean;
}

export default function fieldArray(props: IFieldArrayProps) {
  const {
    name,
    style,
    className,
    labelWidth,
    labelStyle,
    labelClassName,
    mutators,
    tips,
    isEqual,
    subscription,
    validate,
    payload,
    renderAddOperator,
    values = {},
    maxLength,
    onAddFieldItem,
    renderFieldItem,
    atLeastOne,
    renderRemoveOperator,
    onRemoveFieldItem,
    addText = '',
    disabled,
  } = props;

  const value = _.get(values, name) || [];
  const valueLength = _.size(value);

  useEffect(() => {
    if (atLeastOne && valueLength <= 0) {
      mutators.push(name);
    }
  }, []);

  const removeOperator = (fields: any, index: number) => {
    if (disabled) {
      return null;
    }

    return (
      <>
        {!(atLeastOne && fields.length === 1 && index === 0) && (
          <div className="klever-form-fieldArray-value-remove">
            {renderRemoveOperator ? (
              renderRemoveOperator(fields, index)
            ) : (
              <Button
                type="link"
                style={{ paddingLeft: 0 }}
                className="klever-form-fieldArray-value-remove-button"
                onClick={() => {
                  // 如果传递了 onRemoveFieldItem 函数，则 FieldItem 的删除操作完全由这个函数来控制
                  if (onRemoveFieldItem) {
                    return onRemoveFieldItem(fields, index);
                  }
                  fields.remove(index);
                }}
              >
                删除
              </Button>
            )}
          </div>
        )}
      </>
    );
  };
  const addOperator = () => {
    if (disabled) {
      return null;
    }

    return (
      <>
        {renderAddOperator ? (
          renderAddOperator(mutators, name)
        ) : (
          <>
            <Button
              type="link"
              icon="plus-square"
              style={{ paddingLeft: 0 }}
              className="klever-form-fieldArray-value-add-button"
              disabled={
                typeof maxLength !== 'undefined' &&
                maxLength <= (_.get(values, name) || []).length
              }
              onClick={(e: any) => {
                e.preventDefault();
                // 如果传递了 onAddFieldItem 函数，则 FieldItem 的添加操作完全由这个函数来控制
                if (onAddFieldItem) {
                  return onAddFieldItem(mutators, name);
                }
                mutators.push(name);
              }}
            >
              添加
              {addText}
            </Button>
            {typeof maxLength !== 'undefined' && !_.isEmpty(values) && (
              <span className="klever-form-fieldArray-value-add-tips">
                添加&nbsp;
                {maxLength - valueLength}&nbsp;
                个
              </span>
            )}
          </>
        )}
      </>
    );
  };

  return (
    <div
      style={style}
      className={cx(
        'klever-form-field klever-form-fieldArray',
        className
      )}
    >
      <FieldLabel
        {..._.pick(props, ['label', 'noLabel', 'labelTooltip', 'required'])}
        width={labelWidth}
        style={labelStyle}
        className={labelClassName}
      />
      <div className="klever-form-value klever-form-fieldArray-value">
        <div className="klever-form-value-field klever-form-fieldArray-value-field">
          <FinalFieldArray
            name={name}
            isEqual={isEqual}
            validate={validate}
            subscription={subscription}
          >
            {({ fields }: FieldArrayRenderProps<any, any>) =>
              fields.map((itemName: string, index: number) => (
                <div
                  key={index}
                  className="klever-form-fieldArray-value-item"
                >
                  {renderFieldItem(itemName, index, fields, payload)}
                  {removeOperator(fields, index)}
                </div>
              ))
            }
          </FinalFieldArray>
          <div className="klever-form-fieldArray-value-add">
            {addOperator()}
          </div>
          {tips && (
            <div className="klever-form-value-tips klever-form-fieldArray-tips">
              {tips}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

fieldArray.displayName = 'FieldArray';
