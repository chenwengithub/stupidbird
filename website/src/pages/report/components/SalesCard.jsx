import { Card, Col, DatePicker, Row, Tabs } from 'antd';
import { formatMessage } from 'umi';
import React from 'react';
import numeral from 'numeral';
import { Bar } from './Charts';
import styles from '../style.less';
const { TabPane } = Tabs;
const rankingListData = [];

for (let i = 0; i < 7; i += 1) {
  rankingListData.push({
    title: formatMessage(
      {
        id: 'dashboardandanalysis.analysis.test',
      },
      {
        no: i,
      },
    ),
    total: 323234,
  });
}

const SalesCard = ({ salesData, loading }) => (
  <Card
    style={{
      marginBottom: 24,
    }}
    loading={loading}
    bordered={false}
    bodyStyle={{
      padding: 0,
    }}
  >
    <div className={styles.salesCard}>
      <Tabs
        tabBarExtraContent={
          <div className={styles.salesExtraWrap}>
            <DatePicker
              picker="month"
              // onChange={(m, str) => {
              //   if (str) {
              //     setDisabledMonth(false);
              //     setSearchMonth(str);
              //   } else {
              //     setDisabledMonth(true);
              //     setSearchMonth('');
              //   }
              // }}
            />
          </div>
        }
        size="large"
        tabBarStyle={{
          marginBottom: 24,
        }}
      >
        {' '}
        <TabPane tab="出库" key="views">
          <Row>
            <Col xl={16} lg={12} md={12} sm={24} xs={24}>
              <div className={styles.salesBar}>
                <Bar height={292} data={salesData} />
              </div>
            </Col>
            <Col xl={8} lg={12} md={12} sm={24} xs={24}>
              <div className={styles.salesRank}>
                <ul className={styles.rankingList}>
                  {rankingListData.map((item, i) => (
                    <li key={item.title}>
                      <span className={`${styles.rankingItemNumber} ${i < 3 ? styles.active : ''}`}>
                        {i + 1}
                      </span>
                      <span className={styles.rankingItemTitle} title={item.title}>
                        {item.title}
                      </span>
                      <span>{numeral(item.total).format('0,0')}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Col>
          </Row>
        </TabPane>
        <TabPane tab="入库" key="sales">
          <Row>
            <Col xl={24} lg={24} md={24} sm={24} xs={24}>
              <div className={styles.salesBar}>
                <Bar height={295} data={salesData} />
              </div>
            </Col>
          </Row>
        </TabPane>
      </Tabs>
    </div>
  </Card>
);

export default SalesCard;
