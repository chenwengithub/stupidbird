import React from 'react';
import { Modal, Form, Input } from 'antd';

const UpdateForm = (props) => {
  const { modalVisible, onCancel, onSubmit, values } = props;
  const [form] = Form.useForm();
  return (
    <Modal
      visible={modalVisible}
      title="编辑"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then(value => {
            form.resetFields();
            onSubmit({ key: values.id, ...value });
          })
          .catch(info => {
            console.log('Validate Failed:', info);
          });
      }}
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={values}
      >
        <Form.Item
          name="name"
          label="姓名"
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="tel"
          label="电话"
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="remark"
          label="备注"
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateForm;
