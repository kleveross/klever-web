import _ from 'lodash';
import React from 'react';
import cx from 'classnames';
import Render, { ComponentPropsType } from './render';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { Omit } from '../../omit';
import * as config from '../../config';
import * as validator from '../../validator';
import { composeValidators } from '../../utils';
import * as components from '../../template';
import { Field, FieldProps, FieldRenderProps } from 'react-final-form';
import { FieldValidator } from 'final-form';

export interface IFieldValueProps<
  FieldValue,
  T extends HTMLElement,
  U extends {
    [key: string]: React.ComponentType<ComponentPropsType<FieldValue, T>>;
  }
> extends Omit<FieldProps<FieldValue, T>, 'validate' | 'component'> {
  /**
   * 是否必填，FormField 会自动加上必填校验
   */
  required?: boolean;
  /**
   * 表单验证函数（数组）
   */
  validate?: Array<FieldValidator<FieldValue>>;
  /**
   * 异步校验函数
   */
  asyncValidate?: FieldValidator<FieldValue>;
  /**
   * 异步校验节流阈值
   */
  asyncValidateDebounce?: number;
  /**
   * 异步校验是否捕获错误
   */
  asyncValidateCatchError?: boolean;
  /**
   * 是否隐藏 field value 部分，由用户传入 component 参数来自定义此部分
   */
  noField?: boolean;
  /**
   * 自定义的 css class
   */
  className?: string;
  /**
   * 自定义的 style 样式
   */
  style?: React.CSSProperties;
  /**
   * 业务根据需要封装业务组件时需要扩展的 template
   */
  templates?: U | undefined;
  /**
   * 表单组件
   */
  component?:
    | React.ComponentType<ComponentPropsType<FieldValue, T>>
    | keyof U
    | keyof typeof components
    | React.ReactElement;
}

interface IFieldValueState {
  asyncValidating: boolean;
}

export default class FieldValue<
  FieldValue = any,
  T extends HTMLElement = HTMLElement,
  U extends {
    [key: string]: React.ComponentType<ComponentPropsType<FieldValue, T>>;
  } = any
> extends React.Component<
  IFieldValueProps<FieldValue, T, U>,
  IFieldValueState
> {
  static defaultProps = {
    asyncValidateDebounce: config.asyncValidateDebounce,
  };

  // 异步校验返回的错误信息
  private asyncValidateErrorMsg: string = '';

  // 异步校验定时器的函数
  private asyncValidateTimeout: any = null;

  state = { asyncValidating: false };

  private processAsyncValidate: FieldValidator<FieldValue> = (
    value,
    allValues,
    fieldState
  ) => {
    const {
      asyncValidate,
      asyncValidateDebounce,
      asyncValidateCatchError = true,
    } = this.props;

    // 没有设置异步校验函数或者没有任何输入时，默认返回 undefined
    if (!asyncValidate || !value) {
      return;
    }

    // 判断输入表单在 focus 的时候，才进行异步校验
    if (fieldState && fieldState.active) {
      return new Promise(resolve => {
        this.asyncValidateTimeout && this.asyncValidateTimeout();
        // 正在异步校验中
        this.setState({
          asyncValidating: true,
        });
        const asyncValidateTimer = setTimeout(async () => {
          if (asyncValidateCatchError) {
            // 需要 catch 异步接口返回报错的情况
            try {
              // 获取异步校验结果
              const errorMsg = await asyncValidate(
                value,
                allValues,
                fieldState
              );
              this.asyncValidateErrorMsg = errorMsg;
              // 异步校验结束
              this.setState({
                asyncValidating: false,
              });
              // 给 promise 返回异步校验结果
              resolve(errorMsg);
            } catch (e) {
              // 兼容接口返回出错的情况
              this.asyncValidateErrorMsg = e.message;
              this.setState({
                asyncValidating: false,
              });
              resolve(e.message);
            }
          } else {
            const errorMsg = await asyncValidate(value, allValues, fieldState);
            this.asyncValidateErrorMsg = errorMsg;
            this.setState({
              asyncValidating: false,
            });
            resolve(errorMsg);
          }
        }, asyncValidateDebounce);

        // 清除定时器函数
        this.asyncValidateTimeout = () => {
          clearTimeout(asyncValidateTimer);
          resolve();
        };
      });
    }

    // 输入表单失焦时，返回上次的异步检验的错误
    return this.asyncValidateErrorMsg;
  };

  private getValidate = () => {
    const { component, validate, required, asyncValidate } = this.props;
    const validators = [];
    // 必填校验
    required && validators.push(validator.required);

    // 添加参数里面的校验项
    _.isArray(validate) && validators.push(...validate);

    // 添加异步校验
    asyncValidate && validators.push(this.processAsyncValidate);

    return validators.length ? composeValidators(...validators) : undefined;
  };

  private renderComponent = (field: FieldRenderProps<FieldValue, T>) => {
    const { tips, component, templates, value, initialValue } = this.props;
    const { input, meta } = field;
    const { asyncValidating } = this.state;
    const error = meta.touched && _.isString(meta.error);
    const restProps = {
      ..._.omit(this.props, [
        ...config.fieldProps,
        ...config.labelProps,
        'noField',
        'required',
        'tips',
        'asyncValidate',
        'asyncValidateDebounce',
      ]),
    };

    return (
      <>
        <div
          className={cx('klever-form-value-container', {
            'has-error': error,
          })}
        >
          <Render
            {...restProps}
            templates={templates}
            component={component}
            field={field}
            value={value}
            initialValue={initialValue}
          />
          {asyncValidating && (
            <div className="klever-form-value-asyncValidating">
              <Spin indicator={<LoadingOutlined />} />
            </div>
          )}
        </div>
        {error && (
          <div className="klever-form-value-error">{meta.error}</div>
        )}
        {tips && (
          <div className="klever-form-value-tips">
            {_.isFunction(tips) ? tips(input.value) : tips}
          </div>
        )}
      </>
    );
  };

  render() {
    const { style, name, className, noField, component } = this.props;

    return (
      <div style={style} className={cx('klever-form-value', className)}>
        {// 避免 noField 的时候注册一个 undefined field， 所以 noField 的时候直接返回组件的设置值
        noField ? (
          _.isString(component) ? (
            <div className="klever-form-value-text">{component}</div>
          ) : (
            component
          )
        ) : (
          <div className="klever-form-value-field">
            <Field
              {..._.pick(this.props, config.fieldProps)}
              name={name}
              validate={this.getValidate()}
              component={this.renderComponent}
            />
          </div>
        )}
      </div>
    );
  }
}
