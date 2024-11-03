import React, { useState } from 'react';
import { collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import tableImg from './../../assets/pic/table3.jpg';
import table2Img from './../../assets/pic/table1.jpg';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import { firestore } from '../../config/firebase';

const initialState = { fullName: '', email: '', reservedTime: '', noOfPeople: '', request: '' };
const isValidEmail = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;

export default function Reservation({ onReservationSuccess }) {
  const { isAuthenticated, user } = useAuthContext();
  const [state, setState] = useState(initialState);
  const navigate = useNavigate()

  // handle state change
  const handleChange = e => setState(s => ({ ...s, [e.target.name]: e.target.value }))
  
// booking added function
  const handleBooking = async (e) => {
    e.preventDefault();
    
    // check login.
    if (!isAuthenticated) { window.toastify("Please Login", "info"); return navigate('/auth/login') }

    let { fullName, email, reservedTime, noOfPeople, request } = state;
    fullName = fullName.trim();
    email = email.trim();

    if (fullName === "" || email === "" || noOfPeople === '' || reservedTime === '') { return window.toastify("All fields are must required", "error") }
    if (fullName.length < 3) { return window.toastify("Enter correct username", "error") }
    if (!email.match(isValidEmail)) { return window.toastify("Invalid Email", 'error') }

     // Validate that the reserved date is not in the past
     const selectedDateTime = new Date(reservedTime);
     const currentDateTime = new Date();
 
     if (selectedDateTime < currentDateTime) {
       return window.toastify("Cannot select a past date and time for reservation", "error");
     }

    //get current userId.
    let userId = user.id;
    let userBooking = {
      userId,
      fullName,
      email,
      reservedTime,
      noOfPeople,
      request,
      status:'active',
      bookingTime: serverTimestamp(),
    }

    
    try {
      // Create a new document reference with an auto-generated ID
      const newDocRef = doc(collection(firestore, "Table-Bookings"));

      // Get the generated document ID
      const documentId = newDocRef.id;

      // Set the document data with the document ID included
      await setDoc(newDocRef, {
        ...userBooking,
        bookingId: documentId,  // Include the ID in the document data
      });

      window.toastify("Booking Added Successfully", "success")
      setState(initialState);
       
      // Call the success callback to refresh the bookings
      onReservationSuccess();
    } catch (error) {
      console.error("Error adding document: ", error.message);
      window.toastify("Something went wrong while Add booking", "success")
    }

  }


  return (
    <div className="container-xxl py-5 px-0 ">
      <div className="row g-0">
        <div className="col-md-6" >
          <img src={tableImg} alt="" style={{ width: "100%" }} />
          <img src={table2Img} alt="" style={{ height: 250, width: "100%" }} />
        </div>
        <div className="col-md-6 bg-dark d-flex align-items-center">
          <div className="p-5 wow fadeInUp" data-wow-delay="0.2s">
            <h5 className="section-title ff-secondary text-start text-primary fw-normal">Reservation</h5>
            <h1 className="text-white mb-4">Book A Table Online</h1>
            <form>
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="form-floating">
                    <input type="text" className="form-control" id="name" placeholder="Your Name" name='fullName' value={state.fullName} onChange={handleChange} />
                    <label htmlFor="name">Your Name</label>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-floating">
                    <input type="email" className="form-control" id="email" placeholder="Your Email" name='email' value={state.email} onChange={handleChange} />
                    <label htmlFor="email">Your Email</label>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-floating date" id="date3" data-target-input="nearest">
                    <input type="datetime-local" className="form-control datetimepicker-input" id="datetime" placeholder="Date & Time" data-target="#date3" data-toggle="datetimepicker" name='reservedTime' value={state.reservedTime} onChange={handleChange} />
                    <label htmlFor="datetime">Date & Time</label>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-floating">
                    <select className="form-select" id="select1" name='noOfPeople' value={state.noOfPeople} onChange={handleChange}>
                      <option value="">select</option>
                      <option value="1">People 1</option>
                      <option value="2">People 2</option>
                      <option value="3">People 3</option>
                    </select>
                    <label htmlFor="select1">No Of People</label>
                  </div>
                </div>
                <div className="col-12">
                  <div className="form-floating">
                    <textarea className="form-control" placeholder="Special Request" id="message" style={{ height: "100px" }} name='request' value={state.request} onChange={handleChange}></textarea>
                    <label htmlFor="message" >Special Request</label>
                  </div>
                </div>
                <div className="col-12">
                  <button className="btn btn-primary w-100 py-3"  type="submit" onClick={handleBooking}>Book Now</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

  )
}
