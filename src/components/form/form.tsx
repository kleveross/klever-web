import _ from 'lodash';
import React from 'react';
import cx from 'classnames';
import { Spin } from 'antd';
import { flatFieldKey } from './utils';
import { FormState, FieldState, Config, DebugFunction } from 'final-form';
import arrayMutators from 'final-form-arrays';
import setFieldTouched from 'final-form-set-field-touched';
import {
  Form as FinalForm,
  FormProps as FinalFormProps,
  AnyObject,
} from 'react-final-form';
import { Omit } from './omit';

// 将一些属性提出来，重新定义
type OmitFinalFormProps<FormValues = AnyObject> = Omit<
  FinalFormProps<FormValues>,
  'debug'
>;

export interface IFormProps<FormValues = AnyObject>
  extends OmitFinalFormProps<FormValues> {
  /**
   * 是否显示日志
   */
  debug?: boolean | DebugFunction<FormValues>;
  /**
   * 获取远程的表单初始化数据
   */
  fetchInitialValues?: () => any;
  /**
   * 处理获取到的远程数据，得到最终的 initialValues
   */
  formatInitialValues?: (values: any) => FormValues;
  /**
   * 表单提交前的格式化函数
   */
  preSubmitFormat?: (values: FormValues, intialValues: FormValues) => any;
  /**
   * 表单提交后的格式化函数，用来设置新的表单初始化值
   */
  postSubmitFormat?: (values: any) => FormValues;
  /**
   * 是否需要设置新的表单初始化值
   */
  needReinitialize?: boolean;
  /**
   * 表单是否在初始化 Loading
   */
  loading?: boolean;
  /**
   * 表单初始值
   */
  initialValues?: FormValues;
  /**
   * 不需要被提交的字段，多个的话用数组形式
   */
  shallowFields?: string[] | string;
  /**
   * 需要铺平的字段，把多级数据直接转化成单层
   */
  flatFields?: string[] | string;
  /**
   * 是否需要有皮肤，Form 组件的背景颜色，边框，边距等，默认为 true
   */
  skin?: boolean;
  /**
   * final-form 支持的其他 API
   */
  [name: string]: any;
}

interface IFormState {
  loading: boolean;
  [name: string]: any;
}

const defaultProps = {
  skin: true,
};

export default class Form<FormValues = AnyObject> extends React.Component<
  IFormProps<FormValues>,
  IFormState
> {
  static defaultProps = defaultProps;

  constructor(props: IFormProps<FormValues>) {
    super(props);
    this.state = {
      loading: props.loading || false,
      initialValues: props.initialValues,
    };
  }

  componentDidMount() {
    this.loadInitialValues();
  }

  UNSAFE_componentWillReceiveProps(nextProps: IFormProps<FormValues>) {
    ['initialValues', 'loading'].forEach((prop: string) => {
      if (!_.isEqual(this.props[prop], nextProps[prop])) {
        this.setState({
          [prop]: nextProps[prop],
        });
      }
    });
  }

  private loadInitialValues = async () => {
    const { fetchInitialValues, formatInitialValues } = this.props;

    if (!fetchInitialValues) {
      return;
    }

    this.setState({
      loading: true,
    });

    const remoteValues = await fetchInitialValues();
    const initialValues = formatInitialValues
      ? formatInitialValues(remoteValues)
      : remoteValues;

    this.setState({
      loading: false,
      initialValues,
    });
  };

  private handleSubmit = async (values: any, form: any, callback: any) => {
    const {
      postSubmitFormat,
      preSubmitFormat,
      onSubmit,
      needReinitialize,
      shallowFields,
      flatFields,
    } = this.props;
    // 为避免影响表单的数据，在数据提交前做深拷贝处理
    const valuesToSubmit = _.cloneDeep(
      preSubmitFormat
        ? preSubmitFormat(values, this.state.initialValues)
        : values
    );
    // shallowFields 设置时，根据配置移除不需要发送给后端的字段;
    shallowFields &&
      _.forEach(
        typeof shallowFields === 'string' ? [shallowFields] : shallowFields,
        field => {
          _.unset(valuesToSubmit, field);
        }
      );

    /**
     * flatFields 设置时，根据配置铺平。
     *  {
     *   code: {
     *    url
     *    name
     *   }
     *   token
     *  }
     *   变成
     *  {
     *   url: ''
     *   name: ''
     *   token: ''
     *  }
     */
    flatFields &&
      _.forEach(
        typeof flatFields === 'string' ? [flatFields] : flatFields,
        field => {
          const fieldValue = _.get(valuesToSubmit, field);
          fieldValue && _.set(valuesToSubmit, field, flatFieldKey(fieldValue));
        }
      );

    const result = await onSubmit(valuesToSubmit, form, callback);

    // 是否需要重新设置表单的初始值
    if (needReinitialize) {
      const nextInitialValues = postSubmitFormat
        ? postSubmitFormat(valuesToSubmit)
        : valuesToSubmit;

      // 重新设置初始值
      this.setState({
        initialValues: nextInitialValues,
      });
    }

    return result;
  };

  render() {
    const {
      style,
      className,
      children,
      debug,
      skin,
      ...restProps
    } = this.props;
    const { initialValues, loading } = this.state;

    const formProps: Config<FormValues> = {
      // 默认添加 FieldArray 需要的 mutators 参数，后面的 restProps 可以覆盖
      mutators: {
        ...arrayMutators,
        setFieldTouched,
      },
      ...restProps,
      onSubmit: this.handleSubmit,
      initialValues,
      debug:
        _.isFunction(debug) || _.isUndefined(debug)
          ? debug
          : (
              state: FormState<FormValues>,
              fieldStates: { [key: string]: FieldState<any> }
            ) => {
              /* tslint:disable */
              console.group('form-log');
              console.log('values', state.values);
              console.log('errors', state.errors);
              console.log('formState', state);
              console.log('fieldStates', fieldStates);
              console.groupEnd();
              /* tslint:enable */
            },
    };

    return (
      <div style={style} className={cx(className, { 'klever-form': skin })}>
        {loading ? <Spin /> : <FinalForm {...formProps}>{children}</FinalForm>}
      </div>
    );
  }
}
