import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Modal, Popconfirm, Tag } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import Header from './components/Header';
import OppositeForm from './components/OppositeForm';
import PaymentForm from './components/PaymentForm';
import Detail from './components/Detail';
import { query } from './service';
import styles from './style.less';
import { connect } from 'umi';
import {
  setVisibleCreateForm,
  setVisibleUpdateForm,
  setVisibleOppositeForm,
  setVisiblePaymentForm,
  submit,
  fetchTruck,
  fetchSteelPlant,
  fetchIntermediary,
  fetchMonth,
} from './actions';

/**
 *  删除节点
 * @param selectedRows
 */

const Index = (props) => {
  const [delLoading, setDelLoading] = useState(false);
  const actionRef = useRef();
  const [row, setRow] = useState();
  const {
    dispatch,
    outstore: { month },
  } = props;
  const columns = [
    {
      title: '目的地',
      dataIndex: 'steel_plant',
      sorter: true,
      render: (value) => value.name,
    },
    {
      title: '车号',
      dataIndex: 'truck',
      sorter: true,
      render: (value) => value.car_number,
    },
    {
      title: '中间人',
      dataIndex: 'intermediary',
      sorter: true,
      render: (value) => value.name,
    },
    {
      title: '净重',
      render: (dom, entity) => {
        const own = entity.legal_weight_own_text;
        const opposite = entity.legal_weight_opposite_text;
        let difference = 0,
          diffColor = 'red';
        if (opposite) {
          const _opposite = entity.legal_weight_opposite;
          const _own = entity.legal_weight_own;
          difference = _opposite > _own ? _opposite - _own : _own - _opposite;
          diffColor = _opposite > _own ? 'purple' : 'red';
        }
        return (
          <>
            <div>
              <Tag style={{ marginBottom: '5px' }}>{own ? own + '吨' : '未知'}</Tag>
            </div>
            {/* {own && (
              <div>
                <Tag style={{ marginBottom: '5px' }}>
                  预期 {own} 吨
                </Tag>
              </div>
            )}
            {opposite && (
              <div>
                <div>
                  <Tag style={{ marginBottom: '5px' }}>
                    实际 {opposite} 吨{' '}
                  </Tag>
                </div>
                <div>
                  <Tag color={diffColor}>相差 {(difference * 1000).toFixed()} kg</Tag>
                </div>
              </div>
            )} */}
          </>
        );
      },
    },
    {
      title: '金额',
      render: (dom, entity) => {
        const own = entity.expected_payment_text;
        const opposite = entity.opposite_payment_text;
        let difference = 0,
          diffColor = 'red';
        if (opposite) {
          const _opposite = entity.opposite_payment;
          const _own = entity.expected_payment;
          difference = _opposite > _own ? _opposite - _own : _own - _opposite;
          diffColor = _opposite > _own ? 'purple' : 'red';
        }
        return (
          <>
            <div>
              <Tag style={{}}>{own ? own + '元' : '未知'}</Tag>
            </div>
            {/* {own && (
              <div>
                <Tag style={{ marginBottom: '5px' }}>
                  预期 {own} 元
                </Tag>
              </div>
            )}
            {opposite && (
              <div>
                <div>
                  <Tag style={{ marginBottom: '5px' }}>
                    实际 {opposite} 元
                  </Tag>
                </div>
                <div>
                  <Tag color={diffColor}>相差 {difference} 元 </Tag>
                </div>
              </div>
            )} */}
          </>
        );
      },
    },
    {
      title: '状态',
      sorter: true,
      dataIndex: 'status',
      render: (value, record) => {
        const _value = {
          new: {
            color: 'orange',
            text: '正在装货',
          },
          on_the_way: {
            color: 'blue',
            text: '待收货',
          },
          done: {
            color: 'green',
            text: '已完成',
          },
          un_pay: {
            color: 'volcano',
            text: '未清账',
          },
        }[value];
        let option = null;
        switch (value) {
          case 'on_the_way':
            option = (
              <>
                <a
                  onClick={() => {
                    dispatch(setVisibleOppositeForm({ visible: true, current: record }));
                  }}
                  style={{ marginRight: '5px' }}
                >
                  收货
                </a>
                <a
                  onClick={() => {
                    dispatch(setVisiblePaymentForm({ visible: true, current: record }));
                  }}
                >
                  预付
                </a>
              </>
            );
            break;
          case 'un_pay':
            option = (
              <>
                <a
                  onClick={() => {
                    dispatch(setVisiblePaymentForm({ visible: true, current: record }));
                  }}
                >
                  收款
                </a>
                <Divider type="vertical" />
                <a
                  onClick={() => {
                    setRow(record);
                  }}
                >
                  查看
                </a>
              </>
            );
            break;
          case 'done':
            option = (
              <a
                onClick={() => {
                  setRow(record);
                }}
              >
                查看
              </a>
            );
            break;
        }
        return (
          <>
            <Tag color={_value.color}>{_value.text}</Tag>
            {option}
          </>
        );
      },
    },
    {
      title: '时间',
      dataIndex: 'createDateTime',
      sorter: true,
      defaultSortOrder: 'descend',
      valueType: 'dateTime',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <a
            onClick={() => {
              dispatch(setVisibleUpdateForm({ visible: true, current: record }));
            }}
          >
            编辑
          </a>
          <Divider type="vertical" />
          <Popconfirm
            title="确定删除吗？"
            okText="是"
            cancelText="否"
            onConfirm={() => handleRemove(record.id)}
          >
            <a style={{ color: 'red' }}>删除</a>
          </Popconfirm>
        </>
      ),
    },
  ];
  const handleRemove = async (id) => {
    setDelLoading(id);
    dispatch(submit({ id: id })).then(() => {
      Modal.success({
        content: '删除成功',
        onOk: () => actionRef.current.reload(),
      });
      setDelLoading('');
    });
  };
  useEffect(() => {
    dispatch(fetchTruck());
    dispatch(fetchSteelPlant());
    dispatch(fetchIntermediary());
    dispatch(fetchMonth());
    return () => {};
  }, []);

  return (
    <PageContainer>
      <div className={styles.standardList}>
        <Header month={month} />
      </div>
      <ProTable
        style={{
          marginTop: 24,
        }}
        bordered
        headerTitle="出库记录"
        actionRef={actionRef}
        rowKey="id"
        search={false}
        pagination={{ position: ['bottomRight'], pageSize: 20, showSizeChanger: false }}
        // toolBarRender={() => [
        //   <Button
        //     type="primary"
        //     onClick={() => {
        //       dispatch(setVisibleCreateForm(true));
        //     }}
        //   >
        //     <PlusOutlined /> 手动添加
        //   </Button>,
        // ]}
        request={(params, sorter, filter) => query({ ...params, sorter, filter })}
        columns={columns}
      />
      {/* <CreateForm actionRef={actionRef} /> */}
      <UpdateForm actionRef={actionRef} />
      <OppositeForm actionRef={actionRef} />
      <PaymentForm actionRef={actionRef} />
      <Detail row={row} setRow={setRow} />
    </PageContainer>
  );
};

export default connect(({ outstore, loading }) => ({
  outstore,
  loading: loading.models,
}))(Index);
