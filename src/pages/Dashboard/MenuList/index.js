import React, { useState, useEffect, useCallback, } from 'react'
import { Input, Modal, Space, Table, Tag } from 'antd'
import { collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { firestore } from '../../../config/firebase';
import moment from 'moment';

const { Search } = Input;
const initialState = { title: '', price: '', ingredients: '', category: '' }
export default function MenuList() {
  const [state, setState] = useState(initialState);
  const [menuList, setMenuList] = useState([]);
  const [value, setValue] = useState("");
  const [filterList, setFilterList] = useState([]);
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState({})

  // get data from firestore
  const readData = useCallback(async () => {
    const querySnapshot = await getDocs(collection(firestore, "Menu-Items"));
    let list = [];
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      // console.log(doc.id, " => ", doc.data());
      list.push(doc.data())
    });
    setMenuList(list)
    setFilterList(list);
  }, [])

  useEffect(() => { readData() }, [readData])

  const columns = [
    { title: 'St#', dataIndex: 'num', key: 'num' },
    {
      title: "Img", dataIndex: "img", key: 'img',
      render: (url) => (
        <img src={url} alt='pic' className='rounded' style={{ height: 70, width: 70 }} />
      )
    },
    { title: 'Name', dataIndex: 'title', key: 'title', },
    {
      title: 'Category', dataIndex: 'category', key: 'category',
      render: (_, { category }) => {
        let color;

        if (category === 'pizza') {
          color = 'volcano';
        } else if (category === 'burger') {
          color = 'orange';
        } else if (category === 'apetz') {
          color = 'purple';
        } else {
          color = 'purple'; // Default color for other categories
        }

        return (
          <Tag color={color} key={category}>
            {category.toUpperCase()}
          </Tag>
        );
      }
    },
    { title: 'Price', dataIndex: 'price', key: 'price', },
    { title: 'Ingredients', dataIndex: 'ingredients', key: 'ingredients', },
    { title: 'Id', dataIndex: 'itemId', key: 'itemId', },
    { title: 'Added At', dataIndex: 'addedAt', key: 'addedAt', },
    {
      title: 'Action', key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <button className='btn btn-sm btn-outline-warning' onClick={() => handleUpdate(record)}>Update</button>
          <button className='btn btn-sm btn-outline-danger' onClick={() => handleDelete(record.itemId)} >Delete</button>
        </Space>
      ),
    },
  ];

// table data
  const data = menuList.map((u, i) => {
    return {
      key: i + 1,
      num: i + 1,
      img: u.imgUrl,
      title: u.title,
      category: u.category,
      price: u.price,
      ingredients: u.ingredients,
      itemId: u.itemId,
      addedAt: u.addAt ? moment(u.addAt.seconds * 1000).format('YYYY-MM-DD ') : 'N/A',
    }
  });

  // search data show 
  const dataFilter = filterList.map((u, i) => {
    return {
      key: i + 1,
      num: i + 1,
      img: u.imgUrl,
      title: u.title,
      category: u.category,
      price: u.price,
      ingredients: u.ingredients,
      itemId: u.itemId,
      addedAt: u.addAt ? moment(u.addAt.seconds * 1000).format('YYYY-MM-DD ') : 'N/A',
    }
  });

  // handle on shange
  const onChange = e =>  setValue(e.target.value) ;

  // handle on search data
  const onSearch = (value) => {

    if (!value.trim()) {
      setFilterList(menuList);
    } else {
      // Filter menuList based on the search value
      const filteredData = menuList.filter((item) =>
        item.title.toLowerCase().includes(value.toLowerCase())
      );
      setFilterList(filteredData);
    }
  };

  // deleta menu item
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(firestore, "Menu-Items", id));
      // Update state by removing the deleted booking
      setMenuList(menuList.filter(item => item.itemId !== id));
      window.toastify('Booking deleted successfully', 'success');
    } catch (error) {
      console.error("Error deleting Booking: ", error);
      window.toastify('Failed to delete Booking', 'error');
    }
  }


  const handleCancel = () => {
    setOpen(false);
  };

  const handleUpdate = (item) => {
    setSelectedMenu(item)
    setState(item)
    setOpen(true)
  }

  // handle state changes
  const handleChange = e => setState(s => ({ ...s, [e.target.name]: e.target.value }))

  // handle form submit ufter updation
  const handleFormSubmit = async () => {
    let { title, price, ingredients, category } = state;
    title.trim();
    price.trim();
    ingredients.trim();

    if (title === "" || price === '' || ingredients === "" || category === '') { return window.toastify("All fields are must required", 'error') }

    try {
      setConfirmLoading(true);
      // Update the document in Firestore
      const menuRef = doc(firestore, "Menu-Items", selectedMenu.itemId);
      await updateDoc(menuRef, {
        title,
        price,
        ingredients,
        category,
      });

      // Update the menu list locally
      const updatedMenuList = menuList.map(item => item.itemId === selectedMenu.itemId ? { ...item, title, price, ingredients, category } : item);
      setMenuList(updatedMenuList);

      window.toastify("Menu item updated successfully", 'success');
      setConfirmLoading(false);
      setOpen(false);
    } catch (error) {
      console.error("Error updating menu item: ", error);
      window.toastify("Failed to update menu item", 'error');
      setConfirmLoading(false);

    }
  }

  return (
    <>
      <div className='row heading m-5'>
        <h2 className='text-center'>Menu List</h2>
      </div>
      <div className="row py-4 px-5">

        <Search
          placeholder="input search text"
          value={value}
          onChange={onChange}
          onSearch={onSearch}
          enterButton
          size='large'
        />
      </div>
      <div className='table-responsive'>
        <Table columns={columns} dataSource={value.length > 0 ? dataFilter : data} />
      </div>
      <Modal
        title="Update Item"
        open={open}
        onOk={handleFormSubmit}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <form action="">
          <label htmlFor="title">Title</label>
          <input type="text" className="form-control  mb-2" name='title' value={state.title} onChange={handleChange} />
          <label htmlFor="price">Price</label>
          <input type="number" className="form-control  mb-2" name='price' value={state.price} onChange={handleChange} />
          <label htmlFor="ingredients">Ingredients</label>
          <input type="text" className='form-control  mb-2' name='ingredients' value={state.ingredients} onChange={handleChange} />
          <label htmlFor="category">Category</label>
          <select name="category" className='form-control' id="category" value={state.category} onChange={handleChange}>
            <option value="">Select</option>
            <option value="pizza">Pizza</option>
            <option value="burger">Burger</option>
            <option value="apetz">Appetizer</option>
          </select>
        </form>
      </Modal>
    </>
  )
}
