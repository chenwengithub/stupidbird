import React from 'react';
import { useState, useEffect } from 'react';
import { Modal, Form, Input, message, Tag, Switch } from 'antd';
import { connect } from 'umi';
import { setVisiblePaymentForm, submit } from '../actions';
import rules from '@/utils/rules';

const PaymentForm = (props) => {
  const [form] = Form.useForm();
  const [payment_done, setPaymentDone] = useState(false);
  const [rest, setRest] = useState('');
  const [visible_switch, setVisibleSwitch] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const {
    actionRef,
    dispatch,
    outstore: { current, visible_payment_form },
  } = props;
  const onFinish = (values) => {
    dispatch(setVisiblePaymentForm({ visible: false, current: null }));
    form.resetFields();
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
      dispatch(submit({ id: current.id, ...values, payment_done, action: 'payment' })).then(() => {
        actionRef.current.reload();
        message.success({
          content: '款项已更新!',
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
  useEffect(() => {
    if (current) {
      const {
        advance_payment,
        rest_payment,
        actual_payment,
        payment_done,
        opposite_payment,
      } = current;
      setPaymentDone(payment_done);
      setVisibleSwitch(advance_payment ? true : false);
      setRest(advance_payment && opposite_payment - actual_payment);
      form.setFieldsValue({
        advance_payment,
        rest_payment,
        actual_payment,
      });
    }
    return () => {};
  }, [current]);
  const onValuesChange = () => {
    const { opposite_payment } = current;
    const { advance_payment, rest_payment } = form.getFieldsValue();
    setVisibleSwitch(advance_payment ? true : false);
    if (advance_payment) {
      let actual_payment = parseInt(advance_payment);
      if (rest_payment) {
        actual_payment = parseInt(advance_payment) + parseInt(rest_payment);
        setPaymentDone(opposite_payment == actual_payment);
      }
      form.setFieldsValue({ actual_payment });
      setRest(opposite_payment - actual_payment);
    }
  };
  return (
    <Modal
      centered
      destroyOnClose
      visible={visible_payment_form}
      title={<h2>添加钢厂磅单</h2>}
      okText="添加"
      cancelText="取消"
      onCancel={() => {
        dispatch(setVisiblePaymentForm({ visible: false, current: null }));
        form.resetFields();
      }}
      onOk={() => {
        form.submit();
      }}
    >
      <Tag
        style={{
          textAlign: 'center',
          lineHeight: '44px',
          fontSize: '18px',
          marginBottom: '30px',
          width: '100%',
        }}
        hidden={current && !current.opposite_payment}
        color="red"
      >
        总额：{current && current.opposite_payment} 元， 剩余：
        {rest} 元
      </Tag>
      <Form
        key={current && current.id}
        name="payment"
        form={form}
        onValuesChange={onValuesChange}
        onFinish={onFinish}
      >
        <Form.Item name="actual_payment" hidden>
          <Input />
        </Form.Item>
        <Form.Item name="advance_payment" rules={[rules.int]}>
          <Input prefix="预付款:" suffix="元" />
        </Form.Item>
        <Form.Item
          name="rest_payment"
          hidden={current && !current.opposite_payment}
          rules={[rules.int]}
        >
          <Input
            prefix="尾款:"
            suffix={
              visible_switch && (
                <Switch
                  onChange={(checked) => {
                    if (checked) {
                      setReadOnly(true);
                      form.setFieldsValue({ rest_payment: rest });
                      setPaymentDone(true);
                      onValuesChange();
                    } else {
                      setReadOnly(false);
                      form.resetFields(['rest_payment']);
                      setPaymentDone(false);
                      onValuesChange();
                    }
                  }}
                  checkedChildren="款项付清"
                  unCheckedChildren="是否付清"
                  defaultChecked={payment_done}
                />
              )
            }
            readOnly={readOnly}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default connect(({ outstore }) => ({
  outstore,
}))(PaymentForm);
