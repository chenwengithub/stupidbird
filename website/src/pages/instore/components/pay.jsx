import React from 'react';
import { useState } from 'react';
import { Form, Input, Radio, Card, Space, Checkbox } from 'antd';
import rules from '@/utils/rules';

const Pay = (props) => {
  const [pay_way, setPayWay] = useState('one');
  const [pay_way_many, setPayWayMany] = useState([]);
  const [hideRemark, setHideRemark] = useState(true);
  const { form1 } = props;

  const handlePayWayChange = (e) => {
    form1.resetFields([
      'pay_way_many_wecat',
      'pay_way_many_cash',
      'pay_way_many_bank',
      'pay_way_many_iou',
      'pay_way_many',
    ]);
    setPayWayMany([]);
    setPayWay(e.target.value);
  };

  const handlePayWayManyChange = (values) => {
    setPayWayMany(values);
    const arr = ['wecat', 'cash', 'bank', 'iou'];
    const fields = [];
    arr.forEach((value) => {
      if (values.indexOf(value) === -1) {
        fields.push('pay_way_many_' + value);
      }
    });
    form1.resetFields(fields);
  };
  return (
    <>
      <Form.Item name="pay_way">
        <Radio.Group onChange={handlePayWayChange} buttonStyle="solid">
          <Radio.Button value="one">付款</Radio.Button>
          <Radio.Button value="many">组合付款</Radio.Button>
        </Radio.Group>
      </Form.Item>
      <Card>
        <Form.Item name="pay_way_one_type" hidden={pay_way === 'many'}>
          <Radio.Group
            buttonStyle="solid"
            onChange={(e) => {
              setHideRemark('iou' !== e.target.value);
            }}
          >
            <Space direction="vertical">
              <Radio value="wecat">微信付款</Radio>
              <Radio value="cash">现金付款</Radio>
              <Radio value="bank">银行转账</Radio>
              <Radio value="iou">打欠条</Radio>
            </Space>
          </Radio.Group>
        </Form.Item>
        <Form.Item name="pay_way_many" hidden={pay_way === 'one'}>
          <Checkbox.Group onChange={handlePayWayManyChange} style={{ paddingBottom: '24px' }}>
            <Checkbox value="wecat">微信付款</Checkbox>
            <Checkbox value="cash">现金付款</Checkbox>
            <Checkbox value="bank">银行转账</Checkbox>
            <Checkbox value="iou">打欠条</Checkbox>
          </Checkbox.Group>
        </Form.Item>
        <Form.Item
          name="pay_way_many_wecat"
          hidden={pay_way_many.indexOf('wecat') === -1}
          rules={[rules.int]}
        >
          <Input
            prefix="微信付款:"
            suffix="元"
            style={{
              color: 'green',
              border: '2px solid #e8e8e8',
              fontSize: '22px',
            }}
          />
        </Form.Item>
        <Form.Item
          name="pay_way_many_cash"
          hidden={pay_way_many.indexOf('cash') === -1}
          rules={[rules.int]}
        >
          <Input
            prefix="现金付款:"
            suffix="元"
            style={{
              color: '#d9363e',
              border: '2px solid #e8e8e8',
              fontSize: '22px',
            }}
          />
        </Form.Item>
        <Form.Item
          name="pay_way_many_bank"
          hidden={pay_way_many.indexOf('bank') === -1}
          rules={[rules.int]}
        >
          <Input
            prefix="银行转账:"
            suffix="元"
            style={{
              color: 'blue',
              border: '2px solid #e8e8e8',
              fontSize: '22px',
            }}
          />
        </Form.Item>
        <Form.Item
          name="pay_way_many_iou"
          hidden={pay_way_many.indexOf('iou') === -1}
          rules={[rules.int]}
        >
          <Input
            prefix="打欠条:"
            suffix="元"
            style={{
              color: 'dark',
              border: '2px solid #e8e8e8',
              fontSize: '22px',
            }}
          />
        </Form.Item>
        <Form.Item name="remark" hidden={hideRemark}>
          <Input prefix="备注:" />
        </Form.Item>
      </Card>
    </>
  );
};
export default Pay;
