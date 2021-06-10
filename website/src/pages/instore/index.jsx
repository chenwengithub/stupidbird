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
import { arrayOf } from 'prop-types';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const Index = (props) => {
  const actionRef = useRef();
  const [row, setRow] = useState();
  const addBtn = useRef(null);
  const [delLoading, setDelLoading] = useState(false);
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
      title: '公式',
      dataIndex: 'account_payable_text',
      render: (dom, entity) => {
        return (
          <Tag
            style={{
              fontSize: '20px',
              color: 'red',
              lineHeight: 'inherit',
            }}
            onClick={() => {
              setRow(entity);
            }}
          >
            {dom} 元
          </Tag>
        );
      },
    },
    {
      title: '净重',
      dataIndex: 'legal_weight',
      sorter: true,
      renderText: (val) => `${val} kg`,
    },
    {
      title: '价格',
      dataIndex: 'legal_prise',
      sorter: true,
      renderText: (val) => `${val} 元/kg`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      sorter: true,
      hideInForm: true,
      valueEnum: {
        done: {
          text: '完成',
          status: 'Success',
        },
        un_pay: {
          text: '未付清',
          status: 'Error',
        },
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
          <Button
            type="link"
            onClick={() => {
              dispatch(setVisibleUpdateForm({ visible: true, current: record }));
            }}
          >
            编辑
          </Button>
          <Divider type="vertical" />
          <Popconfirm
            title="确定删除吗？"
            okText="是"
            cancelText="否"
            onConfirm={async () => handleRemove(record.id)}
          >
            <Button type="link" danger loading={delLoading === record.key}>
              删除
            </Button>
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
    setDelLoading(id);
    dispatch(submit({ id: id })).then(() => {
      dispatch(fetchToday());
      Modal.success({
        content: '删除成功',
        onOk: () => actionRef.current.reload(),
      });
      setDelLoading('');
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
            actionRef={actionRef}
            rowKey="id"
            search={false}
            toolBarRender={false}
            request={(params, sorter, filter) => {
              if (status === 'today') {
                return queryToday({ ...params, sorter, filter });
              } else if (status === 'current_month') {
                return queryCurrentMonth({ ...params, sorter, filter });
              } else if (status === 'un_pay') {
                filter = { ...filter, status };
                return query({ ...params, sorter, filter });
              } else if (status === 'all') {
                return query({ ...params, sorter, filter });
              } else if (status === 'month') {
                return queryMonth({ ...params, sorter, filter, _month: search_month });
              } else if (status === 'date_range') {
                return queryDateRange({
                  ...params,
                  sorter,
                  filter,
                  _date_range: search_date[0] + ',' + search_date[1],
                });
              }
            }}
            pagination={{ position: ['bottomRight'], pageSize: 8, showSizeChanger: false }}
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
