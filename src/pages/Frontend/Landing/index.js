import React from 'react';
import pastaImg from './../../../assets/pic/paste1.png'
import { useNavigate } from 'react-router-dom';

export default function Landing() {
    const navigate = useNavigate();
    const handleProductBtn = () => {
        navigate('/home');
    }

    return (
        <main className='landing'>
            <svg viewBox="0 0 500 150" preserveAspectRatio="none" className='wave-big-screen'><path d="M318.00,-2.44 C443.85,65.63 327.03,116.95 328.15,152.47 L500.00,150.00 L501.41,-5.41 Z" style={{ stroke: 'none', fill: '#fb5e2f' }} ></path></svg>
            <svg viewBox="0 0 500 150" preserveAspectRatio="none" className='wave-small-screen'><path d="M-2.54,149.52 C66.87,139.64 192.71,-32.05 500.84,147.55 L500.00,0.00 L0.00,0.00 Z" style={{ stroke: 'none', fill: '#fb5e2f' }}></path></svg>
            <div className="image-wrapper">
                <img src={pastaImg} alt="Pasta" className="pasta-img" />
            </div>
            <div className="row">
                <div className="col">
                    <h1 className='main-heading'><i className="fa fa-utensils text-primary me-3"></i>FoodHub</h1>
                    <p className='main-sub-heading mt-1 fs-4'>Hot, Spice, Sweet</p>
                    <p className='main-description mt-1'>Welcome to our exquisite restaurant, where culinary artistry meets a warm and inviting ambiance.
                        Discover a menu curated by top chefs, featuring delightful dishes crafted from the finest ingredients.
                        Join us for an unforgettable dining experience that tantalizes your taste buds and nourishes your soul.</p>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <button type="button" className='btn btn-primary btn-products rounded-5 fs-6 px-4 py-2' onClick={handleProductBtn}><span>Explore Now</span></button>
                </div>
            </div>
        </main>
    )
}
