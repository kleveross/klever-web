const flatRes: any = (res: any, key: any, val: any, pre: string = '') => {
  const prefix = key;
  return typeof val === 'object'
    ? Object.keys(val).reduce(
        (prev, curr) => flatRes(prev, curr, val[curr], prefix),
        res
      )
    : Object.assign(res, { [prefix]: val });
};

/**
 * 铺平数据结构
 *
 * {
 *   url:
 *   name: ''
 *   token: ''
 * }
 *  其中 url 和 name 通过调用接口的一个列表获取，这样导致 field 定义的时候不方便
 *  所以提供 flat 方法, 通过列表获取可选的栏目
 *  {
 *   code: {
 *    url
 *    name
 *   }
 *   token
 *  }
 *
 *   变成
 *  {
 *   url: ''
 *   name: ''
 *   token: ''
 *  }
 */

export function flatFieldKey(input: any) {
  return Object.keys(input).reduce(
    (prev, curr) => flatRes(prev, curr, input[curr]),
    {}
  );
}

/**
 * 合成多个 validator，来校验输入值
 */
export const composeValidators = (...validators: any[]) => {
  return (value: any, allValues: any, fieldState: any) => {
    return validators.reduce((error, validator) => {
      return (
        error ||
        (typeof validator === 'function' &&
          validator(value, allValues, fieldState))
      );
    }, undefined);
  };
};
