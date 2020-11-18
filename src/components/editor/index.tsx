import _ from 'lodash';
import React from 'react';
import json2yaml from 'json2yaml';
import Header from './header';
import CodeMirror from 'react-codemirror';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/lib/codemirror.css';
import './index.less';

interface IProps {
  name: string;
  data: any;
}

export default function(props: IProps) {
  const { name, data } = props;
  const renderValue = json2yaml.stringify(data);

  return (
    <div className="editor-root">
      <Header
        value={renderValue}
        onDownload={() => {
          const downloadAnchorNode = document.createElement('a');
          downloadAnchorNode.setAttribute(
            'href',
            `data:text/x-yaml;charset=utf-8,${encodeURIComponent(renderValue)}`,
          );
          downloadAnchorNode.setAttribute('download', `${name}.ymal`);
          document.body.appendChild(downloadAnchorNode);
          downloadAnchorNode.click();
          downloadAnchorNode.remove();
        }}
      />
      <CodeMirror
        value={renderValue}
        options={{
          mode: {
            json: true,
            name: 'javascript',
          },
          lineNumbers: true,
          lineWrapping: true,
          readOnly: true,
        }}
      />
    </div>
  );
}
