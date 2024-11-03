import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderOther from '../../../components/Header/HeaderOther';
import { useAuthContext } from '../../../contexts/AuthContext';
import { useMenuContext } from '../../../contexts/MenuContext';

export default function Menu() {
    const { isAuthenticated, user } = useAuthContext();
    const { menuItems } = useMenuContext();
    const [activeTab, setActiveTab] = useState('tab-1')
    const [orders, setOrders] = useState([])
    const [data, setData] = useState([])
    const navigate = useNavigate();

    const loadData = useCallback((activeTab) => {
        let storedOrders = JSON.parse(localStorage.getItem('Orders')) || []
        setOrders(storedOrders)

        let menuList = menuItems || [];
        let filteredData = [];

        if (activeTab === 'tab-1') {
            filteredData = menuList.filter(item => item.category === 'pizza');
        } else if (activeTab === 'tab-2') {
            filteredData = menuList.filter(item => item.category === 'burger');
        } else if (activeTab === 'tab-3') {
            filteredData = menuList.filter(item => item.category === 'apetz');
        }

        setData(filteredData);
    }, [menuItems]); //// Add menuItems as a dependency

    useEffect(() => {
        loadData(activeTab);
    }, [activeTab, loadData]);

    // place order in the cart 
    const handleOrder = (id) => {

        if (!isAuthenticated) { window.toastify("Please Login", 'error'); return navigate('/auth/login') }

        //get current user.
        let userId = user.id

        let verifyOrder = orders.find(odr => odr.itemId === id && odr.userId === userId)
        if (verifyOrder) { return window.toastify("Already in Cart", "info") }

        const order = {
            itemId: id,
            userId
        }
        const updatedOrders = [...orders, order];
        setOrders(updatedOrders);
        localStorage.setItem('Orders', JSON.stringify(updatedOrders));
        window.toastify("Order Add Successfully!", 'success');
    }

    return (
        <>
            <HeaderOther title='Menu' />
            <div className="container-xxl py-5">
                <div className="container">
                    <div className="text-center ">
                        <h5 className="section-title ff-secondary text-center text-primary fw-normal">Food Menu</h5>
                        <h1 className="mb-5 menu-heading">Most Popular Items</h1>
                    </div>
                    <div className="tab-class text-center">
                        <ul className="nav nav-pills d-inline-flex justify-content-center border-bottom mb-5">
                            <li className="nav-item my-3 mx-4">
                                <a className={`d-flex align-items-center text-start mx-3 ms-0 pb-3 nav-menu ${activeTab === 'tab-1' ? 'active' : ''}`}
                                    data-bs-toggle="pill" href="#tab-1" onClick={() => setActiveTab('tab-1')}>
                                    <i className="fa fa-pizza-slice fa-2x text-primary"></i>
                                    <div className="ps-3">
                                        <small className="text-body">Popular</small>
                                        <h6 className="mt-n1 mb-0 fs-5">Pizzas</h6>
                                    </div>
                                </a>
                            </li>
                            <li className="nav-item my-3 mx-4">
                                <a className={`d-flex align-items-center text-start mx-3 ms-0 pb-3 nav-menu ${activeTab === 'tab-2' ? 'active' : ''}`}
                                    data-bs-toggle="pill" href="#tab-2" onClick={() => setActiveTab('tab-2')}>
                                    <i className="fa fa-hamburger fa-2x text-primary"></i>
                                    <div className="ps-3">
                                        <small className="text-body">Special</small>
                                        <h6 className="mt-n1 mb-0 fs-5">Burgers</h6>
                                    </div>
                                </a>
                            </li>
                            <li className="nav-item my-3 mx-4">
                                <a className={`d-flex align-items-center text-start mx-3 ms-0 pb-3 nav-menu ${activeTab === 'tab-3' ? 'active' : ''}`}
                                    data-bs-toggle="pill" href="#tab-3" onClick={() => setActiveTab('tab-3')}>
                                    <i className="fa fa-cheese fa-2x text-primary"></i>
                                    <div className="ps-3">
                                        <small className="text-body">Lovely</small>
                                        <h6 className="mt-n1 mb-0 fs-5">Appetizers</h6>
                                    </div>
                                </a>
                            </li>
                        </ul>
                        <div className="tab-content">
                            <div id="tab-1" className={`tab-pane fade ${activeTab === 'tab-1' ? 'show active' : ''} p-0`}>
                                <div className='row d-flex flex-wrap align-items-center justify-content-center'>
                                    {data.map((item, index) => (
                                        <div className='col-lg-3 col-md-4 col-sm-6'>
                                            <div key={index} className="card rounded-5 mb-3">
                                                <img src={item.imgUrl} className="card-img-top rounded-top-5" alt="..." style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                                <div className="card-body">
                                                    <div className='d-flex justify-content-between'>
                                                        <h5 className="card-title">{item.title}</h5>
                                                        <h5 className="card-title">${item.price}</h5>
                                                    </div>
                                                    <p className="card-text" style={{ height: 48, overflow: "hidden", textOverflow: "ellipsis" }}>{item.ingredients}</p>
                                                    <div className='row px-2'>
                                                        <button className='btn btn-primary p-1 rounded-4 add-btn' onClick={() => { handleOrder(item.itemId) }}>Add</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div id="tab-2" className={`tab-pane fade ${activeTab === 'tab-2' ? 'show active' : ''} p-0`}>
                                <div className='row d-flex flex-wrap align-items-center justify-content-center'>
                                    {data.map((item, index) => (
                                        <div className='col-lg-3 col-md-4 col-sm-6'>
                                            <div key={index} className="card rounded-5 mb-3">
                                                <img src={item.imgUrl} className="card-img-top rounded-top-5" alt="..." style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                                <div className="card-body">
                                                    <div className='d-flex justify-content-between'>
                                                        <h5 className="card-title">{item.title}</h5>
                                                        <h5 className="card-title">${item.price}</h5>
                                                    </div>
                                                    <p className="card-text" style={{ height: 48, overflow: "hidden", textOverflow: "ellipsis" }}>{item.ingredients}</p>
                                                    <div className='row px-2'>
                                                        <button className='btn btn-primary p-1 rounded-4 add-btn' onClick={() => { handleOrder(item.itemId) }}>Add</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div id="tab-3" className={`tab-pane fade ${activeTab === 'tab-3' ? 'show active' : ''} p-0`}>
                                <div className='row d-flex flex-wrap align-items-center justify-content-center'>
                                    {data.map((item, index) => (
                                        <div className='col-lg-3 col-md-4 col-sm-6'>
                                            <div key={index} className="card rounded-5 mb-3">
                                                <img src={item.imgUrl} className="card-img-top rounded-top-5" alt="..." style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                                <div className="card-body">
                                                    <div className='d-flex justify-content-between'>
                                                        <h5 className="card-title">{item.title}</h5>
                                                        <h5 className="card-title">${item.price}</h5>
                                                    </div>
                                                    <p className="card-text" style={{ height: 48, overflow: "hidden", textOverflow: "ellipsis" }}>{item.ingredients}</p>
                                                    <div className='row px-2'>
                                                        <button className='btn btn-primary p-1 rounded-4 add-btn' onClick={() => { handleOrder(item.itemId) }}>Add</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
