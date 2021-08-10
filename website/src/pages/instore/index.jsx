import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Tag, Radio, Card, Popconfirm, Modal, Input, DatePicker } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { connect } from 'umi';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import Header from './components/Header';
import Detail from './components/Detail';
import { query, queryToday, queryCurrentMonth, queryDateRange, queryMonth } from './service';
import { setVisibleCreateForm, setVisibleUpdateForm, fetchToday, submit } from './actions';
import styles from './style.less';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const Index = (props) => {
  const actionRef = useRef();
  const [row, setRow] = useState();
  const addBtn = useRef(null);
  disabled_month;
  const [status, setStatus] = useState('today');
  const [disabled_month, setDisabledMonth] = useState(true);
  const [disabled_date, setDisabledDate] = useState(true);
  const [search_month, setSearchMonth] = useState('');
  const [search_date, setSearchDate] = useState('');
  const {
    dispatch,
    instore: { today, detail },
  } = props;
  const columns = [
    {
      title: '净重（公斤）',
      dataIndex: 'legal_weight',
      sorter: true,
      render: (dom, entity) => {
        return <div style={{ fontSize: '20px' }}>{dom}</div>;
      },
    },
    {
      title: '价格（元/公斤）',
      dataIndex: 'legal_prise',
      sorter: true,
      render: (dom, entity) => {
        return <div style={{ fontSize: '20px' }}>{dom}</div>;
      },
    },
    {
      title: '金额',
      dataIndex: 'account_payable',
      render: (dom, entity) => {
        return <div style={{ fontSize: '24px' }}>{dom} 元</div>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      sorter: true,
      hideInForm: true,
      render: (value, record) => {
        const _value = {
          done: {
            color: 'green',
            text: '已完成',
          },
          un_pay: {
            color: 'volcano',
            text: '未付清',
          },
        }[value];
        return (
          <>
            <Tag color={_value.color}>{_value.text}</Tag>
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
      hideInForm: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <a
            onClick={() => {
              setRow(record);
            }}
          >
            查看
          </a>
          <Divider type="vertical" />
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
            onConfirm={async () => handleRemove(record.id)}
          >
            <a style={{ color: 'red' }}>删除</a>
          </Popconfirm>
        </>
      ),
    },
  ];
  const extraContent = (
    <div className={styles.extraContent}>
      <RadioGroup
        defaultValue="today"
        onChange={(value) => {
          const status = value.target.value;
          setStatus(status);
          actionRef.current.reload();
        }}
      >
        <RadioButton value="today" style={{ marginRight: '10px' }}>
          今日
        </RadioButton>
        <RadioButton value="current_month" style={{ marginRight: '10px' }}>
          本月
        </RadioButton>
        <RadioButton value="un_pay" style={{ marginRight: '10px', color: '#ff4d4f' }}>
          欠款
        </RadioButton>
        <RadioButton value="all" style={{ marginRight: '10px' }}>
          全部
        </RadioButton>
        <DatePicker
          picker="month"
          onChange={(m, str) => {
            if (str) {
              setDisabledMonth(false);
              setSearchMonth(str);
            } else {
              setDisabledMonth(true);
              setSearchMonth('');
            }
          }}
        />
        <RadioButton
          value="month"
          disabled={disabled_month}
          onClick={() => {
            if (status === 'month') {
              actionRef.current.reload();
            }
          }}
          style={{ marginRight: '10px' }}
        >
          查询
        </RadioButton>
        <DatePicker.RangePicker
          onChange={(m, str) => {
            if (str) {
              setDisabledDate(false);
              setSearchDate(str);
            } else {
              setDisabledDate(true);
              setSearchDate('');
            }
          }}
          style={{ marginRight: '' }}
        />
        <RadioButton
          value="date_range"
          disabled={disabled_date}
          onClick={() => {
            if (status === 'date_range') {
              actionRef.current.reload();
            }
          }}
          style={{ marginRight: '10px' }}
        >
          查询
        </RadioButton>
      </RadioGroup>
    </div>
  );

  const handleRemove = async (id) => {
    dispatch(submit({ id: id })).then(() => {
      dispatch(fetchToday());
      Modal.success({
        content: '删除成功',
        onOk: () => actionRef.current.reload(),
      });
    });
  };
  useEffect(() => {
    dispatch(fetchToday());
    return () => {};
  }, []);
  return (
    <PageContainer>
      <div className={styles.standardList}>
        <Header today={today} />
        <Card
          className={styles.listCard}
          bordered={false}
          title="入库列表"
          style={{
            marginTop: 24,
          }}
          bodyStyle={{
            padding: '0 32px 40px 32px',
          }}
          extra={extraContent}
        >
          <Button
            type="dashed"
            style={{
              width: '100%',
              marginBottom: '20px',
            }}
            onClick={() => {
              dispatch(setVisibleCreateForm(true));
            }}
            ref={addBtn}
          >
            <PlusOutlined />
            添加
          </Button>
          <ProTable
            bordered
            actionRef={actionRef}
            rowKey="id"
            search={false}
            toolBarRender={false}
            request={(params, sorter, filter) => {
              if (status === 'today') {
                return queryToday({ ...params, sorter, filter, status: '~new' });
              } else if (status === 'current_month') {
                return queryCurrentMonth({ ...params, sorter, filter, status: '~new' });
              } else if (status === 'un_pay') {
                filter = { ...filter, status };
                return query({ ...params, sorter, filter });
              } else if (status === 'all') {
                return query({ ...params, sorter, filter, status: '~new' });
              } else if (status === 'month') {
                return queryMonth({
                  ...params,
                  sorter,
                  filter,
                  _month: search_month,
                  status: '~new',
                });
              } else if (status === 'date_range') {
                return queryDateRange({
                  ...params,
                  sorter,
                  filter,
                  _date_range: search_date[0] + ',' + search_date[1],
                  status: '~new',
                });
              }
            }}
            pagination={(status === 'all'||status === 'current_month')?{ position: ['bottomRight'], pageSize: 20, showSizeChanger: false }:false}
            columns={columns}
          />
        </Card>
        <CreateForm actionRef={actionRef} />
        <UpdateForm actionRef={actionRef} />
        <Detail row={row} detail={detail} setRow={setRow} />
      </div>
    </PageContainer>
  );
};

export default connect(({ instore, loading }) => ({
  instore,
  loading: loading.models,
}))(Index);
