import React from 'react';
import { Tag, Drawer, List, Avatar, Form, Card } from 'antd';
import ProDescriptions from '@ant-design/pro-descriptions';
import { CheckCircleOutlined, CheckOutlined } from '@ant-design/icons';
import { WaterMark } from '@ant-design/pro-layout';
import printJS from 'print-js';
const detailColumns = [
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
    title: '结算公式',
    dataIndex: 'account_payable_text',
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
    title: '金额',
    dataIndex: 'account_payable',
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
    title: '备注',
    dataIndex: 'remark',
  },
  {
    title: '时间',
    dataIndex: 'createDateTime',
    valueType: 'dateTime',
  },
  {
    title: '入库单',
    render: (dom, record) => {
      return (
        <Card 
              extra={
                <a
                  onClick={() => {
                    printJS({
                      printable: 'print',
                      type: 'html',
                      header: '入库单',
                      headerStyle: 'text-align:center;font-size:26pt;font-weight:500',
                      maxWidth: 250,
                      font_size: '14pt',
                      honorMarginPadding: false,
                      style: 'padding-bottom:30px',
                    });
                  }}
                >
                  打印
                </a>
              }>
              <div id="print">
                <p>#{record.id}</p>
                <p>------------------------------</p>
                <p>毛重：{record.gross_weight} kg</p>
                <p>皮重：{record.body_weight} kg</p>
                <p>扣除：{record.deduct_weight} kg</p>
                <p>净重：{record.legal_weight} kg</p>
                <p>价格：{record.legal_prise} 元/kg</p>
                <p>总额：{record.account_payable} 元</p>
                <p>日期：{record.createDateTime.substring(0,19)}</p>
                <p>------------------------------</p>
              </div>
            </Card>
      );
    }
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
            />
        )}
      </WaterMark>
      
    </Drawer>
  );
};

export default Detail;
