import _ from 'lodash';
import React from 'react';
import { Select, Tooltip } from 'antd';

export default function select(props: any) {
  const { name, payload = {}, field, style, children, ...resetProps } = props;
  const { items = [], nameKey = 'name', valueKey = 'value' } = payload;

  return (
    <Select
      {...resetProps}
      value={
        !field.input.value && field.input.value !== 0
          ? undefined
          : field.input.value
      }
      style={_.assign({ width: 400 }, style)}
    >
      {_.map(items, (item: any, index: string) => (
        <Select.Option {...item} key={index} value={item[valueKey]}>
          {item.tooltip ? (
            <Tooltip title={item.tooltip} placement="right">
              <span style={{ display: 'inline-block', width: '100%' }}>
                {item[nameKey]}
              </span>
            </Tooltip>
          ) : (
            item[nameKey]
          )}
        </Select.Option>
      ))}
    </Select>
  );
}
