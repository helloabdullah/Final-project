import React, { useState, useEffect, useCallback } from 'react';
import { Space, Table, Tag, Modal, Form, Select } from 'antd';
import { collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { firestore } from '../../../config/firebase';
import moment from 'moment';

const { Option } = Select;

export default function TableBooking() {
  const [tableBookings, setTabelBookings] = useState([]);
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState({});
  const [status, setStatus] = useState([]);

  // get data from firestore
  const readData = useCallback(async () => {
    const querySnapshot = await getDocs(collection(firestore, "Table-Bookings"));
    let tableBookings = [];
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      // console.log(doc.id, " => ", doc.data());
      tableBookings.push(doc.data())
    });
    setTabelBookings(tableBookings)
  }, [])


  useEffect(() => { readData() }, [readData])

  // data print on table
  const data = tableBookings.map((u, i) => {
    return {
      key: i + 1,
      num: i + 1,
      fullName: u.fullName,
      email: u.email,
      person: u.noOfPeople,
      bookingId: u.bookingId,
      createdAt: u.bookingTime ? moment(u.bookingTime.seconds * 1000).format('YYYY-MM-DD h:mm:ss a') : 'N/A',
      reservedTime: u.reservedTime ? moment(u.reservedTime).format('YYYY-MM-DD h:mm:ss a') : 'N/A',
      request: u.request,
      status: u.status,
    }
  });

  const columns = [
    { title: 'St#', dataIndex: 'num', key: 'num' },
    { title: 'Name', dataIndex: 'fullName', key: 'fullName', },
    { title: 'Email', dataIndex: 'email', key: 'email', },
    { title: 'Persons', dataIndex: 'person', key: 'person', },
    { title: 'Id', dataIndex: 'bookingId', key: 'bookingId', },
    { title: 'Created At', dataIndex: 'createdAt', key: 'createdAt', },
    { title: 'Reserved Time', dataIndex: 'reservedTime', key: 'reservedTime', },
    { title: 'Special Request', dataIndex: 'request', key: 'request', },
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
          <button className='btn btn-sm btn-outline-warning' onClick={() => handleUpdate(record)}>Update</button>
          <button className='btn btn-sm btn-outline-danger' onClick={() => handleDelete(record.bookingId)} >Delete</button>
        </Space>
      ),
    },
  ];

  // dalete bookings
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(firestore, "Table-Bookings", id));
      // Update state by removing the deleted booking
      setTabelBookings(tableBookings.filter(booking => booking.bookingId !== id));
      window.toastify('Booking deleted successfully', 'success');
    } catch (error) {
      console.error("Error deleting Booking: ", error);
      window.toastify('Failed to delete Booking', 'error');
    }

  }

  // handle form submit after updation
  const handleFormSubmit = async () => {
    setConfirmLoading(true);
    try {
      const docRef = doc(firestore, "Table-Bookings", selectedBooking.bookingId);
      await updateDoc(docRef, {
        status: status
      });
      setTabelBookings(tableBookings.map(booking => booking.bookingId === selectedBooking.bookingId ? { ...booking, status: status } : booking))
      window.toastify("Booking Updated Successfully!", 'success')
      setOpen(false);
    } catch (error) {
      console.error("Error updating Booking Status: ", error);
      window.toastify('Failed to update Booking Status', 'error');
    } finally {
      setConfirmLoading(false);
    }

  };


  const handleCancel = () => {
    setOpen(false);
  };

  const handleUpdate = (booking) => {
    setSelectedBooking(booking)
    setOpen(true)
  }
  // Handle role selection change
  const handleStatusChange = value =>  setStatus(value);

  return (
    <>
      <div className='row heading m-5'>
        <h2 className='text-center'>Table Bookings</h2>
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
