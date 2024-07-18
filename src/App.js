import React, { useState, useEffect } from 'react';
import { auth, db } from './firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';
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
