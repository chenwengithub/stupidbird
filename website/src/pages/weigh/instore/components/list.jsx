import React from 'react';
import { useEffect } from 'react';
import { Card, message, Popconfirm } from 'antd';
import { DeleteOutlined, FormOutlined, DashboardOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import { submit, fetch, setVisibleBW, setVisibleGWEdit, setLoadingListIndex } from '../actions';
import GWEdit from './gw_edit';
const { Meta } = Card;
const List = (props) => {
  const {
    dispatch,
    weigh_instore: { list = [], loading_list_index, current },
  } = props;
  useEffect(() => {
    dispatch(fetch({ status: 'new', sorter: { createDateTime: 'descend' } }));
  }, []);

  const handleRemove = async (item) => {
    const key = 'delete';
    dispatch(setLoadingListIndex(item.id));
    message.loading({
      content: '请稍后...',
      key,
      style: {
        marginTop: '10vh',
        fontSize: '24px',
      },
    });
    setTimeout(() => {
      dispatch(submit({ id: item.id })).then(() => {
        dispatch(setLoadingListIndex(''));
        message.success({
          content: '删除成功!',
          key,
          duration: 1,
          style: {
            marginTop: '10vh',
            fontSize: '24px',
          },
        });
      });
    }, 500);
  };
  return (
    <div style={{ marginLeft: '24px' }}>
      {list.map((item, index) => (
        <Card
          loading={loading_list_index === item.id}
          key={'card-' + index}
          style={{ marginBottom: '10px' }}
          hoverable
          actions={[
            <DashboardOutlined
              onClick={() => {
                dispatch(setVisibleBW({ visible: true, current: item }));
              }}
            />,
            <FormOutlined
              onClick={() => {
                dispatch(setVisibleGWEdit({ visible: true, current: item }));
              }}
            />,
            <Popconfirm
              title="确定删除吗？"
              okText="是"
              cancelText="否"
              onConfirm={async () => {
                handleRemove(item);
              }}
            >
              <DeleteOutlined />
            </Popconfirm>,
          ]}
        >
          <Meta
            title={'毛重：' + item.gross_weight + 'kg，价格：' + item.legal_prise + ' 元/kg'}
            description={item.createDateTime}
          />
        </Card>
      ))}
      <GWEdit />
    </div>
  );
};
export default connect(({ weigh_instore, loading }) => ({
  weigh_instore,
  loading: loading.models,
}))(List);
