import React from 'react';
import { Field } from '@/components/form';

import './index.less';

interface IQuotaProps {
  name: string;
}

export default function(props: IQuotaProps) {
  const { name } = props;

  return (
    <div className="quota-root">
      <Field
        required
        label="CPU"
        labelWidth={52}
        name={`${name}.cpu`}
        component="input"
        addonAfter="Core"
        componentStyle={{ width: 154 }}
      />
      <Field
        required
        label="内存"
        labelWidth={52}
        name={`${name}.memory`}
        component="storage"
      />
      <Field
        name={`${name}.gpu`}
        label="GPU"
        labelWidth={52}
        component="input"
        addonAfter="Card"
        componentStyle={{ width: 154 }}
      />
    </div>
  );
}
