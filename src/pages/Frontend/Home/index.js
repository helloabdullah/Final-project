import React from 'react';
import { Carousel } from 'antd';

import HeaderHero from './../../../components/Header/HeaderHero';
import MenuList from '../../../components/MenuList';
import about1 from './../../../assets/pic/about-1.jpg';
import about2 from './../../../assets/pic/about-2.jpg';
import about3 from './../../../assets/pic/about-3.jpg';
import about4 from './../../../assets/pic/about-4.jpg';
import client1 from './../../../assets/pic/testimonial-1.jpg';
import client2 from './../../../assets/pic/testimonial-2.jpg';
import client3 from './../../../assets/pic/testimonial-3.jpg';
import client4 from './../../../assets/pic/testimonial-4.jpg';
import Reservation from '../../../components/Reservation';

export default function Home() {

  const contentStyle = {
    height: '160px',
    color: '#fb8500',
    lineHeight: '160px',
    textAlign: 'center',
    background: '#364d79',
  };

  return (
    <>
      <HeaderHero />
      <main>
        <div className="container-xxl py-5">
          <div className="container">
            <div className="row g-4">
              <div className="col-lg-3 col-sm-6 " >
                <div className="service-item rounded pt-3">
                  <div className="p-4">
                    <i className="fa fa-3x fa-user-tie text-primary mb-4"></i>
                    <h5>Master Chefs</h5>
                    <p>Our master chefs create culinary masterpieces with precision.</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-sm-6 ">
                <div className="service-item rounded pt-3">
                  <div className="p-4">
                    <i className="fa fa-3x fa-utensils text-primary mb-4"></i>
                    <h5>Quality Food</h5>
                    <p>We serve high-quality dishes made from the freshest ingredients.</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-sm-6 " >
                <div className="service-item rounded pt-3">
                  <div className="p-4">
                    <i className="fa fa-3x fa-cart-plus text-primary mb-4"></i>
                    <h5>Online Order</h5>
                    <p>Enjoy our delicious food with convenience of online ordering.</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-sm-6 ">
                <div className="service-item rounded pt-3">
                  <div className="p-4">
                    <i className="fa fa-3x fa-headset text-primary mb-4"></i>
                    <h5>24/7 Service</h5>
                    <p>We offer round-the-clock service to meet your needs at any time.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* about section */}
        <div className="container-xxl py-5">
          <div className="container">
            <div className="row g-5 align-items-center">
              <div className="col-lg-6">
                <div className="row g-3">
                  <div className="col-6 text-start">
                    <img className="img-fluid rounded w-100 " src={about1} alt='' />
                  </div>
                  <div className="col-6 text-start">
                    <img className="img-fluid rounded w-75 " src={about2} alt='' style={{ marginTop: "25%" }} />
                  </div>
                  <div className="col-6 text-end">
                    <img className="img-fluid rounded w-75 " src={about3} alt='' />
                  </div>
                  <div className="col-6 text-end">
                    <img className="img-fluid rounded w-100 " src={about4} alt='' />
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <h5 className="section-title ff-secondary text-start text-primary fw-normal">About Us</h5>
                <h1 className="mb-4 ">Welcome to <i className="fa fa-utensils text-primary me-2"></i><span className='about-name-project'>FoodHub</span></h1>
                <p className="mb-4">Your premier destination for an unforgettable dining experience. At FoodHub,we believe in the art of
                  culinary excellence, where our talented chefs meticulously craft each dish using the finest, freshest ingredients.</p>
                <p className="mb-4">Our menu offers a delightful fusion of traditional and contemporary flavors, catering to diverse palates. The warm,
                  inviting ambiance of our restaurant ensures a comfortable and enjoyable setting for all occasions, whether it's a casual meal or a special celebration.
                  Join us at FoodHub and embark on a gastronomic journey that promises to tantalize your taste buds and leave you with cherished memories.</p>
                <div className="row g-4 mb-4">
                  <div className="col-sm-6">
                    <div className="d-flex align-items-center border-start border-5 border-primary px-3">
                      <h1 className="flex-shrink-0 display-5 text-primary mb-0" data-toggle="counter-up">15</h1>
                      <div className="ps-4">
                        <p className="mb-0">Years of</p>
                        <h6 className="text-uppercase mb-0">Experience</h6>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="d-flex align-items-center border-start border-5 border-primary px-3">
                      <h1 className="flex-shrink-0 display-5 text-primary mb-0" data-toggle="counter-up">50</h1>
                      <div className="ps-4">
                        <p className="mb-0">Popular</p>
                        <h6 className="text-uppercase mb-0">Master Chefs</h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* menu section */}
        <MenuList />

        {/* reservation */}
        <Reservation />

        {/* testimonial */}
        <div className="container-xxl py-5 ">
          <div className="container">
            <div className="text-center">
              <h5 className="section-title ff-secondary text-center text-primary fw-normal">Testimonial</h5>
              <h1 className="mb-5 testimonial-heading">Our Clients Say!!!</h1>
            </div>
            <div className='d-flex justify-content-center'>
              <div className=" testimonial-carousel w-50">
                <Carousel autoplay dotStyle={{ color: 'orange !important' }} activeDotStyle={{ color: 'red' }} >
                  <div className="testimonial-item bg-transparent border rounded p-4" style={{ width: '70%' }}>
                    <i className="fa fa-quote-left fa-2x text-primary mb-3"></i>
                    <p style={{ textAlign: "justify" }}>FoodHub is a hidden gem! The menu is diverse, and every dish I tried was delicious. The staff is friendly, and the ambiance
                      is perfect for a cozy evening. I highly recommend their signature pasta—it’s a must-try!</p>
                    <div className="d-flex align-items-center">
                      <img className="img-fluid flex-shrink-0 rounded-circle" src={client1} alt='' style={{ width: "50px", height: "50px" }} />
                      <div className="ps-3">
                        <h5 className="mb-1">Emily Roberts</h5>
                        <small>Food Blogger</small>
                      </div>
                    </div>
                  </div>
                  <div className="testimonial-item bg-transparent border rounded p-4" style={contentStyle}>
                    <i className="fa fa-quote-left fa-2x text-primary mb-3"></i>
                    <p style={{ textAlign: "justify" }}>I recently hosted a small event at FoodHub, and I must say, the experience was exceptional. The staff went above and beyond to accommodate our needs,
                      and the food was impeccable. FoodHub is now my go-to place for client meetings!</p>
                    <div className="d-flex align-items-center">
                      <img className="img-fluid flex-shrink-0 rounded-circle" src={client2} alt='' style={{ width: "50px", height: "50px" }} />
                      <div className="ps-3">
                        <h5 className="mb-1"> Michael Johnson</h5>
                        <small>Event Planner</small>
                      </div>
                    </div>
                  </div>
                  <div className="testimonial-item bg-transparent border rounded p-4">
                    <i className="fa fa-quote-left fa-2x text-primary mb-3"></i>
                    <p style={{ textAlign: "justify" }}>FoodHub has nailed the balance between great food and outstanding service. Whether it’s a quick lunch or a formal dinner, they always deliver an amazing experience.
                      The grilled salmon is one of the best I’ve had!</p>
                    <div className="d-flex align-items-center">
                      <img className="img-fluid flex-shrink-0 rounded-circle" alt='' src={client4} style={{ width: "50px", height: "50px" }} />
                      <div className="ps-3">
                        <h5 className="mb-1">Sarah Thompson</h5>
                        <small>Business Consultant</small>
                      </div>
                    </div>
                  </div>
                  <div className="testimonial-item bg-transparent border rounded p-4">
                    <i className="fa fa-quote-left fa-2x text-primary mb-3"></i>
                    <p style={{ textAlign: "justify" }}>I love how FoodHub caters to various dietary needs without compromising on flavor. As a nutritionist, I appreciate the healthy options on the menu, and their salads are simply fantastic. Highly recommend for health-conscious diners!</p>
                    <div className="d-flex align-items-center">
                      <img className="img-fluid flex-shrink-0 rounded-circle" src={client3} alt='' style={{ width: "50px", height: "50px" }} />
                      <div className="ps-3">
                        <h5 className="mb-1">James Peterson</h5>
                        <small>Nutritionist</small>
                      </div>
                    </div>
                  </div>
                </Carousel>

              </div>
            </div>
          </div>

        </div>
      </main >
    </>
  )
}
