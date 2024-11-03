import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMenuContext } from '../../contexts/MenuContext';
import { useAuthContext } from '../../contexts/AuthContext';

export default function MenuList() {
    const { isAuthenticated, user } = useAuthContext();
    const { menuItems } = useMenuContext();
    const [activeTab, setActiveTab] = useState('tab-1')
    const [orders, setOrders] = useState([])
    const [data, setData] = useState([])
    const navigate = useNavigate();

    // load data from local storage 
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

        setData(filteredData)
    }, [menuItems]);

    useEffect(() => {
        loadData(activeTab);
    }, [activeTab, loadData]);

    // add order into cart
    const handleOrder = (id) => {

        if (!isAuthenticated) { window.toastify("Please Login", "warning"); return navigate('/auth/login') }

        //get current user.
        let userId = user.id

        const order = {
            userId,
            itemId: id,
        }
        const updatedOrders = [...orders, order];
        setOrders(updatedOrders);
        localStorage.setItem('Orders', JSON.stringify(updatedOrders));

        window.toastify("Order Add Successfully!", "success");
    }

    return (
        <>
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
                                        <small className="text-body">Famous</small>
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
                                <div className="row g-4">
                                    {data.map((item, index) => (
                                        <div key={index} className="col-lg-6 mb-2">
                                            <div className="d-flex align-items-center">
                                                <img className="flex-shrink-0 img-fluid rounded" src={item.imgUrl} alt="" style={{ width: '80px' }} />
                                                <div className="w-100 d-flex flex-column text-start ps-4">
                                                    <h5 className="d-flex justify-content-between border-bottom pb-2">
                                                        <span>{item.title}</span>
                                                        <span className="text" >${item.price}</span>
                                                    </h5>
                                                    <small className=" d-flex justify-content-between">
                                                        <span className='fst-italic'>{item.ingredients}</span>
                                                        <button className='btn btn-primary p-1 px-3 rounded-4 add-btn' onClick={() => { handleOrder(item.itemId) }}>Add</button>
                                                    </small>

                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                </div>
                            </div>
                            <div id="tab-2" className={`tab-pane fade ${activeTab === 'tab-2' ? 'show active' : ''} p-0`}>
                                <div className="row g-4">
                                    {data.map((item, index) => (
                                        <div key={index} className="col-lg-6 mb-2">
                                            <div className="d-flex align-items-center">
                                                <img className="flex-shrink-0 img-fluid rounded" src={item.imgUrl} alt="" style={{ width: '80px' }} />
                                                <div className="w-100 d-flex flex-column text-start ps-4">
                                                    <h5 className="d-flex justify-content-between border-bottom pb-2">
                                                        <span>{item.title}</span>
                                                        <span className="text-primary">${item.price}</span>
                                                    </h5>
                                                    <small className=" d-flex justify-content-between">
                                                        <span className='fst-italic'>{item.ingredients}</span>
                                                        <span className='btn btn-primary p-1 px-3 rounded-4 add-btn' onClick={() => { handleOrder(item.itemId) }}>Add</span>
                                                    </small>

                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                </div>
                            </div>
                            <div id="tab-3" className={`tab-pane fade ${activeTab === 'tab-3' ? 'show active' : ''} p-0`}>
                                <div className="row g-4">
                                    {data.map((item, index) => (
                                        <div key={index} className="col-lg-6 mb-2">
                                            <div className="d-flex align-items-center">
                                                <img className="flex-shrink-0 img-fluid rounded" src={item.imgUrl} alt="" style={{ width: '80px' }} />
                                                <div className="w-100 d-flex flex-column text-start ps-4">
                                                    <h5 className="d-flex justify-content-between border-bottom pb-2">
                                                        <span>{item.title}</span>
                                                        <span className="text-primary">${item.price}</span>
                                                    </h5>
                                                    <small className=" d-flex justify-content-between align-items-center">
                                                        <span className='fst-italic'>{item.ingredients}</span>
                                                        <span className='btn btn-primary p-1 px-3 rounded-4  btn-constant-height' onClick={() => { handleOrder(item.itemId) }}>Add</span>
                                                    </small>

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