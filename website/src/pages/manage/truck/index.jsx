import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, message, Input, Drawer, Popconfirm, Modal } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import ProDescriptions from '@ant-design/pro-descriptions';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import { query, update, add, remove } from './service';

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
/**
 *  删除节点
 * @param selectedRows
 */

const handleRemove = async (row, setDelLoading) => {
  if (!row) return true;
  setDelLoading(row.id)
  try {
    await remove({
      key: row.id,
    });
    setDelLoading('')
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
  const [delLoading, setDelLoading] = useState({});
  const actionRef = useRef();
  const [row, setRow] = useState();
  const columns = [
    {
      title: '车牌号',
      dataIndex: 'car_number',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '车牌号为必填项',
          },
        ],
      }
    },
    {
      title: '司机',
      dataIndex: 'driver_name'
    },
    {
      title: '电话',
      dataIndex: 'driver_tel'
    },
    {
      title: '备注',
      dataIndex: 'remark',
      sorter: true,
      hideInSearch: true
    },
    {
      title: '创建时间',
      dataIndex: 'createDateTime',
      sorter: true,
      defaultSortOrder: 'descend',
      valueType: 'dateTime',
      hideInForm: true,
      hideInSearch: true,
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
          <Popconfirm title="确定删除吗？" okText="是" cancelText="否" onConfirm={async () => {
            const success = await handleRemove(record, setDelLoading)
            if (success) {
              if (actionRef.current) {
                Modal.success({
                  content: '删除成功',
                  onOk: () => actionRef.current.reload()
                });
              }
            }
          }}>
            <Button type="link" danger loading={delLoading === record.key}>删除</Button>
          </Popconfirm>
        </>
      ),
    },
  ];
  return (
    <PageContainer>
      <ProTable
        headerTitle="货车列表"
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
                  onOk: () => actionRef.current.reload()
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
                  onOk: () => actionRef.current.reload()
                });
              }
            }
            handleUpdateModalVisible(false);
            setFormValues({});
          }}
          values={formValues}
          modalVisible={updateModalVisible} />
      ) : null}

    </PageContainer>
  );
};

export default TableList;
