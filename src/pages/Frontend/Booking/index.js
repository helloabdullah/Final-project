import React, { useState, useEffect, useCallback, } from 'react'
import { collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import HeaderOther from '../../../components/Header/HeaderOther'
import Reservation from '../../../components/Reservation'
import { useAuthContext } from '../../../contexts/AuthContext';
import { firestore } from '../../../config/firebase';
import dayjs from 'dayjs';

export default function Booking() {
  const { user } = useAuthContext();
  const [bookings, setBookings] = useState([]);
  const [refresh, setRefresh] = useState(false);

  // get data
  const readData = useCallback(async () => {
    if (!user?.id) return; // Make sure user.id is available
    // where query
    const q = query(collection(firestore, "Table-Bookings"), where("userId", "==", user.id));
    const querySnapshot = await getDocs(q);
    let tableBookings = [];
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      // console.log(doc.id, " => ", doc.data());
      tableBookings.push(doc.data())
    });
    setBookings(tableBookings)
  }, [user.id])

  useEffect(() => {
    readData()
  }, [readData, refresh])

   // Callback function to trigger refresh
   const handleReservationSuccess = () => {
    setRefresh((prev) => !prev); // Toggle the refresh state
  };

  // handle delete bookings
  const handleCancelBooking = async (id) => {

    try {
      await deleteDoc(doc(firestore, "Table-Bookings", id));
      // Update state by removing the deleted booking
      setBookings(bookings.filter(booking => booking.bookingId !== id) || []);
      window.toastify('Booking deleted successfully', 'success');
    } catch (error) {
      console.error("Error deleting Booking: ", error);
      window.toastify('Failed to delete Booking', 'error');
    }
  }

  return (
    <>
      <HeaderOther title='Booking' />
      <main>
        <div className="container-xxl py-5">
          <div className="container">
            <div className="text-center ">
              <h5 className="section-title ff-secondary text-center text-primary fw-normal">Your Bookings</h5>
              <h1 className="mb-5" style={{ fontFamily: 'Lato' }}>Your Bookings are Here</h1>
            </div>
            <div className="row g-4">
              {bookings.map((item, i) => (
                <div key={i} className="col-lg-4 col-sm-6  mb-2">
                  <div className="booking-card rounded-5 pt-3" >
                    <h4 className='text-center'>Booking Card</h4>
                    <div className="p-4">
                      <i className="fa fs-4 fa-user text-primary"></i><span className='fs-5 fw-normal ms-3'>{item.fullName}</span><br />
                      <i className="fa fs-4 fa-clock text-primary mt-4"></i><span className='fs-5 fw-normal ms-3'>{dayjs(item.reservedTime).format('MMM DD, YYYY h:mm A')}</span><br />
                      <i className="fa fs-4 fa-user-group text-primary mt-4"></i><span className='fs-5 fw-normal ms-3'>{item.noOfPeople} Person</span><br />
                      <i className="fa fs-4 fa-sticky-note text-primary mt-4 "></i><span className='fs-5 fw-normal ms-3'>{item.request}</span>
                      <div className='d-flex justify-content-end'>
                        <button className='btn btn-danger py-1 mt-2' onClick={() => { handleCancelBooking(item.bookingId) }}>Cancel</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Reservation onReservationSuccess={handleReservationSuccess}/>
        </div>
      </main>
    </>
  )
}
