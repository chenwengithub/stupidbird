import React from 'react';
import { Modal, Form, Input, Radio } from 'antd';

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
          .then((value) => {
            form.resetFields();
            onSubmit({ key: values.id, ...value });
          })
          .catch((info) => {
            console.log('Validate Failed:', info);
          });
      }}
    >
      <Form form={form} layout="vertical" name="form_in_modal" initialValues={values}>
        <Form.Item name="type" label="类型">
          <Radio.Group>
            <Radio value="expend">支出</Radio>
            <Radio value="income">收入</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item name="reason" label="事由">
          <Input autocomplete="off" />
        </Form.Item>
        <Form.Item name="money" label="金额">
          <Input autocomplete="off" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateForm;
