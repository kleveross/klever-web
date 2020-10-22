import _ from 'lodash';
import React from 'react';
import Field from './field';
import Buttons from './buttons';
import { Affix } from 'antd';
import * as validator from './validator';
import Form, { IFormProps } from './form';
import FieldArray from './field/fieldArray';
import { FormRenderProps } from 'react-final-form';
import { NativeButtonProps } from 'antd/lib/button/button';

import './index.less';

export interface IndexProps extends IFormProps {
  /**
   * 自定义 field map
   */
  fields?: any;
  /**
   * 是否启用按钮的图钉效果
   */
  affixButtons?: boolean;
  /**
   * 自定义 footer, 不需要 footer ，可以设置 null
   */
  footer?: React.ReactNode | null;
  /**
   * 重置按钮文案
   */
  cancelText?: string;
  /**
   * 重置按钮属性，见 antd Button 属性
   */
  cancelButtonProps?: NativeButtonProps;
  /**
   * 重置按钮点击事件
   */
  onCancel?: (event: React.MouseEvent) => void;
  /**
   * 确认按钮文案
   */
  okText?: string;
  /**
   * 确认按钮属性，见 antd Button 属性
   */
  okButtonProps?: NativeButtonProps;
  /**
   * 确认按钮点击事件
   */
  onOk?: (event: React.MouseEvent) => void;
}

function index(props: IndexProps) {
  const {
    fields,
    onSubmit,
    children,
    render,
    footer,
    cancelText,
    cancelButtonProps,
    onCancel,
    okText,
    okButtonProps,
    onOk,
    affixButtons = true,
    ...resetProps
  } = props;

  // 简化组件使用方式
  let renderMethod = render || children;

  // 支持直接传数据进来初始化表单
  if (_.isArray(fields)) {
    renderMethod = _.map(fields, field => (
      <Field
        key={field[0]}
        name={field[0]}
        component={field[1] || 'input'}
        label={field[2]}
        {...field[3]}
      />
    ));
  }

  return (
    <Form onSubmit={onSubmit} {...resetProps}>
      {(formRenderProps: FormRenderProps) => {
        const submitButtonProps = {
          onOk,
          okText,
          okButtonProps,
          onCancel,
          cancelText,
          cancelButtonProps,
          formRenderProps,
        };

        return _.isFunction(renderMethod) ? (
          renderMethod(formRenderProps)
        ) : (
          <form onSubmit={formRenderProps.handleSubmit}>
            {React.Children.map(renderMethod, child => {
              if (
                React.isValidElement(child) &&
                _.get(child, 'type.displayName') === 'FieldArray'
              ) {
                const {
                  mutators: childMutators,
                  children: childChildren,
                  ...resetChildProps
                }: any = child.props;
                return React.cloneElement(
                  child,
                  {
                    mutators: childMutators || formRenderProps.form.mutators,
                    ...resetChildProps,
                  },
                  childChildren
                );
              }
              return child;
            })}
            {_.isUndefined(footer) ? (
              affixButtons ? (
                <Affix offsetBottom={0}>
                  <Buttons {...submitButtonProps} />
                </Affix>
              ) : (
                <Buttons {...submitButtonProps} />
              )
            ) : (
              footer
            )}
          </form>
        );
      }}
    </Form>
  );
}

export { index as Form, Field, FieldArray, Buttons, validator };
