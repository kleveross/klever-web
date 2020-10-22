import React from 'react';
import { Card } from 'antd';
import Editor from '@/components/editor';

interface IProps {
  data: any;
  name: string;
}

export default function(props: IProps) {
  const { name, data } = props;

  return (
    <Card className="editor-root">
      <Editor name={name} data={data} />
    </Card>
  );
}
