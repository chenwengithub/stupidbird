import React from 'react';
import { Tag, Drawer, Card } from 'antd';
import ProDescriptions from '@ant-design/pro-descriptions';
import { CheckCircleOutlined } from '@ant-design/icons';
import { WaterMark } from '@ant-design/pro-layout';
import { setVisiblePaymentForm } from '../actions';
import { connect } from 'umi';

const Detail = (props) => {
  const { row, setRow, dispatch } = props;
  const detailColumns = [
    {
      title: '完成时间',
      dataIndex: 'complete_datetime',
      valueType: 'dateTime',
    },
    {
      title: '出发信息',
      render: (dom, record) => {
        return (
          <Card style={{ color: 'red' }}>
            <p>目的地：{record.steel_plant.name}</p>
            <p>车牌号：{record.truck.car_number}</p>
            <p>中间人：{record.intermediary.name}</p>
            <p>毛重：{record.gross_weight_own} 吨</p>
            <p>皮重：{record.body_weight_own} 吨</p>
            <p>净重：{record.legal_weight_own} 吨</p>
            <p>暂定价格：{record.agreed_prise} 元/吨</p>
            <p>暂定总额：{record.expected_payment_text} 元</p>
            <p>出发日期：{record.createDateTime}</p>
          </Card>
        );
      },
    },
    {
      title: '到达信息',
      render: (dom, record) => {
        return (
          <Card style={{ color: 'blue' }}>
            <p>毛重：{record.gross_weight_opposite} 吨</p>
            <p>皮重：{record.body_weight_opposite} 吨</p>
            <p>净重：{record.legal_weight_opposite} 吨</p>
            <p>价格：{record.actual_prise} 元/吨</p>
            <p>总额：{record.opposite_payment_text} 元</p>
            <p>到达日期：{record.arrival_datetime}</p>
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
