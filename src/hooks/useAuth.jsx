import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from "../firebase/Firebase"
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth'
import { db } from '../firebase/Firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'

export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [userRole, setUserRole] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const unsubscribe =onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Usuario ha iniciado sesión
        const userDoc = await getDoc(doc(db, "users", currentUser.uid))
        if (userDoc.exists()) {
          setUserRole(userDoc.data().role)
        }
        setUser(currentUser);
      } else {
        // Usuario ha cerrado sesión
        setUser(null);
        setUserRole(null)
      }
    })

    return () => unsubscribe()
  }, [])

  const Register = async (email, password, role="user") => {
    try {
      setLoading(true)
      setError("")
      const  userCredential  = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", userCredential.user.uid), { 
        role: role,
        email: email,
        createdAt: new Date()
      });
      setUserRole(role)
      setLoading(false)
      return { success: true, user: userCredential.user }
    } catch (error) {
      setError(error.message)
      setLoading(false)
      return { success: false, error: error.message}
    }
  }

  const login = async (email, password) => {
    try {
      setLoading(true)
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid))
      setUserRole(userDoc.data().role)
      setLoading(false)
        return { success: true, user: userCredential.user }
    } catch (error) {
      setError(error.message)
      setUserRole(null)
      setLoading(false)
      return { success: false, error: error.message }
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      setUserRole(null)
    } catch (error) {
      setError(error.message)
    }
  }

  return { user, userRole, error, loading, Register, login, logout }
}