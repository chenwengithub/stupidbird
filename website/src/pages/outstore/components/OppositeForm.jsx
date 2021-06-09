import React from 'react';
import { useState } from 'react';
import { Modal, Form, Input, message } from 'antd';
import { connect } from 'umi';
import { setVisibleOppositeForm, submit } from '../actions';
import rules from '@/utils/rules';

const OppositeForm = (props) => {
  const [form] = Form.useForm();
  visible_text;
  const [visible_text, setVisibleText] = useState(false);
  const {
    actionRef,
    dispatch,
    outstore: { current, visible_opposite_form },
  } = props;
  const onFinish = (values) => {
    dispatch(setVisibleOppositeForm({ visible: false, current: null }));
    form.resetFields();
    setVisibleText(false);
    const key = 'update';
    message.loading({
      content: '请稍后...',
      key,
      style: {
        marginTop: '10vh',
        fontSize: '24px',
      },
    });
    setTimeout(() => {
      dispatch(submit({ id: current.id, ...values, action: 'opposite' })).then(() => {
        actionRef.current.reload();
        message.success({
          content: '钢厂已收货!',
          key,
          duration: 1,
          style: {
            marginTop: '10vh',
            fontSize: '24px',
          },
        });
      });
    }, 500);
  };

  const onValuesChange = () => {
    formValuesInit(form.getFieldsValue());
  };
  const formValuesInit = (params) => {
    const { gross_weight_opposite, body_weight_opposite, deduct_weight, actual_prise } = params;
    if (gross_weight_opposite && body_weight_opposite && actual_prise) {
      form.setFieldsValue(
        getText({
          gross_weight: gross_weight_opposite,
          body_weight: body_weight_opposite,
          prise: actual_prise,
          deduct_weight,
        }),
      );
      setVisibleText(true);
    }
  };
  return (
    <Modal
      centered
      destroyOnClose
      visible={visible_opposite_form}
      title={<h2>添加钢厂磅单</h2>}
      okText="添加"
      cancelText="取消"
      onCancel={() => {
        dispatch(setVisibleOppositeForm({ visible: false, current: null }));
        form.resetFields();
        setVisibleText(false);
      }}
      onOk={() => {
        form.submit();
      }}
    >
      <Form
        key={current && current.id}
        name="opposite"
        form={form}
        onValuesChange={onValuesChange}
        onFinish={onFinish}
      >
        <Form.Item name="gross_weight_opposite" rules={[rules.float, rules.required]}>
          <Input prefix="毛重:" suffix="吨" />
        </Form.Item>
        <Form.Item name="body_weight_opposite" rules={[rules.float, rules.required]}>
          <Input prefix="皮重:" suffix="吨" />
        </Form.Item>
        <Form.Item
          name="deduct_weight"
          initialValue="0"
          rules={[rules.float, rules.required]}
        >
          <Input prefix="扣除:" suffix="吨（注意是吨！）" />
        </Form.Item>
        <Form.Item hidden name="legal_weight_opposite">
          <Input />
        </Form.Item>
        <Form.Item hidden name="opposite_payment">
          <Input />
        </Form.Item>
        <Form.Item name="actual_prise" rules={[rules.int, rules.required]}>
          <Input prefix="价格:" suffix="元/吨" />
        </Form.Item>
        <Form.Item hidden={!visible_text} name="legal_weight_opposite_text">
          <Input prefix="净重:" suffix="吨" readOnly={true} />
        </Form.Item>
        <Form.Item hidden={!visible_text} name="opposite_payment_text">
          <Input prefix="应付:" suffix="元" readOnly={true} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default connect(({ outstore }) => ({
  outstore,
}))(OppositeForm);

const getText = (params) => {
  const { gross_weight, body_weight, deduct_weight, prise, type } = params;
  const legal_weight = (gross_weight - body_weight - (deduct_weight || 0)).toFixed(2);
  const legal_weight_text =
    gross_weight +
    ' - ' +
    body_weight +
    (deduct_weight ? ' - ' + deduct_weight : '') +
    ' = ' +
    legal_weight;
  let payment = '',
    payment_text = '';
  payment = parseInt(legal_weight * prise);
  payment_text =
    '(' +
    gross_weight +
    ' - ' +
    body_weight +
    (deduct_weight ? ' - ' + deduct_weight : '') +
    ') = '+ legal_weight + ' * ' +
    prise +
    ' = ' +
    payment;

  return {
    legal_weight_opposite: legal_weight,
    legal_weight_opposite_text: legal_weight_text,
    opposite_payment: payment,
    opposite_payment_text: payment_text,
  };
};
