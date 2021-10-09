import React from 'react';
import { Tag, Drawer, List, Image, Form, Card, Typography } from 'antd';
import ProDescriptions from '@ant-design/pro-descriptions';
import { CheckCircleOutlined, CheckOutlined } from '@ant-design/icons';
import { WaterMark } from '@ant-design/pro-layout';
import printJS from 'print-js';
const { Title } = Typography;
const detailColumns = [
  {
    title: '结算',
    render: (dom, record) => {
      return (
        <Title level={2} style={{ color: record.status === 'un_pay' ? '#FF4000' : '#FFBF00' }}>
          {record.account_payable_text} 元
        </Title>
      );
    },
  },
  {
    title: '照片',
    render: (dom, record) => {
      const imgPath =
        record.createDateTime.substring(0, record.createDateTime.indexOf('T')) + '/' + record.id;
      try {
        return (
          <Image.PreviewGroup>
            <Image width={220} src={require('../../../../../pictures/memoin/' + imgPath + '_gross.jpg')} />
            <Image width={220} src={require('../../../../../pictures/memoin/' + imgPath + '_body.jpg')} />
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
    },
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
          }
        >
          <div id="print">
            <p>#{record.id}</p>
            <p>------------------------------</p>
            <p>毛重：{record.gross_weight} kg</p>
            <p>皮重：{record.body_weight} kg</p>
            <p>扣除：{record.deduct_weight} kg</p>
            <p>净重：{record.legal_weight} kg</p>
            <p>价格：{record.legal_prise} 元/kg</p>
            <p>总额：{record.account_payable} 元</p>
            <p>日期：{record.createDateTime.substring(0, 19)}</p>
            <p>------------------------------</p>
          </div>
        </Card>
      );
    },
  },
  {
    title: '付款',
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
];
const Detail = (props) => {
  const { row, setRow } = props;
  const [form] = Form.useForm();
  if (row) {
    form.setFieldsValue(row);
  }
  return (
    <Drawer
      width={700}
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
