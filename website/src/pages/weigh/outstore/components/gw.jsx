import React from 'react';
import { useState } from 'react';
import { Tag, Modal, Form, Input, Select, message } from 'antd';
import { connect } from 'umi';
import styles from './style.less';
import { setVisibleGW, submit } from '../actions';
import rules from '@/utils/rules';

const GW = (props) => {
  const [form] = Form.useForm();
  const [grossWeight, setGrossWeight] = useState();
  form.setFieldsValue({ deduct_weight: 0, gross_weight: grossWeight });
  const {
    dispatch,
    weigh_outstore: {
      visible_gross_weight,
      options_steel_plant,
      options_truck,
      options_intermediary,
    },
  } = props;
  const onFinish = (values) => {
    dispatch(setVisibleGW(false));
    form.resetFields();
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
      dispatch(
        submit({
          ...values,
        }),
      ).then(() => {
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

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div>
      <Modal
        destroyOnClose
        centered
        visible={visible_gross_weight}
        title={<h2>过磅单</h2>}
        okText="添加"
        cancelText="取消"
        onCancel={() => {
          dispatch(setVisibleGW(false));
          form.resetFields();
        }}
        onOk={() => {
          form.submit();
        }}
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
          磅显：{grossWeight} kg
        </Tag>
        <Form form={form} name="basic" onFinish={onFinish} onFinishFailed={onFinishFailed}>
          <div className={styles.form}>
            <Form.Item name="steel_plant" rules={[rules.required]}>
              <Select
                showSearch
                optionFilterProp="children"
                placeholder="目的地"
                size="large"
                style={{ color: '#3654d9', fontSize: '24px' }}
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
                size="large"
                style={{ color: '#3654d9', fontSize: '24px' }}
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
                size="large"
                style={{ color: '#3654d9', fontSize: '24px' }}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                filterSort={(optionA, optionB) =>
                  optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                }
                options={options_intermediary}
              ></Select>
            </Form.Item>
            <Form.Item name="body_weight_own" rules={[rules.float, rules.required]}>
              <Input
                prefix="皮重:"
                suffix="吨"
                style={{ color: '#3654d9', border: '2px solid #e8e8e8', fontSize: '24px' }}
              />
            </Form.Item>
            <Form.Item name="agreed_prise" rules={[rules.int, rules.required]}>
              <Input
                prefix="价格:"
                suffix="元/吨"
                style={{ color: '#3654d9', border: '2px solid #e8e8e8', fontSize: '24px' }}
              />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
};
export default connect(({ weigh_outstore, loading }) => ({
  weigh_outstore,
  loading: loading.models,
}))(GW);
