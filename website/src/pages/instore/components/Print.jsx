import React from 'react';
import { Tag, Drawer, List, Avatar, Form, Input } from 'antd';
import ProDescriptions from '@ant-design/pro-descriptions';
import { CheckCircleOutlined, CheckOutlined } from '@ant-design/icons';
import { WaterMark } from '@ant-design/pro-layout';
import printJS from 'print-js';
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
  const [form] = Form.useForm();
  if (row) {
    form.setFieldsValue(row);
  }
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
            id="a"
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
              <a
                onClick={() => {
                  printJS({
                    printable: 'print',
                    type: 'html',
                    header: '称重单',
                    headerStyle: 'text-align:center;font-size:26pt;font-weight:500',
                    maxWidth: 250,
                    font_size: '14pt',
                    honorMarginPadding: false,
                    documentTitle: 'sdas',
                    style: 'padding-bottom:30px',
                  });
                }}
              >
                打印
              </a>
            }
          />
        )}
      </WaterMark>
      <Form name="base" form={form} id="print">
        <p>----------------------</p>
        <p>日期：{row && row.createDateTime.substring(0, 10)}</p> 
        <p>时间：{row && row.createDateTime.substring(11, 19)}</p>
        <p>车号：09993</p>
        <p>毛重：{row && row.gross_weight} kg</p>
        <p>皮重：{row && row.body_weight} kg</p>
        <p>净重：{row && row.legal_weight} kg</p>
        <p>----------------------</p>
      </Form>
    </Drawer>
  );
};

export default Detail;
