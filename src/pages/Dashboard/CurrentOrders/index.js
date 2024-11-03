import React, { useState, useEffect, useCallback } from 'react';
import { Space, Table, Tag, Modal, Form, Select, } from 'antd';
import { collection, deleteDoc, doc, getDocs, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '../../../config/firebase';
import { useMenuContext } from '../../../contexts/MenuContext';
import moment from 'moment';

const { Option } = Select;
export default function CurrentOrders() {
  const { menuItems } = useMenuContext();
  const [orders, setOrders] = useState([]);
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState("");
  const [status, setStatus] = useState('');

  // read data from firestore
  const readData = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, "Orders"));
      let ordersList = [];
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        // console.log(doc.id, " => ", doc.data());
        ordersList.push(doc.data())
      });

      // Step 2: Fetch Users from Firestore and Map Names to Orders
      const usersSnapshot = await getDocs(collection(firestore, "users"));
      const users = {};
      usersSnapshot.forEach((doc) => {
        users[doc.id] = doc.data().fullName; // Assuming `fullName` field exists
      });

      // Step 3: Map Orders with User Names
      const mappedOrders = ordersList.map((order) => ({
        ...order,
        userName: users[order.userId] || "Unknown User", // Replace userId with fullName
      }));

      setOrders(mappedOrders);

    } catch (error) {
      console.error("Error fetching data: ", error);
    }

  }, [])

  useEffect(() => { readData() }, [readData])

  // table data
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
      orderId: u.orderId,
      status: u.status,
    }
  });

  const columns = [
    { title: 'St#', dataIndex: 'num', key: 'num' },
    { title: 'Name', dataIndex: 'userName', key: 'userName', },
    { title: 'Items Quantity', dataIndex: 'items_quantity', key: 'items_quantity', },
    { title: 'Total', dataIndex: 'total', key: 'total', },
    { title: 'Created At', dataIndex: 'createdAt', key: 'createdAt', },
    { title: 'Id', dataIndex: 'orderId', key: 'orderId', },
    {
      title: 'Status', dataIndex: 'status', key: 'status',
      render: (_, { status }) => {
        // Determine the color based on the length of the status 
        let color = status.length < 7 ? 'geekblue' : 'green';
        return (
          <Tag color={color} key={status}>
            {status.toUpperCase()}
          </Tag>
        );
      }
    },
    {
      title: 'Action', key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <button className='btn btn-sm btn-outline-warning' onClick={() => handleUpdate(record.orderId)}>Update</button>
        </Space>
      ),
    },
  ];

    // Handle role selection change
    const handleStatusChange = (value) => {
      setStatus(value);
    };

  // handle form submit after updation
  const handleFormSubmit = async () => {
    setConfirmLoading(true);
    let data = orders.find(order => order.orderId === selectedOrder);
    const { userName, orderId, userId, order, createdAt } = data;

    if (status === "active") {
      setConfirmLoading(false)
      setOpen(false)
      return window.toastify("Updated Status Successfully", "success")
    }

    try {

      // Step 1: Update the order status in the Orders collection
      const docRef = doc(firestore, "Orders", selectedOrder);
      await updateDoc(docRef, {
        status: status,
      });

      // Step 2: Create a new document in the Order-History collection with the same ID as the orderId
      const orderHistoryRef = doc(firestore, "Order-History", selectedOrder);
      await setDoc(orderHistoryRef, {
        userName,
        orderId,
        userId,
        order,
        status: status,
        createdAt,
        updatedAt: serverTimestamp() // Use Firestore's server timestamp for consistency
      });


      // Step 3: Delete the original order
      await deleteDoc(docRef);

      // update the local state to reflect the changes
      setOrders(orders.filter(order => order.orderId !== selectedOrder));

      window.toastify("Order updated and moved to history successfully!", 'success');
      setOpen(false);
    } catch (error) {
      console.error("Error updating and moving order: ", error);
      window.toastify('Failed to update and move order', 'error');
    } finally {
      setConfirmLoading(false);
      setStatus('')
    }
  };


  const handleCancel = () => {
    setOpen(false);
  };

  const handleUpdate = (id) => {
    setSelectedOrder(id)
    setOpen(true)
  }


  return (
    <>
      <div className='row heading m-5'>
        <h2 className='text-center'>Current Orders</h2>
      </div>
      <div className='table-responsive'>
        <Table columns={columns} dataSource={data} />
      </div>
      <Modal
        title="Title"
        open={open}
        onOk={handleFormSubmit}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Form onFinish={handleFormSubmit} layout="vertical">
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select a Status' }]}
          >
            <Select placeholder="status" value={status} onChange={handleStatusChange}>
              <Option value="active">Active</Option>
              <Option value="completed">Completed</Option>
              <Option value="incompleted">Incompleted</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
