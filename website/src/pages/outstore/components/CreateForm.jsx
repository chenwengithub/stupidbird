import React from 'react';
import { useState } from 'react';
import { StepsForm } from '@ant-design/pro-form';
import { Steps, Modal, Form, Input, message, Select } from 'antd';
import { connect } from 'umi';
import { setVisibleCreateForm, submit } from '../actions';
import { RedEnvelopeOutlined, DashboardOutlined } from '@ant-design/icons';
import rules from '@/utils/rules';

const { Step } = Steps;

const CreateForm = (props) => {
  const [form] = Form.useForm();
  const [form1] = Form.useForm();
  const [step1_status, setStatusStep1] = useState('process');
  const [step2_status, setStatusStep2] = useState('wait');
  const [key, setKey] = useState('create');
  const {
    actionRef,
    dispatch,
    outstore: { visible_create_form, options_steel_plant, options_truck, options_intermediary },
  } = props;

  const onFinish = (values) => {
    dispatch(setVisibleCreateForm(false));
    setKey(key + 1);
    form.resetFields();
    form1.resetFields();
    const key = 'add';
    message.loading({
      content: '请稍后...',
      key,
      style: {
        marginTop: '10vh',
        fontSize: '24px',
      },
    });
    setTimeout(() => {
      dispatch(submit(values)).then(() => {
        actionRef.current.reload();
        message.success({
          content: '添加成功!',
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
    formValuesInit(form.getFieldsValue(), form1.getFieldsValue());
  };
  const waitTime = (time) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, time);
    });
  };
  const formValuesInit = (params1, params2) => {
    const { gross_weight_own, body_weight_own, agreed_prise } = params1;
    const { gross_weight_opposite, body_weight_opposite, deduct_weight, actual_prise } = params2;
    if (gross_weight_own && body_weight_own && agreed_prise) {
      form.setFieldsValue(
        getText({
          gross_weight: gross_weight_own,
          body_weight: body_weight_own,
          prise: agreed_prise,
          type: 'own',
        }),
      );
    }
    if (gross_weight_opposite && body_weight_opposite && deduct_weight && actual_prise) {
      form1.setFieldsValue(
        getText({
          gross_weight: gross_weight_opposite,
          body_weight: body_weight_opposite,
          prise: actual_prise,
          deduct_weight,
          type: 'opposite',
        }),
      );
    }
  };
  return (
    <div>
      <StepsForm
        key={key}
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
              visible={visible_create_form}
              title={<h2>手动添加</h2>}
              onCancel={() => {
                dispatch(setVisibleCreateForm(false));
                form.resetFields();
                form1.resetFields();
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
              <Step status={step1_status} title="出厂信息" icon={<DashboardOutlined />} />
              <Step status={step2_status} title="到厂信息" icon={<RedEnvelopeOutlined />} />
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
        <StepsForm.StepForm name="base" form={form} onValuesChange={onValuesChange}>
          <Form.Item name="steel_plant">
            <Select
              showSearch
              optionFilterProp="children"
              placeholder="目的地"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              filterSort={(optionA, optionB) =>
                optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
              }
              options={options_steel_plant}
            />
          </Form.Item>
          <Form.Item name="truck">
            <Select
              placeholder="货车"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              filterSort={(optionA, optionB) =>
                optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
              }
              options={options_truck}
            ></Select>
          </Form.Item>
          <Form.Item name="intermediary">
            <Select
              placeholder="中间人"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              filterSort={(optionA, optionB) =>
                optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
              }
              options={options_intermediary}
            ></Select>
          </Form.Item>
          <Form.Item name="gross_weight_own" rules={[rules.float, rules.required]}>
            <Input prefix="毛重:" suffix="吨" />
          </Form.Item>
          <Form.Item name="body_weight_own" rules={[rules.float, rules.required]}>
            <Input prefix="皮重:" suffix="吨" />
          </Form.Item>
          <Form.Item hidden name="legal_weight_own">
            <Input />
          </Form.Item>
          <Form.Item hidden name="expected_payment">
            <Input />
          </Form.Item>
          <Form.Item name="agreed_prise" rules={[rules.int, rules.required]}>
            <Input prefix="价格:" suffix="元/吨" />
          </Form.Item>
          <Form.Item name="legal_weight_own_text">
            <Input prefix="净重:" suffix="吨" readOnly={true} />
          </Form.Item>
          <Form.Item name="expected_payment_text">
            <Input prefix="应付:" suffix="元" readOnly={true} />
          </Form.Item>
        </StepsForm.StepForm>
        <StepsForm.StepForm name="pay" form={form1} onValuesChange={onValuesChange}>
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
          <Form.Item name="legal_weight_opposite_text">
            <Input prefix="净重:" suffix="吨" readOnly={true} />
          </Form.Item>
          <Form.Item name="opposite_payment_text">
            <Input prefix="应付:" suffix="元" readOnly={true} />
          </Form.Item>
        </StepsForm.StepForm>
      </StepsForm>
    </div>
  );
};
export default connect(({ outstore }) => ({
  outstore,
}))(CreateForm);

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
    ')  = '+ legal_weight + ' * ' +
    prise +
    ' = ' +
    payment;

  if (type === 'own') {
    return {
      legal_weight_own: legal_weight,
      legal_weight_own_text: legal_weight_text,
      expected_payment: payment,
      expected_payment_text: payment_text,
    };
  } else {
    return {
      legal_weight_opposite: legal_weight,
      legal_weight_opposite_text: legal_weight_text,
      opposite_payment: payment,
      opposite_payment_text: payment_text,
    };
  }
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
      amount_total: amount_wechat + amount_cash + amount_bank + amount_iou,
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
  params.payment = payment;
  return params;
};
