import React, { useState, useEffect, useContext, createContext, } from 'react';
import { getDocs, collection } from 'firebase/firestore';
import { firestore } from '../config/firebase';

const Menu = createContext();

export default function MenuContext({ children }) {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch menu items from Firestore
  const fetchMenuItems = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, "Menu-Items"));
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push({ ...doc.data() });
      });
      setMenuItems(items);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching menu items: ", error);
    }
  };


  useEffect(() => {
    fetchMenuItems();
  }, []);

  return (
    <Menu.Provider value={{ menuItems, loading }}>
      {children}
    </Menu.Provider>
  );
}


export const useMenuContext = () => useContext(Menu)
