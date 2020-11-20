import _ from 'lodash';
import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import { Form, Field } from '@/components/form';
import { PlusOutlined } from '@ant-design/icons';
import Quota from '@/components/quota';
import { CreateServing } from '@/pages/serving/_action';

interface IProps {
  children: string;
  onSuccess: () => void;
}

export default function(props: IProps) {
  const { children, onSuccess } = props;
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setVisible(true)}
      >
        {children}
      </Button>
      <Modal
        centered
        width={759}
        footer={null}
        destroyOnClose
        title={children}
        visible={visible}
        onCancel={() => setVisible(false)}
      >
        <Form
          debug
          onCancel={() => setVisible(false)}
          onSubmit={(values: any) => {
            const submitValues = _.assign(
              {
                apiVersion: 'machinelearning.seldon.io/v1alpha2',
                kind: 'SeldonDeployment',
              },
              values,
            );

            _.set(submitValues, 'metadata.namespace', 'kleveross-system');
            const gpuValue = _.get(
              submitValues,
              'spec.predictors.0.componentSpecs.0.spec.containers.0.resources.requests.gpu',
            );
            if (gpuValue) {
              _.set(
                submitValues,
                'spec.predictors.0.componentSpecs.0.spec.containers.0.resources.requests["nvidia.com/gpu"]',
                gpuValue,
              );
              _.unset(
                submitValues,
                'spec.predictors.0.componentSpecs.0.spec.containers.0.resources.requests.gpu',
              );
            }
            _.set(
              submitValues,
              'spec.predictors.0.componentSpecs.0.spec.containers.0.resources.limits',
              _.get(
                values,
                'spec.predictors.0.componentSpecs.0.spec.containers.0.resources.requests',
              ),
            );
            const modelUri = _.get(values, 'spec.predictors.0.graph.modelUri');
            const modelName = modelUri.split(/\/|:/)[1];
            _.set(
              submitValues,
              'spec.predictors.0.componentSpecs.0.metadata.name',
              modelName,
            );
            _.set(submitValues, 'spec.predictors.0.graph', {
              name: modelName,
              modelUri: `harbor-harbor-core.kleveross-system/${modelUri}`,
              serviceAccountName: 'default',
              parameters: [
                {
                  name: 'format',
                  value: modelName,
                },
              ],
            });

            return CreateServing(submitValues).then(() => {
              onSuccess && onSuccess();
              setVisible(false);
            });
          }}
        >
          <Field
            autoFocus
            required
            name="metadata.name"
            label="服务名称"
            labelWidth={72}
            tips="只能包含小写字母、数字、横线(-)，并且只能以字母和数字开头和结尾，不能超过 63 个字符"
            validate={[
              (val: string) => {
                if (!val) {
                  return;
                }
                if (_.size(val) > 63 || !/^[a-z0-9].*?/.test(val)) {
                  return '不符合规则';
                }
              },
            ]}
          />
          <Field
            required
            name="spec.predictors.0.graph.modelUri"
            label="模型名称"
            labelWidth={72}
            tips="只能包含小写字母、数字、横线(-)，并且只能以字母和数字开头和结尾，不能超过 63 个字符"
            validate={[
              (val: string) => {
                if (!val) {
                  return;
                }
                if (val.split(/\/|:/).length !== 3) {
                  return '不符合规则';
                }
                if (_.size(val) > 63 || !/^[a-z0-9].*?/.test(val)) {
                  return '不符合规则';
                }
              },
            ]}
          />
          <Field
            noField
            label="资源配额"
            labelWidth={72}
            component={
              <Quota name="spec.predictors.0.componentSpecs.0.spec.containers.0.resources.requests" />
            }
          />
          <Field
            required
            name="spec.predictors.0.componentSpecs.0.replicas"
            label="副本数"
            labelWidth={72}
            component="inputNumber"
          />
        </Form>
      </Modal>
    </>
  );
}
