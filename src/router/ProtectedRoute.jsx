import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Navigate, useNavigate } from 'react-router-dom';
import { auth, onAuthStateChanged } from '../lib/firebase';
import { userDBAtom } from '../atoms/userAtom';
import { useRecoilState } from 'recoil';
import sanityClient from '../../client';
import { LoadingIcon } from '@/base-components';

export const ProtectedRoute = ({ children }) => {
	const [user, loading, error] = useAuthState(auth);
	const [userDB, setUserDB] = useRecoilState(userDBAtom);

	const navigate = useNavigate();
	useEffect(() => {
		if (user) {
			// set user to local storage and global state
			setUserParams(user.uid);
			console.log('user', user);
		}

		if (!user && !loading) {
			// remove user from local storage and global state
			localStorage.removeItem('userProfile');
			setUserDB(null);
			console.log('no user effect');
		}
	}, [auth]);

	onAuthStateChanged(auth, (user) => {
		if (user) {
			// User is signed in, see docs for a list of available properties
			// https://firebase.google.com/docs/reference/js/firebase.User
			const uid = user.uid;
			console.log('user', user);
			// ...
		} else {
			// User is signed out
			// ...
			// localStorage.removeItem('userProfile');
			console.log('no user');
		}
	});

	const setUserParams = async (uid) => {
		// check if user is in local storage
		if (localStorage.getItem('userProfile')) {
			// Check if userDB is empty
			if (userDB !== null) {
				setUserDB(localStorage.getItem('userProfile'));
			}
		} else {
			// Fetch user from database
			const q = `
      *[_type == 'userProfile' && authUID==$id]{
        ...,
        }
      `;
			const userInDB = await sanityClient.fetch(q, { id: uid });
			// Set user to local storage
			localStorage.setItem('userProfile', JSON.stringify(userInDB[0]));
			// Set user to global state
			setUserDB(userInDB[0]);
			console.log('userInDB', userInDB[0]);
		}
	};

	// check if is user in local storage
	// if (localStorage.getItem('userProfile')) return children;

	if (loading)
	return (
		<div className='h-screen w-full'>
			
			<div className="w-20 h-20 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <LoadingIcon icon='ball-triangle' color='#ffffff'/>
      </div>
		</div>
	);

	if (!user && !loading) return <Navigate to='/login' />;

	if (user) return children;
};
