import React, { useState, useEffect, useCallback, useContext, createContext, useReducer } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, firestore } from '../config/firebase';
import { Navigate } from 'react-router-dom';

const Auth = createContext();
const initialState = { isAuthenticated: false, user: {} }

const reducer = (state, { type, payload }) => {
    switch (type) {
        case 'SET_LOGGED_IN':
            return { isAuthenticated: true, user: payload.user }
        case 'SET_PROFILE':
            return { ...state, user: payload.user }
        case 'SET_LOGGED_OUT':
            return initialState;
        default:
            return state
    }
}
export default function AuthContext({ children }) {
    const [state, dispatch] = useReducer(reducer, initialState)
    const [isAppLoading, setIsAppLoading] = useState(true)

    const readProfile = useCallback(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const docSnap = await getDoc(doc(firestore, "users", user.uid));
                if (docSnap.exists()) {
                    const currentUser = docSnap.data();
                    dispatch({ type: 'SET_LOGGED_IN', payload: { user: currentUser } });
                    // console.log("Document data:", currentUser);
                }
                setIsAppLoading(false)
            } else {
                dispatch({ type: 'SET_LOGGED_OUT' })
            }
            setIsAppLoading(false)
        });
    }, [])

    useEffect(() => { readProfile() }, [readProfile])

    const handleLogout = async() => {
        try {
            await signOut(auth); // Sign out from Firebase authentication
            dispatch({ type: 'SET_LOGGED_OUT' });
            <Navigate to='/' />
          } catch (error) {
            console.error('Logout failed:', error);
          }
    }
    // console.log(state)

    const updateProfile = useCallback(
        async (newProfileData) => {
            try {
                const user = auth.currentUser;
                if (!user) throw new Error("No user is currently signed in.");

                const userDocRef = doc(firestore, "users", user.uid);
                await updateDoc(userDocRef, newProfileData);

                dispatch({ type: 'SET_PROFILE', payload: { user: { ...state.user, ...newProfileData } } });
            } catch (error) {
                console.error("Profile update failed:", error);
            }
        },
        [dispatch, state.user]
    );

    return (
        <Auth.Provider value={{ ...state, dispatch, isAppLoading, setIsAppLoading, handleLogout, updateProfile }}>
            {children}
        </Auth.Provider>
    )
}

export const useAuthContext = () => useContext(Auth)
