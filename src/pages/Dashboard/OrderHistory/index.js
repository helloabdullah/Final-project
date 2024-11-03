import React, { useState, useEffect, useCallback, } from 'react';
import { Table, Tag } from 'antd';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../../../config/firebase';
import { useMenuContext } from '../../../contexts/MenuContext';
import moment from 'moment';

export default function OrderHistory() {
  const { menuItems } = useMenuContext();
  const [orders, setOrders] = useState([]);

  const readData = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, "Order-History"));
      let ordersList = [];
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        // console.log(doc.id, " => ", doc.data());
        ordersList.push(doc.data())
      });

      setOrders(ordersList);

    } catch (error) {
      console.error("Error fetching data: ", error);
    }

  }, [])

  useEffect(() => { readData() }, [readData])

// data on table
  const data = orders.map((u, i) => {
    let totalPrice = 0;
    // Create ordered list for the items using the item name and quantity
    const itemsList = (
      <ol>
        {u.order && u.order.map((item) => {
          const menuItem = menuItems.find((menu) => menu.itemId === item.itemId) || {};

          // Extract `title` and `price` from the found menu item
          const { title = "Unknown Item", price = '0' } = menuItem;

          // Calculate the item total price
          const itemTotal = parseFloat(price) * item.quantity || 1;
          totalPrice += itemTotal // Update the total price


          return (
            <li key={item.itemId}>
              {title} (Quantity: {item.quantity})
            </li>
          );
        })}
      </ol>
    );

    return {
      key: i + 1,
      num: i + 1,
      userName: u.userName,
      items_quantity: itemsList,
      total: totalPrice.toFixed(2),
      createdAt: u.createdAt ? moment(u.createdAt.seconds * 1000).format('YYYY-MM-DD h:mm:ss a') : 'N/A',
      updatedAt: u.updatedAt ? moment(u.updatedAt.seconds * 1000).format('YYYY-MM-DD h:mm:ss a') : 'N/A',
      status: u.status,
    }
  });

  const columns = [
    { title: 'St#', dataIndex: 'num', key: 'num' },
    { title: 'Name', dataIndex: 'userName', key: 'userName', },
    { title: 'Items Quantity', dataIndex: 'items_quantity', key: 'items_quantity', },
    { title: 'Total', dataIndex: 'total', key: 'total', },
    { title: 'Created At', dataIndex: 'createdAt', key: 'createdAt', },
    { title: 'Updated At', dataIndex: 'updatedAt', key: 'updatedAt', },
    {
      title: 'Status', dataIndex: 'status', key: 'status',
      render: (_, { status }) => {
        // Determine the color based on the length of the status 
        let color = status.length < 10 ? 'yellow' : 'red';

        return (
          <Tag color={color} key={status}>
            {status.toUpperCase()}
          </Tag>
        );
      }
    },
  ];

  return (
    <>
      <div className='row heading m-5'>
        <h2 className='text-center'>Orders History</h2>
      </div>
      <div className='table-responsive'>
        <Table columns={columns} dataSource={data} />
      </div>
    </>
  )
}
