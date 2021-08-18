
import React from 'react';
import { Card, Row, Col } from 'antd';
import styles from '../style.less';
const Info = ({ title, value, bordered }) => (
  <div className={styles.headerInfo}>
    <span>{title}</span>
    <p>{value}</p>
    {bordered && <em />}
  </div>
);
const Header = (props) => {
  const {today} = props;
  return (
    <Card bordered={false}>
      <Row>
        <Col sm={8} xs={24}>
          <Info title="入库" value={today.total + " 个"} bordered />
        </Col>
        <Col sm={8} xs={24}>
          <Info title="重量" value={today.weight + " kg"} bordered />
        </Col>
        <Col sm={8} xs={24}>
          <Info title="支出" value={today.paid + " 元"} />
        </Col>
      </Row>
    </Card>
  );
};

export default Header;
