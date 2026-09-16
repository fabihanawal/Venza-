import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut as fbSignOut 
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc 
} from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase';
import { UserProfile } from '../types';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  isAdmin: boolean;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const ADMIN_EMAIL = 'rstsbd@gmail.com';

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  isAdmin: false,
  loading: true,
  signInWithGoogle: async () => {},
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const isAdmin = Boolean(
    user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase() || 
    userProfile?.role === 'admin'
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);

          const isUserAdmin = currentUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

          if (userDocSnap.exists()) {
            const data = userDocSnap.data() as UserProfile;
            // Ensure admin role is reflected if matching the designated admin email
            if (isUserAdmin && data.role !== 'admin') {
              await setDoc(userDocRef, { role: 'admin' }, { merge: true });
              setUserProfile({ ...data, role: 'admin' });
            } else {
              setUserProfile(data);
            }
          } else {
            // New user registration
            const newProfile: UserProfile = {
              uid: currentUser.uid,
              name: currentUser.displayName || 'সম্মানিত গ্রাহক',
              email: currentUser.email || '',
              phone: currentUser.phoneNumber || '',
              role: isUserAdmin ? 'admin' : 'customer',
              createdAt: Date.now(),
              addresses: []
            };
            await setDoc(userDocRef, newProfile);
            setUserProfile(newProfile);
          }
        } catch (error) {
          console.warn('Error fetching or creating user profile in Firestore:', error);
          // Fallback in-memory profile
          setUserProfile({
            uid: currentUser.uid,
            name: currentUser.displayName || 'সম্মানিত গ্রাহক',
            email: currentUser.email || '',
            role: currentUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? 'admin' : 'customer',
          });
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      console.error('Google Sign In Error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await fbSignOut(auth);
      setUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error('Sign Out Error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, userProfile, isAdmin, loading, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
