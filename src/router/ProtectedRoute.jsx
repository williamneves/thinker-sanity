import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { auth, onAuthStateChanged } from '../lib/firebase';
import { userDBAtom } from '../atoms/userAtom';
import { useRecoilState } from 'recoil';
import sanityClient from '../../client';
import { LoadingIcon } from '@/base-components';

export const ProtectedRoute = ({ children }) => {
	const [loading, setLoading] = useState(true);
	const [userDB, setUserDB] = useRecoilState(userDBAtom);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const navigate = useNavigate();

	// Check if user is logged in
	useEffect(() => {
		onAuthStateChanged(auth, async (user) => {
			if (user) {
				// Get the user from the database, and set it to global state
				const getUserProfileDB = async (uid) => {
					const query = `
			*[_type == 'userProfile' && authUID==$id]{
				...,
			}`;
					const userProfile = await sanityClient.fetch(query, { id: uid });

					setUserDB(userProfile[0]);
					localStorage.setItem('userProfile', JSON.stringify(userProfile[0]));

					return userProfile[0];
				};

				// Get the user from the database
				await getUserProfileDB(user.uid);

				setIsAuthenticated(true);
				setLoading(false);
			} else {
				console.log('User is not logged in');
				setIsAuthenticated(false);
				setLoading(false);
				localStorage.removeItem('userProfile');
				setUserDB(null);
				navigate('/login');
			}
		});
	}, [auth]);

	if (loading) {
		return (
			<div className='w-full-h-screen'>
				<div className='absolute'>
					<LoadingIcon />
				</div>
			</div>
		);
	}

	if (isAuthenticated) return children;
};
