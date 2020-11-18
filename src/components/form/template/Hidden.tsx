

import React from 'react';

export default function hidden(props: any) {
  const { name, payload, field, children, value, ...resetProps } = props;
  const { input } = field;
  input.onChange(value);

  return (
    <input {...resetProps} value={value}>
      {children}
    </input>
  );
}
