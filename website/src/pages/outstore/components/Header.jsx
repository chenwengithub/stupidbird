
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
  const {month} = props;
  return (
    <Card bordered={false}>
      <Row>
        <Col sm={12} xs={24}>
          <Info title="月出库量" value={month.weight + " t"} bordered />
        </Col>
        <Col sm={12} xs={24}>
          <Info title="月出库额" value={month.paid + " 元"} bordered />
        </Col>
      </Row>
    </Card>
  );
};

export default Header;
