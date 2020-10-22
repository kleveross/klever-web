import _ from 'lodash';
import React from 'react';
import Desc from '@/components/desc';

interface IProps {
  url: string;
}

export default function(props: IProps) {
  const { url } = props;

  return (
    <Desc
      style={{ minHeight: 300 }}
      data={[{
        label: '访问地址',
        value: url,
      }, {
        label: '访问方式',
        value: <a href={url} target="_blank">Link</a>
      }]}
    />
  );
}
