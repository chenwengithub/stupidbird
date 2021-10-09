import React from 'react';
import { useState, useEffect } from 'react';
import { StepsForm } from '@ant-design/pro-form';
import { Steps, Tag, Modal, Form, Input, message, Card, Image } from 'antd';
import { connect } from 'umi';
import styles from './style.less';
import { setVisibleBW, submit, setLoadingListIndex } from '../actions';
import { DashboardOutlined, RedEnvelopeOutlined, CheckOutlined } from '@ant-design/icons';
import rules from '@/utils/rules';
import printJS from 'print-js';

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
  const getImg = () => {
    if (current && current.createDateTime) {
      const imgPath =
        current.createDateTime.substring(0, 10) + '/' + current.id;
      try {
        return (
          <Image
            width={220}
            src={require('../../../../../../pictures/memoout/' + imgPath + '_body.jpg')}
          />
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
              maskClosable={false}
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
          {/* <Tag
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
          </Tag> */}

          {getImg()}
          <Form.Item name="gross_weight_own" rules={[rules.float, rules.required]}>
            <Input autocomplete="off" prefix="毛重:" suffix="吨" style={inputStyle} />
          </Form.Item>
          <Form.Item hidden name="legal_weight_own">
            <Input autocomplete="off" />
          </Form.Item>
          <Form.Item hidden name="expected_payment">
            <Input autocomplete="off" />
          </Form.Item>
          <Form.Item name="legal_weight_own_text">
            <Input
              autocomplete="off"
              prefix="净重:"
              suffix="kg"
              style={inputStyle}
              readOnly={true}
            />
          </Form.Item>
          <Form.Item name="expected_payment_text">
            <Input
              autocomplete="off"
              prefix="应付:"
              suffix="元"
              style={inputStyle}
              readOnly={true}
            />
          </Form.Item>
        </StepsForm.StepForm>
        <StepsForm.StepForm name="pay" className={styles.form}>
          {step2Data && (
            <>
              <Card
                title="出库磅单"
                style={{ color: 'blue' }}
                extra={
                  <a
                    onClick={() => {
                      printJS({
                        printable: 'print',
                        type: 'html',
                        header: '出库磅单',
                        headerStyle: 'text-align:center;font-size:26pt;font-weight:500',
                        maxWidth: 250,
                        font_size: '14pt',
                        honorMarginPadding: false,
                        style: 'padding-bottom:30px',
                      });
                    }}
                  >
                    打印磅单
                  </a>
                }
              >
                <div id="print">
                  <p>#{current && current.id}</p>
                  <p>------------------------------</p>
                  <p>车牌号：{step2Data.car_number}</p>
                  <p>毛重：{step2Data.gross_weight_own}吨</p>
                  <p>皮重：{step2Data.body_weight_own}吨</p>
                  <p>净重：{step2Data.legal_weight_own}吨</p>
                  <p>日期：{current && current.createDateTime}</p>
                  <p>------------------------------</p>
                </div>
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
