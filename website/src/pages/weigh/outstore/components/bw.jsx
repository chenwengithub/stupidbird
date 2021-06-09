import React from 'react';
import { useState, useEffect } from 'react';
import { StepsForm } from '@ant-design/pro-form';
import { Steps, Tag, Modal, Form, Input, message, Card } from 'antd';
import { connect } from 'umi';
import styles from './style.less';
import { setVisibleBW, submit, setLoadingListIndex } from '../actions';
import { DashboardOutlined, RedEnvelopeOutlined, CheckOutlined } from '@ant-design/icons';
import rules from '@/utils/rules';

const { Step } = Steps;

const BW = (props) => {
  const [form] = Form.useForm();
  const [gross_weight_own, setBodyWeight] = useState();
  const [step1_status, setStatusStep1] = useState('process');
  const [step2_status, setStatusStep2] = useState('wait');
  const [step2Data, setStep2Data] = useState(null);
  const {
    dispatch,
    weigh_outstore: { visible_body_weight, current },
  } = props;
  const datetime = new Date().toLocaleDateString();
  const inputStyle = {
    color: '#3654d9',
    border: '2px solid #e8e8e8',
    fontSize: '24px',
  };
  useEffect(() => {
    if (current) {
      formValuesInit({
        gross_weight_own: gross_weight_own,
        body_weight_own: current.body_weight_own,
        agreed_prise: current.agreed_prise,
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
          content: '出库成功!',
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
    const { gross_weight_own } = form.getFieldsValue();
    const { body_weight_own, agreed_prise } = current;
    formValuesInit({ body_weight_own, gross_weight_own, agreed_prise });
  };
  const waitTime = (time) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, time);
    });
  };
  const formValuesInit = (params) => {
    const {
      legal_weight_own_text,
      expected_payment_text,
      legal_weight_own,
      expected_payment,
    } = getText(params);
    const { gross_weight_own } = params;
    setStep2Data({
      legal_weight_own_text,
      expected_payment_text,
      steel_plant: current.steel_plant.name,
      car_number: current.truck.car_number,
      intermediary: current.intermediary.name,
      gross_weight_own,
      body_weight_own: current.body_weight_own,
      legal_weight_own,
      agreed_prise: current.agreed_prise,
    });
    if (gross_weight_own) {
      form.setFieldsValue({
        gross_weight_own,
        legal_weight_own_text,
        expected_payment_text,
        legal_weight_own,
        expected_payment,
      });
    } else {
      form.setFieldsValue({
        legal_weight_own_text: '',
        expected_payment_text: '',
        legal_weight_own: '',
        expected_payment: '',
      });
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
              <Step status={step2_status} title="核对" icon={<CheckOutlined />} />
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
            color="#3654d9"
          >
            磅显：{gross_weight_own} kg
          </Tag>
          <Form.Item name="gross_weight_own" rules={[rules.float, rules.required]}>
            <Input prefix="毛重:" suffix="吨" style={inputStyle} />
          </Form.Item>
          <Form.Item hidden name="legal_weight_own">
            <Input />
          </Form.Item>
          <Form.Item hidden name="expected_payment">
            <Input />
          </Form.Item>
          <Form.Item name="legal_weight_own_text">
            <Input prefix="净重:" suffix="kg" style={inputStyle} readOnly={true} />
          </Form.Item>
          <Form.Item name="expected_payment_text">
            <Input prefix="应付:" suffix="元" style={inputStyle} readOnly={true} />
          </Form.Item>
        </StepsForm.StepForm>
        <StepsForm.StepForm name="pay" className={styles.form}>
          {step2Data && (
            <>
              <Card title="出库磅单" extra={<a href="#">打印磅单</a>}>
                <p>目的地：{step2Data.steel_plant}</p>
                <p>车牌号：{step2Data.car_number}</p>
                <p>毛重：{step2Data.gross_weight_own}吨</p>
                <p>皮重：{step2Data.body_weight_own}吨</p>
                <p>净重：{step2Data.legal_weight_own}吨</p>
                <p>日期：{datetime}</p>
              </Card>
              <Card style={{ marginTop: '10px' }}>
                <p>暂定价格：{step2Data.agreed_prise}</p>
                <p>重量公式：{step2Data.legal_weight_own_text}</p>
                <p>暂定总额：{step2Data.expected_payment_text}</p>
                <p>中间人：{step2Data.intermediary}</p>
                <p>日期：{datetime}</p>
              </Card>
            </>
          )}
        </StepsForm.StepForm>
      </StepsForm>
    </div>
  );
};
export default connect(({ weigh_outstore, loading }) => ({
  weigh_outstore,
  loading: loading.models,
}))(BW);

const getText = (params) => {
  const { body_weight_own, gross_weight_own, agreed_prise } = params;
  const legal_weight_own = (gross_weight_own - body_weight_own).toFixed(2);
  const legal_weight_own_text =
    gross_weight_own + ' - ' + body_weight_own + ' = ' + legal_weight_own;

  const expected_payment = parseInt(legal_weight_own * agreed_prise);
  const expected_payment_text =
    '(' +
    gross_weight_own +
    ' - ' +
    body_weight_own +
    ') = ' +
    legal_weight_own +
    ' * ' +
    agreed_prise +
    ' = ' +
    expected_payment;
  return { legal_weight_own_text, expected_payment, expected_payment_text, legal_weight_own };
};

const buildObj = (params) => {
  params.steel_plant = undefined;
  params.truck = undefined;
  params.intermediary = undefined;
  return params;
};
