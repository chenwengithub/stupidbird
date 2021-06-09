import React from 'react';
import { Tag, Drawer, List, Avatar } from 'antd';
import ProDescriptions from '@ant-design/pro-descriptions';
import { CheckCircleOutlined, CheckOutlined } from '@ant-design/icons';
import { WaterMark } from '@ant-design/pro-layout';

const detailColumns = [
  {
    title: '结算公式',
    dataIndex: 'account_payable_text',
    renderText: (val) => `${val} 元`,
  },
  {
    title: '实际支付',
    dataIndex: 'actual_payment',
    renderText: (val) => `${val} 元`,
  },
  {
    title: '净重',
    dataIndex: 'legal_weight',
    renderText: (val) => `${val} kg`,
  },
  {
    title: '价格',
    dataIndex: 'legal_prise',
    renderText: (val) => `${val} 元/kg`,
  },
  {
    title: '付款信息',
    dataIndex: 'payment',
    render: (val) => {
      let str =
        val.amount_total +
        '元 ( ' +
        (val.amount_wechat ? '微信：' + val.amount_wechat + '元, ' : '') +
        (val.amount_cash ? '现金：' + val.amount_cash + '元, ' : '') +
        (val.amount_bank ? '银行转账：' + val.amount_bank + '元, ' : '') +
        (val.amount_iou ? '欠款：' + val.amount_iou + '元, ' : '');
      str = str.substring(0, str.length - 2) + ')';
      return <Tag color={val.amount_iou ? 'red' : 'green'}>{str}</Tag>;
    },
  },
  {
    title: '状态',
    dataIndex: 'status',
    valueEnum: {
      done: {
        text: '完成',
        status: 'Success',
      },
      un_pay: {
        text: '欠款',
        status: 'Error',
      },
    },
  },
  {
    title: '备注',
    dataIndex: 'remark',
  },
  {
    title: '时间',
    dataIndex: 'createDateTime',
    valueType: 'dateTime',
  },
];
const Detail = (props) => {
  const { row, setRow } = props;
  return (
    <Drawer
      width={600}
      visible={!!row}
      onClose={() => {
        setRow(undefined);
      }}
      closable={false}
    >
      <WaterMark height={36} width={115} content="张家湾废铁厂">
        {row?.id && (
          <ProDescriptions
            bordered
            column={1}
            title={'详细信息'}
            request={async () => {
              return { data: row || {} };
            }}
            params={{
              id: row?.name,
            }}
            columns={detailColumns}
            extra={
              <Tag icon={<CheckCircleOutlined />} color="green">
                交易完成
              </Tag>
            }
          />
        )}
      </WaterMark>
    </Drawer>
  );
};

export default Detail;
