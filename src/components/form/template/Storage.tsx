import _ from 'lodash';
import React from 'react';
import { Input, Select } from 'antd';

function splitValue(value: string) {
  let inputValue = '';
  let inputUnit = 'Gi';
  if (value === '0') {
    inputValue = '0';
  } else if (value === '') {
    inputValue = '';
  } else {
    inputValue = `${value}`.replace(/^(.*)(Mi|Gi|Ti)$/, '$1');
    inputUnit = `${value}`.substr(inputValue.length);
  }
  return {
    inputValue,
    inputUnit,
  };
}

export default function storage(props: any) {
  const { name, payload, style, field, children, ...resetProps } = props;
  const {
    input: { value, onChange },
  } = field;
  const { inputValue, inputUnit = 'Gi' } = splitValue(value);

  return (
    <Input.Group compact>
      <Input
        {...resetProps}
        value={inputValue}
        onChange={val => {
          const value = val.target.value;
          onChange(`${value}${inputUnit}`);
        }}
        style={_.assign({ width: 100 }, style)}
      />
      <Select
        style={{ width: 68 }}
        value={inputUnit}
        onChange={(val: string) => {
          onChange(`${inputValue}${val}`);
        }}
      >
        {['Mi', 'Gi', 'Ti'].map(unit => (
          <Select.Option key={unit} value={unit}>
            {unit}B
          </Select.Option>
        ))}
      </Select>
    </Input.Group>
  );
}
