import React, { useState, useCallback, useEffect } from 'react'
import { Button, Card, Input, Modal, Table, Tag } from 'antd'
import { UserOutlined } from '@ant-design/icons';
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { useAuthContext } from '../../../contexts/AuthContext';
import { firestore, storage } from '../../../config/firebase';
import { useMenuContext } from '../../../contexts/MenuContext';
import moment from 'moment';

const initialState = { fullName: '' }
export default function Profile() {
    const [state, setState] = useState(initialState)
    const [orders, setOrders] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalSelection, setModalSelection] = useState('')
    const [loading, setLoading] = useState(false);
    const { user, handleLogout, updateProfile } = useAuthContext();
    const { menuItems } = useMenuContext();
    const [tableBookings, setTableBookings] = useState([]);

    // load data
    const loadDataOrderHistory = useCallback(async () => {
        const q = query(collection(firestore, "Order-History"), where("userId", "==", user.id));
        const ordersHistory = [];
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            // console.log(doc.id, " => ", doc.data());
            ordersHistory.push(doc.data())

        });
        setOrders(ordersHistory)
    }, [user.id])

    // load data
    const loadDataTableBookings = useCallback(async () => {
        const q = query(collection(firestore, "Table-Bookings"), where("userId", "==", user.id));
        const bookingHistory = [];
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            // console.log(doc.id, " => ", doc.data());
            bookingHistory.push(doc.data())

        });
        setTableBookings(bookingHistory)
    }, [user.id])


    useEffect(() => {
        loadDataOrderHistory();
        loadDataTableBookings();
    }, [loadDataOrderHistory, loadDataTableBookings])

    // upload profile picture and get url
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const storageRef = ref(storage, 'profile-images/' + file.name);
        const uploadTask = uploadBytesResumable(storageRef, file);

        // Register three observers:
        // 1. 'state_changed' observer, called any time the state changes
        // 2. Error observer, called on failure
        // 3. Completion observer, called on successful completion
        uploadTask.on('state_changed',
            (snapshot) => {
                // Observe state change events such as progress, pause, and resume
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
            },
            (error) => {
                // setConfirmLoading(false)
                console.error("error", error)
                window.toastify("Something went wrong while add img", 'error')
                // Handle unsuccessful uploads
            },
            async () => {
                // Handle successful uploads on complete
                // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    // console.log('File available at', downloadURL);
                    updateUserProfile(downloadURL);

                });

            }
        );
    }

    // update user profile with url
    const updateUserProfile = async (url) => {
        try {
            // Update Firestore with the new profile image URL
            const userRef = doc(firestore, "users", user.id);
            await updateDoc(userRef, { profileImgUrl: url });

            const updateProfileData = {
                profileImgUrl: url,
            }
            await updateProfile(updateProfileData)

        } catch (error) {
            console.error("error", error)
            window.toastify("Something went wrong while adding Image", 'error')
        }

    }

    // selection of modal which modal shoeld be open
    const showModal = (value) => {
        setIsModalOpen(true);

        if (value === 'booking-history') {
            setModalSelection(value)
        } else if (value === "update-profile") {
            setModalSelection(value)
        } else {
            setModalSelection(value)
        }
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };


    const handleChange = (e) => setState(s => ({ ...s, [e.target.name]: e.target.value }))

    // handle update user name
    const handleUpdate = async (e) => {
        e.preventDefault();

        let { fullName } = state
        fullName = fullName.trim()

        if (fullName === "") { return window.toastify("All fields are must required", 'error') }
        if (fullName.length < 3) { return window.toastify("Enter correct username", 'error') }

        setLoading(true)
        try {
            // Update Firestore
            const userRef = doc(firestore, "users", user.id);
            await updateDoc(userRef, { fullName });

            // Update local storage (optional if you use local storage for this purpose)

            // Update state to re-render with new data
            window.toastify("Profile updated successfully!", 'success');
            user.fullName = fullName;

            // Reset form and close modal
            setState(initialState);
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error updating profile:", error);
            window.toastify("Something went wrong while updating the profile", 'error');
        } finally {
            setLoading(false);
        }

        setState(initialState);
        // loadData();
        setIsModalOpen(false);
    }

    // data column for order history
    const columns = [
        { title: 'St#', dataIndex: 'num', key: 'num' },
        { title: 'pic Items Quantity', dataIndex: 'pic_items_quantity', key: 'pic_items_quantity', },
        { title: 'Total', dataIndex: 'total', key: 'total', },
        { title: 'Created At', dataIndex: 'createdAt', key: 'createdAt', },
        {
            title: 'Status', dataIndex: 'status', key: 'status',
            render: (_, { status }) => {
                // Determine the color based on the length of the status 
                let color = status.length < 10 ? 'yellow' : 'red';

                return (
                    <Tag color={color} key={status}>
                        {status.toUpperCase()}
                    </Tag>
                );
            }
        },
    ];

    // data on table for order history
    const data = orders.map((u, i) => {
        let totalPrice = 0;
        // Create ordered list for the items using the item name and quantity
        const itemsList = (
            <ol>
                {u.order && u.order.map((item) => {
                    const menuItem = menuItems.find((menu) => menu.itemId === item.itemId) || {};

                    // Extract `title` and `price` from the found menu item
                    const { title = "Unknown Item", price = '0', imgUrl = '' } = menuItem;

                    // Calculate the item total price
                    const itemTotal = parseFloat(price) * item.quantity || 1;
                    totalPrice += itemTotal // Update the total price


                    return (
                        <li key={item.itemId} className='mb-2'>
                            <img src={imgUrl} className='rounded-3' alt="" style={{ width: 50, height: 50 }} /> {title} (Quantity: {item.quantity})
                        </li>
                    );
                })}
            </ol>
        );

        return {
            key: i + 1,
            num: i + 1,
            pic_items_quantity: itemsList,
            total: totalPrice.toFixed(2),
            createdAt: u.createdAt ? moment(u.createdAt.seconds * 1000).format('YYYY-MM-DD h:mm:ss a') : 'N/A',
            status: u.status,
        }
    });

    // booking data columns
    const TableDataColumns = [
        { title: 'St#', dataIndex: 'num', key: 'num' },
        { title: 'Name', dataIndex: 'fullName', key: 'fullName', },
        { title: 'Persons', dataIndex: 'person', key: 'person', },
        { title: 'Reserved Time', dataIndex: 'reservedTime', key: 'reservedTime', },
        { title: 'Special Request', dataIndex: 'request', key: 'request', },
        {
            title: 'Status', dataIndex: 'status', key: 'status',
            render: (_, { status }) => {
                // Determine the color based on the length of the status 
                let color = status.length < 7 ? 'geekblue' : 'green';

                return (
                    <Tag color={color} key={status}>
                        {status.toUpperCase()}
                    </Tag>
                );
            }
        },
    ];

    // data of bookings in table
    const TableData = tableBookings.map((u, i) => {
        return {
            key: i + 1,
            num: i + 1,
            fullName: u.fullName,
            person: u.noOfPeople,
            reservedTime: u.reservedTime ? moment(u.reservedTime).format('YYYY-MM-DD h:mm:ss a') : 'N/A',
            request: u.request,
            status: u.status,
        }
    });

    return (
        <>
            {/* <HeaderOther title='Profile' /> */}
            <main className='pt-5'>
                <div className="container-xxxl bg-white p-0">
                    <div className="container-xxl py-5">
                        <div className="container">
                            <div className="text-center">
                                <h5 className="section-title ff-secondary text-center text-primary fw-normal">User Profile</h5>
                                <h1 className="mb-5" style={{ fontFamily: 'Lato' }}>Your Profile</h1>
                            </div>
                            <div className="profile-header">
                                <div className='profile-img-container'>
                                    {user.profileImgUrl ? (
                                        <img src={user.profileImgUrl} alt="Profile" className="profile-picture" />
                                    ) : (
                                        <i className="fa fs-4 fa-user text-secondary profile-picture-icon"></i>
                                    )}

                                    <label htmlFor="fileInput" className="edit-icon">
                                        <i className="fa fa-camera text-secondary"></i>
                                    </label>

                                    <input type="file" id="fileInput" className="file-input" accept="image/*" name="profileImg" onChange={handleImageUpload} />
                                </div>
                                <div className='ms-4 pt-4'>
                                    <h1 className="username">{user.fullName}</h1>
                                    <p className="bio">Passionate about good food and great experiences.</p>
                                </div>
                            </div>
                            <div className='text-center'>
                                <button className='btn btn-outline-primary px-4 py-2 m-3 rounded-5 profile-btn' onClick={() => showModal('order-history')}>Order History</button>
                                <button className='btn btn-outline-primary px-4 py-2 m-3 rounded-5 profile-btn' onClick={() => showModal('booking-history')}>Booking History</button>
                                <button className='btn btn-outline-primary px-4 py-2 m-3 rounded-5 profile-btn' onClick={() => showModal('update-profile')}>Update Profile</button>
                                <button className='btn btn-outline-primary px-4 py-2 m-3 rounded-5 profile-btn' onClick={() => handleLogout()}>Logout</button>
                            </div>

                            <Modal title="" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} width={modalSelection === 'order-history' || modalSelection === 'booking-history' ? 1000 : undefined}>
                                {modalSelection === 'booking-history' &&
                                    <>
                                        <div className='row heading m-5'>
                                            <h2 className='text-center'>Booking History</h2>
                                        </div>
                                        <div className='table-responsive'>
                                            <Table columns={TableDataColumns} dataSource={TableData} />
                                        </div>
                                    </>
                                }
                                {modalSelection === 'order-history' &&
                                    <>
                                        <div className='row heading m-5'>
                                            <h2 className='text-center'>Orders History</h2>
                                        </div>
                                        <div className='table-responsive'>
                                            <Table columns={columns} dataSource={data} />
                                        </div>
                                    </>
                                }
                                {modalSelection === 'update-profile' &&
                                    <Card style={{
                                        width: 440,
                                        border: 'none',
                                        transition: 'box-shadow 0.3s ease-in-out',
                                        background: 'transparent'
                                    }}>
                                        <form action="">
                                            <div className="row mb-3">
                                                <div className="col">
                                                    <h1 className='text-center fs-1 fw-semibold' style={{ fontFamily: "Lato" }}>Update Profile</h1>
                                                </div>
                                            </div>
                                            <div className="row mb-3">
                                                <div className="col">
                                                    <Input type='text' size="large" placeholder="Full Name" prefix={<UserOutlined />} name='fullName' value={state.fullName} onChange={handleChange} />
                                                </div>
                                            </div>
                                            <div className="row px-3">
                                                <Button className='btn btn-primary fw-semibold pb-3 update-btn' loading={loading} onClick={handleUpdate}>Update</Button>
                                            </div>

                                        </form>
                                    </Card>}
                            </Modal>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}
