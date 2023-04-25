import React, { useState, useEffect } from 'react';
import { Table, Tag } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import moment from 'moment';




function getUserName(setData) {
  var requestOptions = {
    method: 'GET',
    redirect: 'follow',
    credentials: 'include'
  };
  fetch('http://localhost:3001/user', requestOptions)
    .then(response => response.json())
    .then(json => setData(`${json[0].first_name} ${json[0].last_name}`))
    .catch(() => setData(null));
}




function getTripHistory(setData, userName) {
  var requestOptions = {
    method: 'GET',
    redirect: 'follow',
    credentials: 'include'
  };


  fetch('http://localhost:3001/trip-history', requestOptions)
    .then(response => response.json())
    .then(json => {
      const newData = json
        .filter(trip => trip.status === 'Paid') // filter trips with 'Paid' status
        .map(trip => ({
          key: trip._id,
          tripId: trip.destination_name,
          userName: userName,
          start_date: trip.start_date,
          price: trip.price
        }));
      setData(newData);
    })
    .catch(() => setData(null));
}




const PaymentList = () => {
  const [sortOrder, setSortOrder] = useState(null);
  const [data, setData] = useState([]);
  const [userName, setUserName] = useState('');


  useEffect(() => {
    getUserName(setUserName);
    getTripHistory(setData, userName);
  }, [userName]);


  const handleTableChange = (pagination, filters, sorter) => {
    setSortOrder(sorter.order);
  };


  const columns = [
    {
      title: 'Destination',
      dataIndex: 'tripId',
      key: 'tripId'
    },
    {
      title: 'Creator',
      dataIndex: 'userName',
      key: 'userName'
    },
    {
      title: 'Start Date',
      dataIndex: 'start_date',
      key: 'start_date',
      sorter: (a, b) => new Date(a.start_date) - new Date(b.start_date),
      render: text => moment(text).format('YYYY-MM-DD')
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      sorter: (a, b) => a.price - b.price,
      render: text => {
        if (text === 0) {
          return <Tag color="orange">Pending</Tag>;
        } else {
          return <Tag color="blue">{`$${text}`}</Tag>;
        }
      }
    }
  ];


  return (
    <Table
      dataSource={data}
      columns={columns.map(column => ({
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
        )
      }))}
      onChange={handleTableChange}
    />
  );
};


export default PaymentList;