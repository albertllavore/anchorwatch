import React, { useState, useEffect } from 'react';
import { auth, db } from './firebaseConfig';
import {
  onAuthStateChanged,
  signOut,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import Login from './components/Login';
import { Dashboard } from './components/Dashboard';
import './App.css';

const App = () => {
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const userFavoritesRef = collection(
          db,
          'favorites',
          user.uid,
          'transactions'
        );
        const favSnapshot = await getDocs(userFavoritesRef);

        const favs = favSnapshot.docs.map((doc) => doc.data().txid);

        setFavorites(favs);
      } else {
        setFavorites([]);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    console.log('handle email link');
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let email = window.localStorage.getItem('emailForSignIn');
      if (!email) {
        email = window.prompt('Please provide your email for confirmation');
      }
      signInWithEmailLink(auth, email, window.location.href)
        .then((result) => {
          window.localStorage.removeItem('emailForSignIn');
          setUser(result.user);
        })
        .catch((error) => {
          console.error('Error signing in with email link', error);
        });
    }
  }, []);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
      })
      .catch((error) => {
        console.error('Sign out error', error);
      });
  };

  return (
    <div>
      {!user ? (
        <Login />
      ) : (
        <div>
          <header>
            <h1 className="title">DASHBOARD</h1>
            <div className="right-section">
              <h1>Hi, {user.displayName}</h1>
              <button onClick={handleSignOut}>Sign Out</button>
            </div>
          </header>
          <Dashboard
            user={user}
            favorites={favorites}
            setFavorites={setFavorites}
          />
        </div>
      )}
    </div>
  );
};

export default App;
