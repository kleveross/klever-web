import _ from 'lodash';
import React from 'react';
import { Modal } from 'antd';
import { Form, Field } from '@/components/form';
import { CreateModelJob, ListVersions } from '@/pages/model/_action';

interface IProps{
  title: string;
  version: string;
  format: string;
  params: {
    id: string;
    name: string;
    model: string;
  },
  onSuccess: () => void;
  onCancel: () => void;
}

export default function(props: IProps){
  const { version, format, title, params, onSuccess, onCancel } = props;
  const transform: {
    [index: string]: any;
  } = {
    caffemodel: [{
      name: 'NetDef',
      value: 'NetDef',
    }],
    h5: [{
      name: 'SavedModel',
      value: 'SavedModel',
    }],
    mxnetparams: [{
      name: 'ONNX',
      value: 'ONNX',
    }],
  };

  return (
    <Modal
      centered
      width={560}
      footer={null}
      title={title}
      destroyOnClose
      onCancel={onCancel}
      visible={!!(version && format)}
    >
      <Form
        debug
        onCancel={onCancel}
        initialValues={{
          format: _.get(transform, [_.toLower(format), '0', 'value']),
          version: `${version}-${_.toLower(format)}`,
        }}
        validate={async (values: any) => {
          const versionLists = await ListVersions({
            current: 1,
            pageSize: 1,
            query: `tags=${_.get(values, 'version')}`,
            ...params,
          });

          if(_.size(versionLists) > 0){
            return {
              version: '该版本已存在',
            };
          }
        }}
        onSubmit={(values: any) => CreateModelJob({
          name: format,
          version: version,
        }, {
          name: _.get(values, 'format'),
          version: _.get(values, 'version'),
        }).then(() => {
          onSuccess && onSuccess();
        })}
      >
        <Field
          required
          name="format"
          label="期望模型格式"
          labelWidth={96}
          component="select"
          placeholder="请选择"
          componentStyle={{width:380}}
          payload={{
            items: transform[_.toLower(format)],
          }}
        />
        <Field
          required
          autoFocus
          name="version"
          label="期望模型版本"
          labelWidth={96}
          componentStyle={{width:380}}
        />
      </Form>
    </Modal>
  );
}
