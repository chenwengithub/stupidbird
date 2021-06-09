import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Tag, Row, Col } from 'antd';
import { connect } from 'umi';
import GW from './components/gw';
import BW from './components/bw';
import List from './components/list';
import styles from './style.less';
import image_car from '@/assets/car1.png';
import {
  setVisibleGW,
  setVisibleBW,
  fetchTruck,
  fetchSteelPlant,
  fetchIntermediary,
} from './actions';

const Index = (props) => {
  const { dispatch, setType } = props;
  useEffect(() => {
    dispatch(fetchTruck());
    dispatch(fetchSteelPlant());
    dispatch(fetchIntermediary());
  }, []);
  return (
    <PageContainer>
      <Row>
        <Col span={18}>
          <Card>
            <div className={styles.header}>
              <p>
                出库过磅
                <a
                  onClick={() => {
                    setType('instore');
                  }}
                >
                  切换
                </a>
              </p>
              <div>
                <Tag className={styles.success} color="#108ee9">
                  地磅就绪√
                </Tag>
                <Tag className={styles.success} color="#108ee9">
                  打印机就绪√
                </Tag>
                <Tag className={styles.success} color="#108ee9">
                  读卡器就绪√
                </Tag>
                <Tag className={styles.error} color="#f50">
                  摄像头异常×
                </Tag>
              </div>
            </div>
            <Card bordered={false} className={styles.body}>
              <Row
                style={{
                  borderBottom: 'solid black 5px',
                }}
              >
                <Col span={12} offset={6}>
                  <p
                    style={{
                      margin: '0 0 20px 0',
                      fontSize: '100px',
                      fontFamily: 'cursive',
                      color: '#3654d9',
                    }}
                  >
                    850 kg
                  </p>
                </Col>
              </Row>
              <p style={{ fontSize: '30px' }}>等待过磅</p>
              <Row>
                <Col span={24}>
                  <Card
                    style={{ margin: 20 }}
                    hoverable
                    onClick={() => {
                      dispatch(setVisibleGW(true));
                    }}
                  >
                    <img src={image_car} style={{ width: 80, height: 80 }} />
                  </Card>
                </Col>
              </Row>
            </Card>
          </Card>
        </Col>
        <Col span={6}>
          <List />
        </Col>
      </Row>
      <GW />
      <BW />
    </PageContainer>
  );
};
export default connect(({ weigh_outstore, loading }) => ({
  weigh_outstore,
  loading: loading.models,
}))(Index);
