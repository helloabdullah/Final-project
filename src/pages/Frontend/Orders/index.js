import React, { useCallback, useEffect, useState } from 'react';
import { collection, doc, getDocs, orderBy, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import HeaderOther from './../../../components/Header/HeaderOther'
import { Button, Card, InputNumber } from 'antd';
import { useAuthContext } from '../../../contexts/AuthContext';
import { useMenuContext } from '../../../contexts/MenuContext';
import { firestore } from '../../../config/firebase';

export default function Orders() {
  const { user } = useAuthContext();
  const { menuItems } = useMenuContext();
  const [quantity, setQuantity] = useState({});
  const [data, setData] = useState([]);
  const [confirmedOrderList, setConfirmedOrderList] = useState([])
  const [confirmOrderShow, setconfirmOrderShow] = useState([])
  const [orderBills, setOrderBills] = useState(0)
  const [loading, setLoading] = useState(false)

  // load confirmed order.
  const loadConfirmedOrder = useCallback(async () => {
    if (!user?.id) return; // Make sure user.id is available

    // Query to get user's orders and sort them by createdAt in descending order (most recent first)
    const q = query(
      collection(firestore, "Orders"),
      where("userId", "==", user.id),
      orderBy("createdAt", "desc") // Sorting by createdAt in descending order
    );

    const querySnapshot = await getDocs(q);
    let list = [];
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      // console.log(doc.id, " => ", doc.data());
      list.push(doc.data())
    });
    setConfirmedOrderList(list)
  }, [user.id])

  const populatingData = useCallback(
    (orderData) => {
      let populatedOrders = orderData.map((order, i) => {
        const menuItem = menuItems.find(item => item.itemId === order.itemId);
        return menuItem ? { ...menuItem } : order; // Add menu item details to the order object
      });
      return populatedOrders;
    },
    [menuItems]
  );

  // load data from cart
  const loadData = useCallback(() => {
    if (!user?.id) return; // Make sure user.id is available
    let orderList = JSON.parse(localStorage.getItem('Orders')) || [];
    let filteredData = orderList.filter(order => order.userId === user.id)

    setData(populatingData(filteredData))
  }, [user.id, populatingData]);

  useEffect(() => {
    loadData();
    loadConfirmedOrder();
  }, [loadData, loadConfirmedOrder]);

  // handle state change
  const handleChange = (id, value) => setQuantity(q => ({ ...q, [id]: value }))

  // populating data with menuitems
  // const populatingData = (orderData) => {
  //   let populatedOrders = orderData.map(order => {
  //     // Find the menu item using the itemId from the order
  //     const menuItem = menuItems.find(item => item.itemId === order.itemId);
  //     return menuItem ? { ...menuItem } : order; // Add menu item details to the order object
  //   });
  //   return populatedOrders
  // }

  // Populating data with menu items


  // handle remove order from cart
  const handleRemove = (id) => {
    let orderList = JSON.parse(localStorage.getItem('Orders')) || [];

    const updatedOrder = orderList.filter(item => item.itemId !== id)
    localStorage.setItem("Orders", JSON.stringify(updatedOrder))

    loadData()
  }


  //handle confirm order 
  const handleConfirmOrder = () => {
    let confirmOrders = data.map((order, i) => ({
      itemId: order.itemId,
      quantity: quantity[order.itemId] || 1,
    }))

    createDocument(confirmOrders);

    let remainingOrders = data.filter(order => order.userId !== user.id);
    localStorage.setItem('Orders', JSON.stringify(remainingOrders));

    setData([]);
    setQuantity({});
    loadData();

  }

  // create document in firebase
  const createDocument = async (data) => {
    setLoading(true)
    try {
      // Create a new document reference with an auto-generated ID
      const newDocRef = doc(collection(firestore, "Orders"));

      // Get the generated document ID
      const documentId = newDocRef.id;

      // Set the document data with the document ID included
      await setDoc(newDocRef, {
        order: [...data],
        orderId: documentId,
        userId: user.id,
        createdAt: serverTimestamp(),
        status: 'active',
      });

      window.toastify("Item Added Successfully", "success")

      // Directly update the `confirmedOrderList` state with the new order
      setConfirmedOrderList((prev) => [
        ...prev,
        {
          order: [...data],
          orderId: documentId,
          userId: user.id,
          createdAt: new Date().toLocaleString(), // Use the current timestamp for local state
        },
      ]);

    } catch (error) {
      console.error("Error adding document: ", error);
      window.toastify("Something went wrong while add Order", 'error')
    }
    setLoading(false)
  }

  // // Use useEffect to avoid infinite re-renders
  // useEffect(() => {
  //   confirmOrderPopulating();
  // }, [confirmOrderPopulating]);

  // confirmed order populating data
  // const confirmOrderPopulating = () => {
  //   let orderCards = confirmedOrderList.map(({ order }) => {
  //     if (Array.isArray(order)) {
  //       let items = order.map((itm) => {
  //         const menuItem = menuItems.find(item => item.itemId === itm.itemId);
  //         return menuItem ? { ...menuItem, quantity: itm.quantity || 1 } : itm;
  //       });
  //       return items; // Return array of menu items
  //     }
  //     return [];
  //   });

  //   setconfirmOrderShow(orderCards);
  //   calculateOrderBills(orderCards);
  // }
  // Move confirmOrderPopulating inside useCallback to prevent the warning
  const confirmOrderPopulating = useCallback(() => {
    let orderCards = confirmedOrderList.map(({ order }, i) => {
      if (Array.isArray(order)) {
        let items = order.map((itm, i) => {
          const menuItem = menuItems.find(item => item.itemId === itm.itemId);
          return menuItem ? { ...menuItem, quantity: itm.quantity || 1 } : itm;
        });
        return items; // Return array of menu items
      }
      return [];
    });

    setconfirmOrderShow(orderCards);
    calculateOrderBills(orderCards);
  }, [confirmedOrderList, menuItems]);

  // Use useEffect to avoid infinite re-renders
  useEffect(() => {
    confirmOrderPopulating();
  }, [confirmOrderPopulating]);

  // calculating bills
  const calculateOrderBills = (orders) => {
    const bills = orders.map((orderBatch, i) => {
      return orderBatch.reduce((acc, order) => {
        return acc + parseFloat(order.price) * (order.quantity || 1);
      }, 0).toFixed(2); // Calculate and format each order bill
    });
    setOrderBills(bills);
  };

  return (
    <>
      <HeaderOther title='Orders' />
      <main>
        <div className="container-xxxl bg-white p-0">
          <div className="container-xxl py-5">
            <div className="container">
              <div className="text-center ">
                <h5 className="section-title ff-secondary text-center text-primary fw-normal">Placed Orders</h5>
                <h1 className="mb-5 order-heading">Your Orders</h1>
                {data.length > 0 ?
                  <div>
                    {data.map((order, i) => (
                      <Card key={i} hoverable className='mb-3' >
                        <div className='d-flex flex-row flex-wrap align-items-center justify-content-between'>
                          <div className="col-lg-6 col-md-6 mb-2">
                            <div className="d-flex align-items-center">
                              <img className="flex-shrink-0 img-fluid rounded" src={order.imgUrl} alt="" style={{ width: '80px' }} />
                              <div className="w-100 d-flex flex-column text-start ps-4">
                                <h5 className="d-flex justify-content-between border-bottom pb-2">
                                  <span>{order.title}</span>
                                  <span className="text-primary">${order.price}</span>
                                </h5>
                                <small className=" d-flex justify-content-between">
                                  <span className='fst-italic'>{order.ingredients}</span>
                                </small>

                              </div>
                            </div>
                          </div>
                          <div className='col-lg-2 col-md-3 d-flex align-items-center'>
                            <InputNumber size="large" min={1} max={100} defaultValue={quantity[order.itemid] || 1} onChange={value => handleChange(order.itemId, value)} className='custom-input-field-antd' />
                            <button type='button' className='btn btn-primary ms-3' onClick={() => handleRemove(order.itemId)}>Remove</button>
                          </div>
                        </div>
                      </Card>
                    ))}
                    <div className='my-5'>
                      <Button className='btn btn-primary confirm-order' size='large' loading={loading} onClick={handleConfirmOrder}>Confirm Order</Button>
                    </div>
                  </div> :
                  <div></div>
                }

                {/* Render Confirmed Orders Section */}
                <div className='row d-flex justify-content-round'>
                  {confirmOrderShow.length > 0 &&
                    confirmOrderShow.map((orderBatch, idx) => (
                      <div className="col-lg-4 col-md-6 col-sm-12 p-2" >
                        <Card hoverable className="" key={idx}>
                          <h5 className="mb-5">Order Confirmed #{idx + 1}</h5>
                          {orderBatch.map((order, z) => (
                            <div key={z} className="mb-3">
                              <div className="d-flex align-items-center justify-content-between">
                                <img className="img-fluid rounded" src={order.imgUrl} alt="" style={{ width: '70px' }} />
                                <div className="w-100 d-flex flex-column text-start ps-4">
                                  <h5 className="d-flex justify-content-between border-bottom pb-2">
                                    <span>{order.title}</span>
                                    <span className="text-primary">${order.price}</span>
                                  </h5>
                                  <small>
                                    <span>Quantity:{order.quantity || 1}</span>
                                  </small>
                                </div>
                              </div>
                            </div>
                          ))}

                          {/* Display Bill for the Current Order Card */}
                          <p className="text-end fs-6">
                            Order Bill: <span className="text-primary fs-5 fw-semibold">${orderBills[idx]}</span>
                          </p>
                        </Card>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
