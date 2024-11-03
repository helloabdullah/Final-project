import React, { useState, useEffect, useCallback } from 'react';
import { Space, Table } from 'antd';
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { firestore } from '../../../config/firebase';
import moment from 'moment';

export default function Feedback() {
  const [feedbacks, setFeedbacks] = useState([]);

  // get data from firestore
  const readData = useCallback(async () => {
    const querySnapshot = await getDocs(collection(firestore, "Feedback"));
    let feedbackList = [];
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      // console.log(doc.id, " => ", doc.data());
      feedbackList.push(doc.data())
    });
    setFeedbacks(feedbackList)
  }, [])

  useEffect(() => { readData() }, [readData])

// table data
  const data = feedbacks.map((u, i) => {
    return {
      key: i + 1,
      num: i + 1,
      fullName: u.name,
      email: u.email,
      subject: u.subject,
      message: u.message,
      createdAt: u.addDate ? moment(u.addDate.seconds * 1000).format('YYYY-MM-DD h:mm:ss a') : 'N/A',
      userId: u.userId,
      feedbackId: u.feedbackId,
    }
  });

  const columns = [
    { title: 'St#', dataIndex: 'num', key: 'num' },
    { title: 'Name', dataIndex: 'fullName', key: 'fullName', },
    { title: 'Email', dataIndex: 'email', key: 'email', },
    { title: 'Subject', dataIndex: 'subject', key: 'subject', },
    { title: 'Message', dataIndex: 'message', key: 'message', },
    { title: 'Created At', dataIndex: 'createdAt', key: 'createdAt', },
    { title: 'User Id', dataIndex: 'userId', key: 'userId', },
    { title: 'feedback Id', dataIndex: 'feedbackId', key: 'feedbackId', },

    {
      title: 'Action', key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <button className='btn btn-sm btn-outline-danger' onClick={() => handleDelete(record.feedbackId)} >Delete</button>
        </Space>
      ),
    },

  ];

// delete data function
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(firestore, "Feedback", id));
      // Update state by removing the deleted feedback
      setFeedbacks(feedbacks.filter(feedback => feedback.feedbackId !== id));
      window.toastify('feedback deleted successfully', 'success');
    } catch (error) {
      console.error("Error deleting Feedback: ", error);
      window.toastify('Failed to delete Feedback', 'error');
    }

  }

  return (
    <>
      <div className='row heading m-5'>
        <h2 className='text-center'>User Feedback</h2>
      </div>
      <div className='table-responsive'>
        <Table columns={columns} dataSource={data} />
      </div>
    </>
  )
}
