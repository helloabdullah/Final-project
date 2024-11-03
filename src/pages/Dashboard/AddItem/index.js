import React, {useState ,useRef  } from 'react'
import { Button } from 'antd';
import { collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { firestore, storage } from '../../../config/firebase';

const initialState = { title: '', price: '', ingredients: '', category: '' }
export default function AddItem() {
  const [state, setState] = useState(initialState);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef(null);

// handle state changes
  const handleChange = e => setState(s => ({ ...s, [e.target.name]: e.target.value }))

  // handle new item
  const handleNewItem = (e) => {
    e.preventDefault();
    let { title, price, ingredients, category } = state;
    title = title.trim()
    ingredients = ingredients.trim()

    if (title === "" || price === '' || ingredients === "" || category === '') { return window.toastify("All fields are must required", 'error') }
    if (!file) { return window.toastify("Upload the Image", 'error') }
    let newItem = {
      title,
      price,
      ingredients,
      category,
      addAt: serverTimestamp(),
    }
    uploadFile(newItem)
  }

  // upload file in storage
  const uploadFile = async (document) => {
    setLoading(true)
    const storageRef = ref(storage, 'images/' + file.name);
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
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          // console.log('File available at', downloadURL);
          const dataDoc = { ...document, imgUrl: downloadURL }
          createDocument(dataDoc)
        });
      }
    );
  }

  // create document
  const createDocument = async (data) => {
    try {
      // Create a new document reference with an auto-generated ID
      const newDocRef = doc(collection(firestore, "Menu-Items"));

      // Get the generated document ID
      const documentId = newDocRef.id;

      // Set the document data with the document ID included
      await setDoc(newDocRef, {
        ...data,
        itemId: documentId,  // Include the ID in the document data
      });

      window.toastify("Item Added Successfully", "success")
      // console.log("Document written with ID: ", documentId);
      setState(initialState);
      setFile(null)
      if (fileInputRef.current) { fileInputRef.current.value = '' }

    } catch (error) {
      console.error("Error adding document: ", error);
      window.toastify("Something went wrong while add item", 'error')

    }

    setLoading(false)

  }

  return (
    <>
      <div className='container py-4 px-5'>
        <h2 className='text-center m-4'>Add New Item</h2>
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
          <label htmlFor="destinationImg">Image</label>
          <input type="file" className="form-control " id="destinationImg" name='photo' onChange={(e) => setFile(e.target.files[0])} ref={fileInputRef} />
          <div className="row mt-4 px-5 d-flex justify-content-center">
            <Button className='btn btn-primary pb-2' loading={loading} style={{ maxWidth: 400 }} onClick={handleNewItem}>Add</Button>
          </div>
        </form>
      </div>
    </>
  )
}
