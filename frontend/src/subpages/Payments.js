import React, { useState } from 'react';
import { Table, Tag } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

const data = [
  {
    key: '1',
    price: 100,
    userName: 'John Brown',
    tripId: 'T123456',
    date: '2022-01-01',
  },
  {
    key: '2',
    price: 200,
    userName: 'John Brown',
    tripId: 'T234567',
    date: '2022-01-02',
  },
  {
    key: '3',
    price: 300,
    userName: 'John Brown',
    tripId: 'T345678',
    date: '2022-01-03',
  },
];

const columns = [
  {
    title: 'Trip ID',
    dataIndex: 'tripId',
    key: 'tripId',
  },
  {
    title: 'User Name',
    dataIndex: 'userName',
    key: 'userName',
  },
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
    sorter: (a, b) => new Date(a.date) - new Date(b.date),
  },
  {
    title: 'Price',
    dataIndex: 'price',
    key: 'price',
    sorter: (a, b) => a.price - b.price,
    render: (text) => <Tag color="blue">{text}</Tag>,
  },
];

const PaymentList = () => {
  const [sortOrder, setSortOrder] = useState(null);

  const handleTableChange = (pagination, filters, sorter) => {
    setSortOrder(sorter.order);
  };

  return (
    <Table
      dataSource={data}
      columns={columns.map((column) => ({
        ...column,
        sortOrder: sortOrder === column.dataIndex && sortOrder,
        sorter: sortOrder === column.dataIndex && column.sorter,
        title: (
          <div onClick={() => setSortOrder(column.dataIndex)}>
            {column.title}
            {sortOrder === column.dataIndex &&
              (sortOrder === 'ascend' ? (
                <ArrowUpOutlined />
              ) : (
                <ArrowDownOutlined />
              ))}
          </div>
        ),
      }))}
      onChange={handleTableChange}
    />
  );
};

export default PaymentList;