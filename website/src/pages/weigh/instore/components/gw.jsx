import React from 'react';
import { useState } from 'react';
import { Tag, Modal, Form, Input, message } from 'antd';
import { connect } from 'umi';
import styles from './style.less';
import { setVisibleGW, submit } from '../actions';
import rules from '@/utils/rules';

const GW = (props) => {
  const [form] = Form.useForm();
  const [grossWeight, setGrossWeight] = useState();
  // form.setFieldsValue({ deduct_weight: 0, gross_weight: grossWeight });
  const {
    dispatch,
    weigh_instore: { visible_gross_weight },
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
          content: '成功!',
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
        maskClosable={false}
        centered
        visible={visible_gross_weight}
        title={<h2>毛重过磅</h2>}
        okText="确定"
        cancelText="取消"
        onCancel={() => {
          dispatch(setVisibleGW(false));
          form.resetFields();
        }}
        onOk={() => {
          form.submit();
        }}
      >
        {/* <Tag
          style={{
            textAlign: 'center',
            lineHeight: '64px',
            fontSize: '40px',
            marginBottom: '30px',
            width: '100%',
          }}
          color="#d9363e"
        >
          磅显：{grossWeight} kg
        </Tag> */}
        <Form form={form} name="basic" onFinish={onFinish} onFinishFailed={onFinishFailed}>
          <div className={styles.form}>
            <Form.Item name="gross_weight" rules={[rules.int, rules.required]}>
              <Input
                prefix="毛重:"
                autocomplete="off"
                suffix="kg"
                style={{ color: '#d9363e', border: '2px solid #e8e8e8', fontSize: '24px' }}
                size="28px"
                autofocus="autofocus"
              />
            </Form.Item>

            <Form.Item name="deduct_weight" initialValue="0" rules={[rules.int, rules.required]}>
              <Input
                autocomplete="off"
                prefix="扣除:"
                suffix="kg"
                style={{ color: '#d9363e', border: '2px solid #e8e8e8', fontSize: '24px' }}
              />
            </Form.Item>

            <Form.Item name="legal_prise" rules={[rules.float]}>
              <Input
                autocomplete="off"
                prefix="价格:"
                suffix="元/kg"
                style={{ color: '#d9363e', border: '2px solid #e8e8e8', fontSize: '24px' }}
              />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
};
export default connect(({ weigh_instore, loading }) => ({
  weigh_instore,
  loading: loading.models,
}))(GW);
