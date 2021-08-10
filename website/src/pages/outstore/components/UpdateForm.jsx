import React from 'react';
import { useState, useEffect } from 'react';
import { StepsForm } from '@ant-design/pro-form';
import { Steps, Modal, Form, Input, message, Select } from 'antd';
import { connect } from 'umi';
import { setVisibleUpdateForm, submit } from '../actions';
import { RedEnvelopeOutlined, DashboardOutlined } from '@ant-design/icons';
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
    outstore: {
      current,
      visible_update_form,
      options_steel_plant,
      options_truck,
      options_intermediary,
    },
  } = props;
  useEffect(() => {
    if (current) {
      form.setFieldsValue({
        ...current,
        steel_plant: current.steel_plant.id,
        truck: current.truck.id,
        intermediary: current.intermediary.id,
      });
      form1.setFieldsValue(current);
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
      console.log(values);
      dispatch(submit({ ...Object.assign(current, values), action: 'update' })).then(() => {
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
    const { gross_weight_own, body_weight_own, agreed_prise } = params;
    if (gross_weight_own && body_weight_own && agreed_prise) {
      form.setFieldsValue(
        getText({
          gross_weight: gross_weight_own,
          body_weight: body_weight_own,
          prise: agreed_prise,
          type: 'step1',
        }),
      );
      form1.setFieldsValue(
        getText({
          gross_weight: gross_weight_own,
          body_weight: body_weight_own,
          prise: agreed_prise,
          type: 'step2',
        }),
      );
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
              title={<h2>修改</h2>}
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
              <Step status={step1_status} title="出库单" icon={<DashboardOutlined />} />
              <Step status={step2_status} title="结算" icon={<RedEnvelopeOutlined />} />
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
          <Form.Item name="steel_plant" rules={[rules.required]}>
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
          <Form.Item name="truck" rules={[rules.required]}>
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
          <Form.Item name="intermediary" rules={[rules.required]}>
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
            <Input autocomplete="off" prefix="毛重:" suffix="吨" />
          </Form.Item>
          <Form.Item name="body_weight_own" rules={[rules.float, rules.required]}>
            <Input autocomplete="off" prefix="皮重:" suffix="吨" />
          </Form.Item>
          <Form.Item hidden name="legal_weight_own">
            <Input autocomplete="off" />
          </Form.Item>
          <Form.Item hidden name="expected_payment">
            <Input autocomplete="off" />
          </Form.Item>
          <Form.Item name="agreed_prise" rules={[rules.int, rules.required]}>
            <Input autocomplete="off" prefix="价格:" suffix="元/吨" />
          </Form.Item>
        </StepsForm.StepForm>
        <StepsForm.StepForm name="pay" form={form1} onValuesChange={onValuesChange}>
          <Form.Item name="legal_weight_own_text">
            <Input autocomplete="off" prefix="净重:" suffix="吨" readOnly={true} />
          </Form.Item>
          <Form.Item name="expected_payment_text">
            <Input autocomplete="off" prefix="应付:" suffix="元" readOnly={true} />
          </Form.Item>
        </StepsForm.StepForm>
      </StepsForm>
    </div>
  );
};
export default connect(({ outstore }) => ({
  outstore,
}))(UpdateForm);

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
    ')  = ' +
    legal_weight +
    ' * ' +
    prise +
    ' = ' +
    payment;

  if (type === 'step1') {
    return {
      legal_weight_own: legal_weight,
      expected_payment: payment,
    };
  } else {
    return {
      legal_weight_own_text: legal_weight_text,
      expected_payment_text: payment_text,
    };
  }
};
