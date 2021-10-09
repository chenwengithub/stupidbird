import React from 'react';
import { Tag, Drawer, Card, Image } from 'antd';
import ProDescriptions from '@ant-design/pro-descriptions';
import { CheckCircleOutlined } from '@ant-design/icons';
import { WaterMark } from '@ant-design/pro-layout';
import { setVisiblePaymentForm } from '../actions';
import { connect } from 'umi';
import printJS from 'print-js';

const Detail = (props) => {
  const { row, setRow, dispatch } = props;
  const detailColumns = [
    {
      title: '照片',
      render: (dom, record) => {
        const imgPath =
          record.createDateTime.substring(0, record.createDateTime.indexOf('T')) + '/' + record.id;
        try {
          return (
            <Image.PreviewGroup>
              <Image
                width={220}
                src={require('../../../../../pictures/memoout/' + imgPath + '_body.jpg')}
              />
              <Image
                width={220}
                src={require('../../../../../pictures/memoout/' + imgPath + '_gross.jpg')}
              />
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
      title: '出发信息',
      render: (dom, record) => {
        return (
          <Card style={{ color: 'black' }}>
            <p>目的地：{record.steel_plant.name}</p>
            <p>车牌号：{record.truck.car_number}</p>
            <p>中间人：{record.intermediary.name}</p>
            <p>公式：{record.expected_payment_text} 元</p>
            <p>日期：{record.createDateTime}</p>
          </Card>
        );
      },
    },
    {
      title: '磅单',
      render: (dom, record) => {
        return (
          <Card
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
                打印
              </a>
            }
          >
            <div id="print">
              <p>#{record.id}</p>
              <p>------------------------------</p>
              <p>车牌号：{record.truck.car_number}</p>
              <p>毛重：{record.gross_weight_own} 吨</p>
              <p>皮重：{record.body_weight_own} 吨</p>
              <p>净重：{record.legal_weight_own} 吨</p>
              <p>日期：{record.createDateTime}</p>
              <p>------------------------------</p>
            </div>
          </Card>
        );
      },
    },
    {
      title: '付款信息',
      render: (dom, record) => {
        return (
          <Card
            style={{ marginTop: '10px', color: 'green' }}
            extra={
              <a
                onClick={() => {
                  dispatch(setVisiblePaymentForm({ visible: true, current: record }));
                  setRow(undefined);
                }}
              >
                修改
              </a>
            }
          >
            <p>
              预付款：{record.advance_payment} 元 ( {record.advance_payment_datetime} )
            </p>
            <p>
              尾款：{record.rest_payment} 元 ( {record.rest_payment_datetime} )
            </p>
            <p>实际付款：{record.actual_payment} 元</p>
          </Card>
        );
      },
    },
  ];
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
                已完成
              </Tag>
            }
          />
        )}
      </WaterMark>
    </Drawer>
  );
};

export default connect(({ outstore }) => ({
  outstore,
}))(Detail);
