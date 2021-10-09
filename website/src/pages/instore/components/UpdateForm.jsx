import React from 'react';
import { useState, useEffect } from 'react';
import { StepsForm } from '@ant-design/pro-form';
import { Steps, Modal, Form, Input, message, Image } from 'antd';
import { connect } from 'umi';
import { setVisibleUpdateForm, submit, fetchToday } from '../actions';
import { RedEnvelopeOutlined, DashboardOutlined } from '@ant-design/icons';
import styles from './style.less';
import Pay from './pay';
import rules from '@/utils/rules';

const { Step } = Steps;

const UpdateForm = (props) => {
  const [form] = Form.useForm();
  const [form1] = Form.useForm();
  const [step1_status, setStatusStep1] = useState('process');
  const [step2_status, setStatusStep2] = useState('wait');
  const {
    actionRef,
    dispatch,
    instore: { visible_update_form, current },
  } = props;

  const inputStyle = {
    color: '#d9363e',
    border: '2px solid #e8e8e8',
    fontSize: '28px',
    width: '500px',
  };
  useEffect(() => {
    if (current) {
      formValuesInit(current);
    }
    return () => {};
  }, [current]);

  const onFinish = (values) => {
    dispatch(setVisibleUpdateForm({ visible: false }));
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
      dispatch(submit(Object.assign(current, buildObj(values, current.payment.id)))).then(() => {
        dispatch(fetchToday());
        actionRef.current.reload();
        message.success({
          content: '修改成功!',
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
    const { gross_weight, body_weight, legal_prise } = params;
    const { legal_weight_text, account_payable, account_payable_text } = getText(params);
    if (gross_weight && body_weight) {
      form.setFieldsValue({
        ...params,
        legal_weight_text,
      });
      if (legal_prise) {
        form1.setFieldsValue({
          account_payable_text,
          actual_payment: account_payable,
          pay_way: 'one',
          pay_way_one_type: 'wecat',
        });
      }
    }
  };
  const getImg = () => {
    if (current && current.createDateTime) {
      const imgPath =
        current.createDateTime.substring(0, current.createDateTime.indexOf('T')) + '/' + current.id;

      try {
        return (
          <Image.PreviewGroup>
            <Image width={220} src={require('../../../../../pictures/memoin/' + imgPath + '_gross.jpg')} />
            <Image width={220} src={require('../../../../../pictures/memoin/' + imgPath + '_body.jpg')} />
          </Image.PreviewGroup>
        );
      } catch (error) {
        return (
          <Image
            width={200}
            height={200}
            src="error"
            fallback="data:image/png;base64,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"
          />
        );
      }
    }
  };
  return (
    <div>
      <StepsForm
        key={current && current.id}
        onFinish={onFinish}
        formProps={{
          validateMessages: {
            required: '此项为必填项',
          },
        }}
        stepsFormRender={(dom, submitter) => {
          return (
            <Modal
              width={550}
              centered
              visible={visible_update_form}
              title={<h2>过磅单</h2>}
              onCancel={() => {
                dispatch(setVisibleUpdateForm({ visible: false, current: null }));
              }}
              destroyOnClose
              footer={submitter}
            >
              {dom}
            </Modal>
          );
        }}
        stepsRender={() => {
          return (
            <Steps>
              <Step status={step1_status} title="过磅单" icon={<DashboardOutlined />} />
              <Step status={step2_status} title="付款" icon={<RedEnvelopeOutlined />} />
            </Steps>
          );
        }}
        onCurrentChange={(current) => {
          if (current === 0) {
            setStatusStep1('process');
            setStatusStep2('wait');
          } else {
            setStatusStep1('finish');
            setStatusStep2('process');
          }
        }}
      >
        <StepsForm.StepForm
          form={form}
          name="base"
          size="30px"
          onValuesChange={onValuesChange}
          className={styles.form}
        >
          {getImg()}
          <Form.Item name="gross_weight" rules={[rules.int, rules.required]}>
            <Input autocomplete="off" prefix="毛重:" suffix="kg" style={inputStyle} />
          </Form.Item>
          <Form.Item name="body_weight" rules={[rules.int, rules.required]}>
            <Input autocomplete="off" prefix="皮重:" suffix="kg" style={inputStyle} />
          </Form.Item>
          <Form.Item name="deduct_weight" rules={[rules.int, rules.required]} initialValue="0">
            <Input autocomplete="off" prefix="扣除:" suffix="kg" style={inputStyle} />
          </Form.Item>
          <Form.Item name="legal_prise" rules={[rules.float, rules.required]} required>
            <Input autocomplete="off" prefix="价格:" suffix="元/kg" style={inputStyle} />
          </Form.Item>
          <Form.Item name="legal_weight_text">
            <Input
              autocomplete="off"
              prefix="净重:"
              suffix="kg"
              style={inputStyle}
              readOnly={true}
            />
          </Form.Item>
        </StepsForm.StepForm>
        <StepsForm.StepForm name="pay" size="30px" form={form1} className={styles.form}>
          <Form.Item name="account_payable_text">
            <Input
              autocomplete="off"
              prefix="应付:"
              suffix="元"
              style={inputStyle}
              readOnly={true}
            />
          </Form.Item>
          <Form.Item name="actual_payment">
            <Input autocomplete="off" prefix="实付:" suffix="元" style={inputStyle} readOnly />
          </Form.Item>
          <Pay form1={form1} />
        </StepsForm.StepForm>
      </StepsForm>
    </div>
  );
};
export default connect(({ instore }) => ({
  instore,
}))(UpdateForm);

const getText = (params) => {
  const { gross_weight, body_weight, deduct_weight, legal_prise } = params;
  const legal_weight = gross_weight - body_weight - deduct_weight;
  const legal_weight_text =
    gross_weight +
    ' - ' +
    body_weight +
    (deduct_weight ? ' - ' + deduct_weight : '') +
    ' = ' +
    legal_weight;
  let account_payable = '',
    account_payable_text = '';
  if (legal_prise) {
    account_payable = parseInt(legal_weight * legal_prise);
    account_payable_text =
      '(' +
      gross_weight +
      ' - ' +
      body_weight +
      (deduct_weight ? ' - ' + deduct_weight : '') +
      ') = ' +
      legal_weight +
      ' * ' +
      legal_prise +
      ' = ' +
      account_payable;
  }
  return { legal_weight_text, account_payable, account_payable_text };
};

const buildObj = (params, paymentId) => {
  const {
    pay_way,
    pay_way_one_type,
    pay_way_many_wecat: amount_wechat,
    pay_way_many_cash: amount_cash,
    pay_way_many_bank: amount_bank,
    pay_way_many_iou: amount_iou,
    actual_payment,
  } = params;
  let payment = undefined;
  if (pay_way === 'one') {
    switch (pay_way_one_type) {
      case 'wecat':
        payment = {
          amount_wechat: actual_payment,
          amount_total: actual_payment,
        };
        break;
      case 'cash':
        payment = {
          amount_cash: actual_payment,
          amount_total: actual_payment,
        };
        break;
      case 'bank':
        payment = {
          amount_bank: actual_payment,
          amount_total: actual_payment,
        };
        break;
      case 'iou':
        payment = {
          amount_iou: actual_payment,
          amount_total: actual_payment,
        };
        break;
    }
  } else {
    payment = {
      amount_wechat,
      amount_cash,
      amount_bank,
      amount_iou,
      amount_total:
        (parseInt(amount_wechat) || 0) +
        (parseInt(amount_cash) || 0) +
        (parseInt(amount_bank) || 0) +
        (parseInt(amount_iou) || 0),
    };
  }

  params.account_payable = undefined;
  params.legal_weight = undefined;
  params.legal_weight_text = undefined;
  // params.account_payable_text = undefined;
  params.pay_way = undefined;
  params.pay_way_one_type = undefined;
  params.pay_way_many_wecat = undefined;
  params.pay_way_many_cash = undefined;
  params.pay_way_many_bank = undefined;
  params.pay_way_many_iou = undefined;
  params.payment = { id: paymentId, ...payment };
  return params;
};
