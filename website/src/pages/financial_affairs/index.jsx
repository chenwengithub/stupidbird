import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, message, Popconfirm, Modal } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import Header from './components/Header';
import { query, update, add, remove } from './service';
import styles from './style.less';

/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields) => {
  try {
    await add({ ...fields });
    return true;
  } catch (error) {
    message.error('添加失败请重试！');
    return false;
  }
};
/**
 * 更新节点
 * @param fields
 */

const handleUpdate = async (fields) => {
  try {
    await update(fields);
    return true;
  } catch (error) {
    message.error('修改失败请重试！');
    return false;
  }
};

const handleRemove = async (id) => {
  if (!id) return true;
  try {
    await remove({
      key: id,
    });
    return true;
  } catch (error) {
    message.error('删除失败，请重试');
    return false;
  }
};
const TableList = () => {
  const [createModalVisible, handleModalVisible] = useState(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [formValues, setFormValues] = useState({});
  const actionRef = useRef();
  const columns = [
    {
      title: '类型',
      dataIndex: 'type',
      valueType: 'radio',
      hideInTable: true,
      valueEnum: {
        expend: { text: '支出' },
        income: { text: '收入' },
      },
    },
    {
      title: '事由',
      dataIndex: 'reason',
      sorter: true,
      render: (dom, entity) => {
        return <div style={{ fontSize: '20px' }}>{dom}</div>;
      },
    },
    {
      title: '金额',
      dataIndex: 'money',
      render: (dom, entity) => {
        const color = entity.type === 'income' ? '#FFBF00' : 'black';
        dom = entity.type === 'income' ? '+' + dom : '-' + dom;
        return <div style={{ fontSize: '24px', color }}>{dom} 元</div>;
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
              handleUpdateModalVisible(true);
              setFormValues(record);
            }}
          >
            编辑
          </a>
          <Divider type="vertical" />
          <Popconfirm
            title="确定删除吗？"
            okText="是"
            cancelText="否"
            onConfirm={async () => {
              const success = await handleRemove(record.id);
              if (success) {
                if (actionRef.current) {
                  Modal.success({
                    content: '成功',
                    onOk: () => actionRef.current.reload(),
                  });
                }
              }
            }}
          >
            <a style={{ color: 'red' }}>删除</a>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <PageContainer>
      <div className={styles.standardList}>
        <Header />
        <ProTable
          bordered
          headerTitle="收支记录"
          actionRef={actionRef}
          rowKey="id"
          search={false}
          pagination={{ position: ['bottomRight'], pageSize: 8, showSizeChanger: false }}
          toolBarRender={() => [
            <Button type="primary" onClick={() => handleModalVisible(true)}>
              <PlusOutlined /> 添加
            </Button>,
          ]}
          request={(params, sorter, filter) => query({ ...params, sorter, filter })}
          columns={columns}
        />
        <CreateForm onCancel={() => handleModalVisible(false)} modalVisible={createModalVisible}>
          <ProTable
            onSubmit={async (value) => {
              const success = await handleAdd(value);
              if (success) {
                handleModalVisible(false);
                if (actionRef.current) {
                  Modal.success({
                    content: '添加成功',
                    onOk: () => actionRef.current.reload(),
                  });
                }
              }
            }}
            rowKey="id"
            type="form"
            columns={columns}
          />
        </CreateForm>
        {formValues && Object.keys(formValues).length ? (
          <UpdateForm
            onCancel={() => {
              handleUpdateModalVisible(false);
              setFormValues({});
            }}
            onSubmit={(value) => {
              const success = handleUpdate(value);
              if (success) {
                handleUpdateModalVisible(false);
                setFormValues({});
                if (actionRef.current) {
                  Modal.success({
                    content: '编辑成功',
                    onOk: () => actionRef.current.reload(),
                  });
                }
              }
              handleUpdateModalVisible(false);
              setFormValues({});
            }}
            values={formValues}
            modalVisible={updateModalVisible}
          />
        ) : null}
      </div>
    </PageContainer>
  );
};

export default TableList;
