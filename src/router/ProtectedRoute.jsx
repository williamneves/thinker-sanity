import React, { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Navigate } from 'react-router-dom';
import { auth,onAuthStateChanged } from '../lib/firebase';

export const ProtectedRoute = ({ children }) => {
	const [user, loading, error] = useAuthState(auth);
	useEffect(() => {
		if (user) {
			console.log('user', user);
		} else {
			console.log('no user');
		}
  }, [ auth ] );
  
  useEffect( () => {

    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        console.log('user f', user);
        // ...
      } else {
        // User is signed out
        // ...
        console.log('no user f');
      }
    });

  }, [ auth ] );
	return children;
};
