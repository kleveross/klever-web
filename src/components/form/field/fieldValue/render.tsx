import _ from 'lodash';
import React from 'react';
import { Tooltip } from 'antd';
import { FieldRenderProps } from 'react-final-form';
import * as config from '../../config';
import * as components from '../../template';

export type ComponentPropsType<FieldValue, T> = {
  name: string;
  onBlur: (event?: React.FocusEvent<T>) => void;
  onChange: (event: React.ChangeEvent<T> | any) => void;
  onFocus: (event?: React.FocusEvent<T>) => void;
  value: FieldValue;
  [key: string]: any;
};

export default function Render<
  FieldValue = any,
  T extends HTMLElement = HTMLElement,
  U extends {
    [key: string]: React.ComponentType<ComponentPropsType<FieldValue, T>>;
  } = any
>(props: {
  templates?: U;
  component?:
    | React.ComponentType<ComponentPropsType<FieldValue, T>>
    | keyof U
    | keyof typeof components
    | React.ReactElement;
  field: FieldRenderProps<FieldValue, T>;
  onBlur?: (event?: React.FocusEvent<T>) => void;
  onChange?: (event: React.ChangeEvent<T> | any) => void;
  onFocus?: (event?: React.FocusEvent<T>) => void;
  [key: string]: any;
}) {
  const {
    children,
    field,
    value,
    initialValue,
    component = 'Input',
    templates,
  } = props;

  const { input } = field;
  const componentProps: any = {
    ..._.omit(
      props,
      _.concat(
        ['component', 'onChange', 'onBlur', 'onFocus', 'templates', 'children'],
        config.fieldProps
      )
    ),
    ...field,
    input: { ...field.input },
  };

  // 统一处理事件，防止业务监听覆盖 final-from 的事件
  ['onChange', 'onFocus', 'onBlur'].forEach(item => {
    componentProps[item] = componentProps.input[item] = (params: any) => {
      const targetValue = _.get(params, 'target.value', params);
      props[item] && props[item](targetValue);

      (input as any)[item] && (input as any)[item](targetValue);
    };
  });

  // 对组件自身带的属性做处理，使得组件支持随意设置 props ，如 componentStyle 最终会把值以 style 的属性赋给组件
  _.forEach(props, (item, key) => {
    // 以 component 开头且不是 component 属性的时候，把值拿出来赋给组件
    if (_.startsWith(key, 'component') && key.length > 9) {
      const propsKey = key.split('component').pop();
      if (propsKey) {
        // 先删除已有的属性后追加
        _.unset(componentProps, key);
        componentProps[_.lowerFirst(propsKey)] = item;
      }
    }
  });

  if (React.isValidElement(component)) {
    return component;
  }

  /**
   * 非字符串暂时直接返回，后期根据实际场景追加功能。
   * _.isUndefined 判断是考虑不设置直接返回 input
   */
  if (
    !_.isString(component) &&
    !_.isUndefined(component) &&
    !_.isFunction(component)
  ) {
    return null;
  }

  let ComponentName:
    | React.ComponentType<ComponentPropsType<FieldValue, T>>
    | string = 'input';

  let func: any = _.isFunction(component) ? component : null;

  if (typeof component === 'string') {
    const templateList = _.assign({}, components, templates);
    const template = templateList[component];
    template && (ComponentName = template);
  } else {
    ComponentName = component;
  }

  // 设置值
  if (component === 'Hidden') {
    const componentValue = value || value === 0 ? value : initialValue;
    componentProps.value = _.isUndefined(componentValue)
      ? input.value
      : componentValue;
  } else {
    componentProps.value = input.value;
  }

  const tooltipProps = componentProps.tooltip;
  if (typeof children === 'function') {
    func = children;
  } else {
    componentProps.children = children;
  }

  return _.isUndefined(tooltipProps) ? (
    func ? (
      func(componentProps)
    ) : (
      <ComponentName {...componentProps} />
    )
  ) : (
    <Tooltip title={tooltipProps}>
      {func ? func(componentProps) : <ComponentName {...componentProps} />}
    </Tooltip>
  );
}
