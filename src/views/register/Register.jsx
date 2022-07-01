import DarkModeSwitcher from '@/components/dark-mode-switcher/Main';
import dom from '@left4code/tw-starter/dist/js/dom';
import logoUrl from '@/assets/images/logo.svg';
import illustrationUrl from '@/assets/images/illustration.svg';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import classnames from 'classnames';
import * as yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { auth, createUserWithEmailAndPassword } from '../../lib/firebase';
import sanityClient from '../../../client.js';
import toast from 'react-hot-toast';
import { userDBAtom } from './../../atoms/userAtom';
import { useRecoilState } from 'recoil';

// Yup schema for login form
const schema = yup.object().shape({
	name: yup.string().required('Required').min(2, 'Too short').max(60, 'Too long'),
	email: yup.string().email().required('Required'),
	password: yup.string().required('Required').min(6, 'Too short'),
	confirmPassword: yup
		.string()
		.required('Required')
		.oneOf([yup.ref('password'), null], 'Passwords must match'),
	// acceptedTerms: yup.boolean().required('You must accept the terms and conditions'),
});

// Component Start
function Register() {
	useEffect(() => {
		dom('body').removeClass('main').removeClass('error-page').addClass('login');
	}, []);

	const [ loading, setLoading ] = useState( false );
	const [userDB,setUserDB ] = useRecoilState(userDBAtom);
	const navigate = useNavigate();
	// Hook form
	const {
		register,
		handleSubmit,
		formState: { errors },
		clearErrors,
		setError,
	} = useForm({
		resolver: yupResolver(schema),
		mode: 'onSubmit',
		reValidateMode: 'onSubmit',
	});

	const onSubmit = async (data, e) => {
		e.preventDefault();
		console.log('data', data);

		// Set loading to true to block the form
		setLoading(true);
		// Create a toast to show the loading
		const toastId = toast.loading('Creating new user...');

		try {
			// Create a new user with the email and password
			const newUser = await createUserWithEmailAndPassword(auth, data.email, data.password);

			// Create a new userProfile to authUser in the database

			// Generate a random profileImage
			const profileImageURL = () => {
				const name = data.name.split(' ');
				if (name.length > 1) {
					return `https://ui-avatars.com/api/?name=${
						name[0][0] + name[1][0]
					}&size=256&background=random`;
				}
				return `https://ui-avatars.com/api/?name=${
					name[0][0] + name[0][1]
				}&size=256&background=random`;
			};

			// Create the userProfile object
			const userProfile = {
				_type: 'userProfile',
				authUID: newUser.user.uid,
				name: data.name,
				email: data.email,
				profileImage: profileImageURL(),
				role: 'user',
			};

			// Create the userProfile in the database
			const userProfileDB = await sanityClient.create( userProfile )
			
			// Set the userProfile in the localStorage
			localStorage.setItem( 'userProfile', JSON.stringify( userProfileDB ) );
			
			// Set the userProfile in the global state
			setUserDB( userProfileDB );

			// Set loading to false to unblock the form
			setLoading(false);
			// Remove the toast
			toast.success( 'User created successfully', { id: toastId } );
			// Navigate to the home page
			navigate('/');
		} catch (error) {
			console.log('error', error);
			// Set loading to false to unblock the form
			setLoading(false);
			// Show the error message
			toast.error(error.message, {
				id: toastId,
			});
		}
		// Create a new user with the email and password
	};

	const onError = (errors, e) => {
		e.preventDefault();
		toast.error('Something went wrong!');
	};

	// Use navigate to redirect to login page

	return (
		<>
			<div>
				<DarkModeSwitcher />
				<div className='container sm:px-10'>
					<div className='block xl:grid grid-cols-2 gap-4'>
						{/* BEGIN: Register Info */}
						<div className='hidden xl:flex flex-col min-h-screen'>
							<a href='' className='-intro-x flex items-center pt-5'>
								<img alt='Midone Tailwind HTML Admin Template' className='w-6' src={logoUrl} />
								<span className='text-white text-lg ml-3'> Tinker </span>
							</a>
							<div className='my-auto'>
								<img
									alt='Midone Tailwind HTML Admin Template'
									className='-intro-x w-1/2 -mt-16'
									src={illustrationUrl}
								/>
								<div className='-intro-x text-white font-medium text-4xl leading-tight mt-10'>
									A few more clicks to <br />
									sign up to your account.
								</div>
								<div className='-intro-x mt-5 text-lg text-white text-opacity-70 dark:text-slate-400'>
									"Don't think, just do it."
								</div>
							</div>
						</div>
						{/* END: Register Info */}
						{/* BEGIN: Register Form */}
						<div className='h-screen xl:h-auto flex py-5 xl:py-0 my-10 xl:my-0'>
							<div className='my-auto mx-auto xl:ml-20 bg-white dark:bg-darkmode-600 xl:bg-transparent px-5 sm:px-8 py-8 xl:p-0 rounded-md shadow-md xl:shadow-none w-full sm:w-3/4 lg:w-2/4 xl:w-auto'>
								<h2 className='intro-x font-bold text-2xl xl:text-3xl text-center xl:text-left xl:ml-3'>
									<FontAwesomeIcon icon='fa-duotone fa-user' className='mr-2' /> Sign Up
								</h2>
								<div className='intro-x mt-2 text-slate-400 dark:text-slate-400 xl:hidden text-center'>
									A few more clicks to sign in to your account. <br />
									"Don't think, just do it."
								</div>
								<form className='validate-form' onSubmit={handleSubmit(onSubmit, onError)}>
									<div className='intro-x mt-8 flex flex-col gap-4'>
										<div className='flex flex-col relative'>
											<input
												{...register('name')}
												onChange={() => clearErrors('name')}
												type='text'
												style={{ zIndex: 0 }}
												disabled={loading}
												className={classnames({
													'intro-x login__input form-control py-3 px-4 block': true,
													'intro-x login__input py-3 border-0 ring-2 ring-red-300 focus:ring-red-400 px-4 block border-danger transition-all ease-in-out duration-150':
														errors.name,
												})}
												placeholder='Name'
											/>
											{errors.name && (
												<div className='text-danger dark:text-red-300 z-30 absolute top-2.5 right-1 mt-1 text-end text-xs mr-2'>
													{errors.name.message}{' '}
													<FontAwesomeIcon icon='fa-duotone fa-circle-exclamation' size='lg' />
												</div>
											)}
										</div>
										<div className='flex flex-col relative'>
											<input
												{...register('email')}
												onChange={() => clearErrors('email')}
												type='email'
												style={{ zIndex: 0 }}
												disabled={loading}
												className={classnames({
													'intro-x login__input form-control py-3 px-4 block': true,
													'intro-x login__input py-3 border-0 ring-2 ring-red-300 focus:ring-red-400 px-4 block border-danger transition-all ease-in-out duration-150':
														errors.email,
												})}
												placeholder='Email'
											/>
											{errors.email && (
												<div className='text-danger dark:text-red-300 z-30 absolute top-2.5 right-1 mt-1 text-end text-xs mr-2'>
													{errors.email.message}{' '}
													<FontAwesomeIcon icon='fa-duotone fa-circle-exclamation' size='lg' />
												</div>
											)}
										</div>
										<div className='flex flex-col relative'>
											<input
												{...register('password')}
												onChange={() => clearErrors('password')}
												type='password'
												style={{ zIndex: 0 }}
												disabled={loading}
												className={classnames({
													'intro-x login__input form-control py-3 px-4 block': true,
													'intro-x login__input py-3 border-0 ring-2 ring-red-300 focus:ring-red-400 px-4 block border-danger transition-all ease-in-out duration-150':
														errors.password,
												})}
												placeholder='Password'
											/>
											{errors.password && (
												<div className='text-danger dark:text-red-300 z-30 absolute top-2.5 right-1 mt-1 text-end text-xs mr-2'>
													{errors.password.message}{' '}
													<FontAwesomeIcon icon='fa-duotone fa-circle-exclamation' size='lg' />
												</div>
											)}
										</div>
										<div className='flex flex-col relative'>
											<input
												{...register('confirmPassword')}
												onChange={() => clearErrors('confirmPassword')}
												type='password'
												style={{ zIndex: 0 }}
												disabled={loading}
												className={classnames({
													'intro-x login__input form-control py-3 px-4 block': true,
													'intro-x login__input py-3 border-0 ring-2 ring-red-300 focus:ring-red-400 px-4 block border-danger transition-all ease-in-out duration-150':
														errors.confirmPassword,
												})}
												placeholder='Confirm Password'
											/>
											{errors.confirmPassword && (
												<div className='text-danger dark:text-red-300 z-30 absolute top-2.5 right-1 mt-1 text-end text-xs mr-2'>
													{errors.confirmPassword.message}{' '}
													<FontAwesomeIcon icon='fa-duotone fa-circle-exclamation' size='lg' />
												</div>
											)}
										</div>
										<div className='flex flex-col relative'>
											<div>
												<input
													id='remember-me'
													type='checkbox'
													className='form-check-input border mr-2'
												/>
												<label className='cursor-pointer select-none' htmlFor='remember-me'>
													I agree to the Company
												</label>
												<Link className='text-primary dark:text-slate-200 ml-1' to=''>
													Privacy Policy
												</Link>
											</div>
											{errors.acceptedTerms && (
												<div className='text-danger dark:text-red-300 z-30 mt-1 ml-6 text-xs mr-2'>
													{errors.acceptedTerms.message}{' '}
													<FontAwesomeIcon icon='fa-duotone fa-circle-exclamation' size='lg' />
												</div>
											)}
										</div>
									</div>
									<div className='intro-x mt-5 xl:mt-8 text-center xl:text-left'>
										<button className='btn btn-primary py-3 px-4 w-full xl:w-32 xl:mr-3 align-top'>
											Register <FontAwesomeIcon icon='fa-duotone fa-user-plus' className='ml-2' />
										</button>
										<button
											onClick={() => navigate('/login')}
											className='btn btn-outline-secondary py-3 px-4 w-full xl:w-32 mt-3 xl:mt-0 align-top'>
											Sign in
											<FontAwesomeIcon
												icon='fa-duotone fa-arrow-up-right-from-square'
												className='ml-2'
											/>
										</button>
									</div>
								</form>
							</div>
						</div>
						{/* END: Register Form */}
					</div>
				</div>
			</div>
		</>
	);
}

export default Register;
