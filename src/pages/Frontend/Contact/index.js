import React, { useState } from 'react'
import HeaderOther from '../../../components/Header/HeaderOther';
import { collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useAuthContext } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { firestore } from '../../../config/firebase';
import { Button } from 'antd';

const initialState = { name: '', email: '', subject: '', message: '' };
const isValidEmail = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;

export default function Contact() {
    const { isAuthenticated, user } = useAuthContext();
    const [state, setState] = useState(initialState);
    const [isProcessing, setIsProcessing] = useState(false)
    const navigate = useNavigate();

    // handle state change
    const handleChange = e => setState(s => ({ ...s, [e.target.name]: e.target.value }))

    // handle message
    const handleMessage = async (e) => {
        e.preventDefault();

        if (!isAuthenticated) { window.toastify("Please Login", "info"); return navigate('/auth/login') }

        let { name, email, subject, message } = state;
        name = name.trim()
        email = email.trim()

        if (name === "" || email === "" || subject === '' || message === '') { return window.toastify("All fields are must required", "error") };
        if (name.length < 3) { return window.toastify("Enter correct username", 'error') };
        if (!email.match(isValidEmail)) { return window.toastify("Invalid Email", 'error') };

        let msg = {
            userId: user.id,
            name,
            email,
            subject,
            message,
            addDate: serverTimestamp(),
        }
        setIsProcessing(true)

        try {
            // Create a new document reference with an auto-generated ID
            const newDocRef = doc(collection(firestore, "Feedback"));
            // Get the generated document ID
            const documentId = newDocRef.id;
            await setDoc(newDocRef, {
                ...msg,
                feedbackId: documentId,  // Include the ID in the document data
            });

            window.toastify("Feedback Added Successfully", "success")
            setState(initialState);
        } catch (error) {
            console.error("Error adding document: ", error);
            window.toastify("Something went wrong while sending feedback", "error")
        }
        setIsProcessing(false)
    }

    return (
        <>
            <HeaderOther title='Contact' />
            <main>
                <div className="container-xxl py-5">
                    <div className="container">
                        <div className="text-center">
                            <h5 className="section-title ff-secondary text-center text-primary fw-normal">Contact Us</h5>
                            <h1 className="mb-5" style={{ fontFamily: 'Lato' }}>Contact For Any Query</h1>
                        </div>
                        <div className="row g-4">
                            <div className="col-12">
                                <div className="row gy-4">
                                    <div className="col-md-4">
                                        <h5 className="section-title ff-secondary fw-normal text-start text-primary">Booking</h5>
                                        <p><i className="fa fa-envelope-open text-primary me-2"></i>book@example.com</p>
                                    </div>
                                    <div className="col-md-4">
                                        <h5 className="section-title ff-secondary fw-normal text-start text-primary">General</h5>
                                        <p><i className="fa fa-envelope-open text-primary me-2"></i>info@example.com</p>
                                    </div>
                                    <div className="col-md-4">
                                        <h5 className="section-title ff-secondary fw-normal text-start text-primary">Technical</h5>
                                        <p><i className="fa fa-envelope-open text-primary me-2"></i>tech@example.com</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 wow fadeIn" data-wow-delay="0.1s">
                                <iframe className="position-relative rounded w-100 h-100"
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3001156.4288297426!2d-78.01371936852176!3d42.72876761954724!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4ccc4bf0f123a5a9%3A0xddcfc6c1de189567!2sNew%20York%2C%20USA!5e0!3m2!1sen!2sbd!4v1603794290143!5m2!1sen!2sbd"
                                    frameBorder="0" style={{ minHeight: '350px', border: 0 }} allowFullScreen="" aria-hidden="false"
                                    tabIndex="0" title="Google Maps"></iframe>
                            </div>
                            <div className="col-md-6">
                                <div className="">
                                    <form>
                                        <div className="row g-3">
                                            <div className="col-md-6">
                                                <div className="form-floating">
                                                    <input type="text" className="form-control" id="name" placeholder="Your Name" name='name' value={state.name} onChange={handleChange} />
                                                    <label htmlFor="name">Your Name</label>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-floating">
                                                    <input type="email" className="form-control" id="email" placeholder="Your Email" name='email' value={state.email} onChange={handleChange} />
                                                    <label htmlFor="email">Your Email</label>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="form-floating">
                                                    <input type="text" className="form-control" id="subject" placeholder="Subject" name='subject' value={state.subject} onChange={handleChange} />
                                                    <label htmlFor="subject">Subject</label>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="form-floating">
                                                    <textarea className="form-control" placeholder="Leave a message here" id="message" style={{ height: "150px" }} name='message' value={state.message} onChange={handleChange}></textarea>
                                                    <label htmlFor="message">Message</label>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <Button className="btn btn-primary w-100 " size='large' loading={isProcessing} type="submit" onClick={handleMessage}>Send Message</Button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}
