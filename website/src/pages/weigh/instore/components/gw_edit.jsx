import React from 'react';
import { useState } from 'react';
import { Tag, Modal, Form, Input, message } from 'antd';
import { connect } from 'umi';
import styles from './style.less';
import { setVisibleGWEdit, submit, setLoadingListIndex } from '../actions';
import rules from '@/utils/rules';

const GWEdit = (props) => {
  const [form] = Form.useForm();
  const {
    dispatch,
    weigh_instore: { visible_gross_weight_edit, current },
  } = props;
  form.setFieldsValue(current);
  const onFinish = (values) => {
    dispatch(setVisibleGWEdit(false));
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
      dispatch(submit(Object.assign(current, values))).then(() => {
        dispatch(setLoadingListIndex(''));
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
        visible={visible_gross_weight_edit}
        title={<h2>过磅单-修改</h2>}
        okText="确定"
        cancelText="取消"
        onCancel={() => {
          dispatch(setVisibleGWEdit({ visible: false, current: null }));
        }}
        onOk={() => {
          form.submit();
        }}
      >
        <Form
          form={form}
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <div className={styles.form}>
            <Form.Item name="gross_weight" rules={[rules.int, rules.required]}>
              <Input
                autocomplete="off"
                prefix="毛重:"
                suffix="kg"
                style={{ color: '#d9363e', border: '2px solid #e8e8e8', fontSize: '28px' }}
                size="28px"
              />
            </Form.Item>

            <Form.Item name="deduct_weight" rules={[rules.int, rules.required]} initialValue="0">
              <Input
                autocomplete="off"
                prefix="扣除:"
                suffix="kg"
                style={{ color: '#d9363e', border: '2px solid #e8e8e8', fontSize: '28px' }}
              />
            </Form.Item>

            <Form.Item name="legal_prise" rules={[rules.float]}>
              <Input
                autocomplete="off"
                prefix="价格:"
                suffix="元/kg"
                style={{ color: '#d9363e', border: '2px solid #e8e8e8', fontSize: '28px' }}
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
}))(GWEdit);
