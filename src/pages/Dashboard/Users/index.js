import React, { useCallback, useEffect, useState } from 'react';
import { Space, Table, Tag, Modal, Form, Select, Button } from 'antd';
import { collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { firestore } from '../../../config/firebase';
import moment from 'moment';

const { Option } = Select;
export default function Users() {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [selectedUser, setSelectedUser] = useState({});
  const [role, setRole] = useState([]);

  // get data from firestore
  const readData = useCallback(async () => {
    const querySnapshot = await getDocs(collection(firestore, "users"));
    let userList = [];
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      // console.log(doc.id, " => ", doc.data());
      userList.push(doc.data())
    });
    setUsers(userList)
  }, [])


  useEffect(() => { readData() }, [readData])

// print data on table
  const data = users.map((u, i) => {
    return {
      key: i + 1,
      num: i + 1,
      fullName: u.fullName,
      email: u.email,
      id: u.id,
      createdAt: u.createdAt ? moment(u.createdAt.seconds * 1000).format('YYYY-MM-DD h:mm:ss a') : 'N/A',
      role: u.roles || 'N/A',
    }
  });

  const columns = [
    { title: 'St#', dataIndex: 'num', key: 'num' },
    { title: 'Name', dataIndex: 'fullName', key: 'fullName', },
    { title: 'Email', dataIndex: 'email', key: 'email', },
    { title: 'Id', dataIndex: 'id', key: 'id', },
    { title: 'Created At', dataIndex: 'createdAt', key: 'createdAt', },
    {
      title: 'Role', key: 'role', dataIndex: 'role',
      render: (_, { role }) => (
        <>
          {(role || []).map((tag) => {
            let color = tag.length < 5 ? 'geekblue' : 'green';
            if (tag === 'loser') {
              color = 'volcano';
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: 'Action', key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <button className='btn btn-sm btn-outline-warning' onClick={() => handleUpdate(record)}>Update</button>
          <Button className='btn btn-sm btn-outline-danger' loading={deletingId === record.id} onClick={() => handleDelete(record.id)} >Delete</Button>
        </Space>
      ),
    },
  ];

// delete vuser data
  const handleDelete = async (id) => {
    try {
      setDeletingId(id); // Set the ID of the user being deleted
      await deleteDoc(doc(firestore, "users", id));
      // Update state by removing the deleted user
      setUsers(users.filter(user => user.id !== id));
      window.toastify('User deleted successfully', 'success');
    } catch (error) {
      console.error("Error deleting user: ", error);
      window.toastify('Failed to delete user', 'error');
    }

  }

// handle form submit after updation
  const handleFormSubmit = async () => {
    setConfirmLoading(true);
    try {
      const docRef = doc(firestore, "users", selectedUser.id);
      await updateDoc(docRef, {
        roles: role
      });
      setUsers(users.map(user => user.id === selectedUser.id ? { ...user, roles: role } : user))
      window.toastify("User Updated Successfully!", 'success')
      setOpen(false);
    } catch (error) {
      console.error("Error updating user role: ", error);
      window.toastify('Failed to update user role', 'error');
    } finally {
      setConfirmLoading(false);
    }
  };

  
  const handleCancel = () => {
    setOpen(false);
  };

  const handleUpdate = (user) => {
    setSelectedUser(user)
    setOpen(true)
  }
  // Handle role selection change
  const handleRoleChange = (value) => {
    setRole(value);
  };


  return (
    <>
      <div className='row heading m-5'>
        <h2 className='text-center'>Users</h2>
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
            name="role"
            label="Role"
            rules={[{ required: true, message: 'Please select a role' }]}
          >
            <Select mode="multiple" placeholder="Select user role" value={role} onChange={handleRoleChange}>
              <Option value="admin">Admin</Option>
              <Option value="user">User</Option>
              <Option value="editor">Editor</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
