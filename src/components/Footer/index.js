import React, {useState} from 'react';
import { collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { firestore } from '../../config/firebase';
import { useAuthContext } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Footer() {
    const {isAuthenticated, user} = useAuthContext();
    const [state, setState] = useState('');
    const navigate = useNavigate();
    let year = new Date().getFullYear();

    // handle state changes
    const handleChange = (e) => {
        setState(s => ({...s,[e.target.name]: e.target.value}))
    }

    // handle submit
    const handleSubmit = async(e) => {
        e.preventDefault();

        if (!isAuthenticated) { window.toastify("Please Login", "info"); return navigate('/auth/login') }

        let {email} = state
        if(!email){return window.toastify("Enter email",'error')}
        email = email.trim();

        if(!window.isEmail(email)){return  window.toastify("Invalid Email",'error')}
        
        try {
            // Create a new document reference with an auto-generated ID
            const newDocRef = doc(collection(firestore, "Emails"));

            // Get the generated document ID
            const documentId = newDocRef.id;

            // Set the document data with the document ID included
            await setDoc(newDocRef, {
                email,
                userId: user.id,
                createdAt: serverTimestamp(),
                emailId: documentId,  // Include the ID in the document data
            });

            window.toastify("Email Added Successfully", "success");
            setState(' ');

        } catch (error) {
            console.error("Error adding email: ", error);
            window.toastify("Something went wrong while adding Email", "error");
        }

    }

    return (
        <footer>
            <div className="container-fluid bg-dark text-light footer pt-5 mt-5">
                <div className="container py-5">
                    <div className="row g-5">
                        <div className="col-lg-3 col-md-6">
                            <h4 className="section-title ff-secondary text-start text-primary fw-normal mb-4">Company</h4>
                            <p className="btn btn-link" >About Us</p>
                            <p className="btn btn-link" >Contact Us</p>
                            <p className="btn btn-link" >Reservation</p>
                            <p className="btn btn-link" >Privacy Policy</p>
                            <p className="btn btn-link" >Terms & Condition</p>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <h4 className="section-title ff-secondary text-start text-primary fw-normal mb-4">Contact</h4>
                            <p className="mb-2"><i className="fa fa-map-marker-alt me-3"></i>123 Street, New York, USA</p>
                            <p className="mb-2"><i className="fa fa-phone-alt me-3"></i>+1 672390203</p>
                            <p className="mb-2"><i className="fa fa-envelope me-3"></i>info@example.com</p>
                            <div className="d-flex pt-2">
                                <p className="btn btn-outline-primary btn-social" ><i className="fab fa-twitter"></i></p>
                                <p className="btn btn-outline-primary btn-social" ><i className="fab fa-facebook-f"></i></p>
                                <p className="btn btn-outline-primary btn-social" ><i className="fab fa-instagram"></i></p>
                                <p className="btn btn-outline-primary btn-social" ><i className="fab fa-linkedin-in"></i></p>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <h4 className="section-title ff-secondary text-start text-primary fw-normal mb-4">Opening</h4>
                            <h5 className="text-light fw-normal">Monday - Saturday</h5>
                            <p>09AM - 09PM</p>
                            <h5 className="text-light fw-normal">Sunday</h5>
                            <p>10AM - 08PM</p>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <h4 className="section-title ff-secondary text-start text-primary fw-normal mb-4">Newsletter</h4>
                            <p>Get the Best from Food Hub. Join Our Foodie Community!</p>
                            <div className="position-relative mx-auto" style={{ maxWidth: '400px' }}>
                                <input className="form-control border-primary w-100 py-3 ps-4 pe-5" type="text" placeholder="Your email" name='email' value={state.email} onChange={handleChange} />
                                <button type="button" className="btn btn-primary py-2 position-absolute top-0 end-0 mt-2 me-2"  onClick={handleSubmit}>Submit</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container">
                    <div className="copyright">
                        <div className="row">
                            <div className="col text-center text-md-start mb-3 mb-md-0">
                                <p className='text-center'> &copy;{year} , All Right Reserved.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
