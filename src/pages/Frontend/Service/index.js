import React from 'react';
import HeaderOther from '../../../components/Header/HeaderOther';


export default function Service() {
    return (
        <>
            <HeaderOther title='Service' />
            <main>
                <div className="container-xxxl bg-white p-0">
                    <div className="container-xxl py-5">
                        <div className="container">
                            <div className="text-center">
                                <h5 className="section-title ff-secondary text-center text-primary fw-normal">Our Services</h5>
                                <h1 className="mb-5" style={{fontFamily: "Lato"}}>Explore Our Services</h1>
                            </div>
                            <div className="row g-4">
                                <div className="col-lg-3 col-sm-6">
                                    <div className="service-item rounded pt-3">
                                        <div className="p-4">
                                            <i className="fa fa-3x fa-user-tie text-primary mb-4"></i>
                                            <h5>Master Chefs</h5>
                                            <p style={{fontFamily: "Playwrite+DE+Grund"}}>Diam elitr kasd sed at elitr sed ipsum justo dolor sed clita amet diam</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 ">
                                    <div className="service-item rounded pt-3">
                                        <div className="p-4">
                                            <i className="fa fa-3x fa-utensils text-primary mb-4"></i>
                                            <h5>Quality Food</h5>
                                            <p>Diam elitr kasd sed at elitr sed ipsum justo dolor sed clita amet diam</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6">
                                    <div className="service-item rounded pt-3">
                                        <div className="p-4">
                                            <i className="fa fa-3x fa-cart-plus text-primary mb-4"></i>
                                            <h5>Online Order</h5>
                                            <p>Diam elitr kasd sed at elitr sed ipsum justo dolor sed clita amet diam</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 ">
                                    <div className="service-item rounded pt-3">
                                        <div className="p-4">
                                            <i className="fa fa-3x fa-headset text-primary mb-4"></i>
                                            <h5>24/7 Service</h5>
                                            <p>Diam elitr kasd sed at elitr sed ipsum justo dolor sed clita amet diam</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6">
                                    <div className="service-item rounded pt-3">
                                        <div className="p-4">
                                            <i className="fa fa-3x fa-wine-glass-alt text-primary mb-4"></i>
                                            <h5>Exquisite Beverages</h5>
                                            <p>Our curated selection of chief beverages complements our meals perfectly.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6">
                                    <div className="service-item rounded pt-3">
                                        <div className="p-4">
                                            <i className="fa fa-3x fa-cocktail text-primary mb-4"></i>
                                            <h5>Exclusive Cocktails</h5>
                                            <p>Our expert mixologists create unique cocktails tailored to your taste.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 ">
                                    <div className="service-item rounded pt-3">
                                        <div className="p-4">
                                            <i className="fa fa-3x fa-calendar-check  text-primary mb-4"></i>
                                            <h5>Events</h5>
                                            <p>Host your special occasions with us for a memorable celebration to your needs.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 ">
                                    <div className="service-item rounded pt-3">
                                        <div className="p-4">
                                            <i className="fa fa-3x fa-leaf text-primary mb-4"></i>
                                            <h5>Healthy Options</h5>
                                            <p>We offer a variety of healthy and organic meal options to suit your lifestyle.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </main>
        </>
    )
}
