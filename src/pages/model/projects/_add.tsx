import _ from 'lodash';
import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import { Form, Field } from '@/components/form';
import { PlusOutlined } from '@ant-design/icons';
import { CreateProject } from '@/pages/model/_action';

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
        width={500}
        footer={null}
        destroyOnClose
        title={children}
        visible={visible}
        onCancel={() => setVisible(false)}
      >
        <Form
          onCancel={() => setVisible(false)}
          onSubmit={(values: any) =>
            CreateProject(_.get(values, 'name')).then(() => {
              onSuccess && onSuccess();
              setVisible(false);
            })
          }
        >
          <Field
            autoFocus
            required
            name="name"
            label="项目名称"
            labelWidth={72}
            componentStyle={{ width: 366 }}
            tips="开头需小写字母或者数字，小于256字符"
            validate={[
              (val: string) => {
                if (!val) {
                  return;
                }
                if (_.size(val) > 256 || !/^[a-z0-9].*?/.test(val)) {
                  return '不符合规则';
                }
              },
            ]}
          />
        </Form>
      </Modal>
    </>
  );
}
