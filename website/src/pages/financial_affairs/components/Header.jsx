import React from 'react';
import { Card, Row, Col } from 'antd';
import styles from '../style.less';
const Info = ({ title, value, bordered, color, fontSize }) => (
  <div className={styles.headerInfo}>
    <span style={{ color: 'black' }}>{title}</span>
    <p style={{ color, fontSize }}>{value}</p>
    {bordered && <em />}
  </div>
);
const Header = (props) => {
  // const { today } = props;
  const today = {
    expend_fixed: '23800',
    expend_instore: '789400',
    expend_other: '13400',
    income_outstore: '857600',
    income_outstore_other: '18970',
    income_borrow: '0',
    expend_total: '834500',
    income_total: '937200',
    surplus: '323500',
  };
  return (
    <div style={{ marginBottom: '20px' }}>
      <Card bordered={false}>
        <Row>
          <Col sm={6} xs={24}>
            <Info color="#FF4000" title="固定支出" value={today.expend_fixed + ' 元'} bordered />
          </Col>
          <Col sm={6} xs={24}>
            <Info color="#FF4000" title="收货支出" value={today.expend_instore + ' 元'} bordered />
          </Col>
          <Col sm={6} xs={24}>
            <Info color="#FF4000" title="其他支出" value={today.expend_other + ' 元'} bordered />
          </Col>
          <Col sm={6} xs={24}>
            <Info color="#FF4000" title="总支出" value={today.expend_total + ' 元'} bordered />
          </Col>
        </Row>
      </Card>
      <Card bordered={false}>
        <Row>
          <Col sm={6} xs={24}>
            <Info color="#0080FF" title="房租收入" value={today.income_borrow + ' 元'} bordered />
          </Col>
          <Col sm={6} xs={24}>
            <Info color="#0080FF" title="卖货收入" value={today.income_outstore + ' 元'} bordered />
          </Col>
          <Col sm={6} xs={24}>
            <Info
              color="#0080FF"
              title="卖杂收入"
              value={today.income_outstore_other + ' 元'}
              bordered
            />
          </Col>
          <Col sm={6} xs={24}>
            <Info color="#0080FF" title="总收入" value={today.income_total + ' 元'} bordered />
          </Col>
        </Row>
      </Card>
      <Card bordered={false}>
        <Row>
          <Col sm={24} xs={24}>
            <Info
              color="#FFBF00"
              fontSize="32px"
              title="当前余额"
              value={today.surplus + ' 元'}
              bordered
            />
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default Header;
