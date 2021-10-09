import React from 'react';
import { useState, useEffect } from 'react';
import { StepsForm } from '@ant-design/pro-form';
import { Steps, Modal, Form, Input, message, Select, Image } from 'antd';
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
  const getImg = () => {
    if (current && current.createDateTime) {
      const imgPath =
        current.createDateTime.substring(0, current.createDateTime.indexOf('T')) + '/' + current.id;

      try {
        return (
          <Image.PreviewGroup>
            <Image
              width={220}
              src={require('../../../../../pictures/memoout/' + imgPath + '_body.jpg')}
            />
            <Image
              width={220}
              src={require('../../../../../pictures/memoout/' + imgPath + '_gross.jpg')}
            />
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
          {getImg()}
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
