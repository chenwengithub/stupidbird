import React from 'react';
import { useState, useEffect } from 'react';
import { StepsForm } from '@ant-design/pro-form';
import { Steps, Tag, Modal, Form, Input, message, Radio, Card, Space, Checkbox } from 'antd';
import { connect } from 'umi';
import styles from './style.less';
import { setVisibleBW, submit, setLoadingListIndex } from '../actions';
import { DashboardOutlined, RedEnvelopeOutlined } from '@ant-design/icons';
import rules from '@/utils/rules';
import Pay from './pay';
const { Step } = Steps;

const BW = (props) => {
  const [form] = Form.useForm();
  const [form1] = Form.useForm();
  const [body_weight, setBodyWeight] = useState();
  const [step1_status, setStatusStep1] = useState('process');
  const [step2_status, setStatusStep2] = useState('wait');
  const {
    dispatch,
    weigh_instore: { visible_body_weight, current },
  } = props;

  const inputStyle = {
    color: '#d9363e',
    border: '2px solid #e8e8e8',
    fontSize: '24px',
    width: '500px',
  };
  useEffect(() => {
    if (current) {
      formValuesInit({
        gross_weight: current.gross_weight,
        body_weight: body_weight,
        deduct_weight: current.deduct_weight,
        legal_prise: current.legal_prise,
      });
    }
  }, [current]);

  const onFinish = (values) => {
    dispatch(setVisibleBW(false));
    dispatch(setLoadingListIndex(current.id));
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
      dispatch(submit(Object.assign(current, buildObj(values)))).then(() => {
        dispatch(setLoadingListIndex(''));
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
    const { body_weight, deduct_weight, legal_prise } = form.getFieldsValue();
    const { gross_weight } = current;
    formValuesInit({ gross_weight, body_weight, deduct_weight, legal_prise });
  };

  const formValuesInit = (params) => {
    const { legal_prise, body_weight } = params;
    const { legal_weight_text, account_payable, account_payable_text } = getText(params);

    form.setFieldsValue({
      ...params,
    });
    if (body_weight) {
      form.setFieldsValue({
        legal_weight_text,
      });
      if (legal_prise) {
        form1.setFieldsValue({
          account_payable_text,
          actual_payment: account_payable,
          pay_way: 'one',
          pay_way_one_type: 'wecat',
        });
      } else {
        form1.setFieldsValue({
          account_payable_text: '',
          actual_payment: '',
        });
      }
    } else {
      form.setFieldsValue({
        legal_weight_text: '',
      });
    }
  };
  return (
    <div>
      <StepsForm
        key={current && current.id}
        onFinish={onFinish}
        stepsFormRender={(dom, submitter) => {
          return (
            <Modal
              width={550}
              centered
              visible={visible_body_weight}
              title={<h2>过磅</h2>}
              onCancel={() => {
                dispatch(setVisibleBW({ visible: false, current: null }));
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
          onValuesChange={onValuesChange}
          className={styles.form}
        >
          <Tag
            style={{
              textAlign: 'center',
              lineHeight: '64px',
              fontSize: '40px',
              marginBottom: '30px',
              width: '100%',
            }}
            color="#d9363e"
          >
            磅显：{body_weight} kg
          </Tag>
          <Form.Item name="body_weight" rules={[rules.int, rules.required]}>
            <Input prefix="皮重:" suffix="kg" style={inputStyle} />
          </Form.Item>
          <Form.Item name="deduct_weight" rules={[rules.int, rules.required]} initialValue="0">
            <Input prefix="扣除:" suffix="kg" style={inputStyle} />
          </Form.Item>
          <Form.Item name="legal_prise" rules={[rules.float, rules.required]}>
            <Input prefix="价格:" suffix="元/kg" style={inputStyle} />
          </Form.Item>
          <Form.Item name="legal_weight_text">
            <Input prefix="净重:" suffix="kg" style={inputStyle} readOnly={true} />
          </Form.Item>
        </StepsForm.StepForm>
        <StepsForm.StepForm name="pay" form={form1} className={styles.form}>
          <Form.Item name="account_payable_text" style={{ lineHeight: '40px' }}>
            <Input prefix="应付:" suffix="元" style={inputStyle} readOnly={true} />
          </Form.Item>
          <Form.Item name="actual_payment">
            <Input prefix="实付:" suffix="元" style={inputStyle} readOnly={true} />
          </Form.Item>
          <Pay form1={form1} />
        </StepsForm.StepForm>
      </StepsForm>
    </div>
  );
};
export default connect(({ weigh_instore, loading }) => ({
  weigh_instore,
  loading: loading.models,
}))(BW);

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

const buildObj = (params) => {
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
  params.pay_way_many = undefined;
  params.payment = payment;
  return params;
};
