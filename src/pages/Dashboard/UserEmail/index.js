import React, { useState, useEffect, useCallback } from 'react';
import { Space, Table } from 'antd';
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { firestore } from '../../../config/firebase';
import moment from 'moment';

export default function UserEmail() {
  const [emails, setEmails] = useState([]);

  // dete fetch from firestore
  const readData = useCallback(async () => {
    const querySnapshot = await getDocs(collection(firestore, "Emails"));
    let emailList = [];
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      // console.log(doc.id, " => ", doc.data());
      emailList.push(doc.data())
    });
    setEmails(emailList)
  }, [])

  useEffect(() => { readData() }, [readData])

  // data print on table
  const data = emails.map((u, i) => {
    return {
      key: i + 1,
      num: i + 1,
      email: u.email,
      createdAt: u.addDate ? moment(u.addDate.seconds * 1000).format('YYYY-MM-DD h:mm:ss a') : 'N/A',
      userId: u.userId,
      emailId: u.emailId,
    }
  });

  const columns = [
    { title: 'St#', dataIndex: 'num', key: 'num' },
    { title: 'Email', dataIndex: 'email', key: 'email', },
    { title: 'Created At', dataIndex: 'createdAt', key: 'createdAt', },
    { title: 'User Id', dataIndex: 'userId', key: 'userId', },
    { title: 'Email Id', dataIndex: 'emailId', key: 'emailId', },
    {
      title: 'Action', key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <button className='btn btn-sm btn-outline-danger' onClick={() => handleDelete(record.emailId)} >Delete</button>
        </Space>
      ),
    },
  ];

// delete emails 
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(firestore, "Emails", id));
      // Update state by removing the deleted feedback
      setEmails(emails.filter(e => e.emailId !== id));
      window.toastify('Email deleted successfully', 'success');
    } catch (error) {
      console.error("Error deleting Email: ", error);
      window.toastify('Failed to delete Email', 'error');
    }

  }

  return (
    <>
      <div className='row heading m-5'>
        <h2 className='text-center'>User Emails</h2>
      </div>
      <div className='table-responsive'>
        <Table columns={columns} dataSource={data} />
      </div>
    </>
  )
}
