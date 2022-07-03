import DarkModeSwitcher from "@/components/dark-mode-switcher/Main";
import dom from "@left4code/tw-starter/dist/js/dom";
import logoUrl from "@/assets/images/logo.svg";
import illustrationUrl from '@/assets/images/illustration.svg';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import classnames from 'classnames';
import * as yup from 'yup';
import {
	LoadingIcon,
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
} from '@/base-components';
import { useNavigate } from 'react-router-dom';
import { auth, signInWithEmailAndPassword, sendPasswordResetEmail } from '../../lib/firebase';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import sanityClient from '../../../client';
import { userDBAtom } from '../../atoms/userAtom';
import { useRecoilState } from 'recoil';

// Yup schema for login form
const loginForm = yup.object().shape({
	email: yup.string().email().required('Email is required'),
	password: yup.string().required('Password is required').min(6, 'Too short'),
});
// Yup schema for reset password form
const resetPasswordForm = yup.object().shape({
	emailReset: yup.string().email().required('Email is required'),
});

function Login() {
	// Hook form
	const {
		register: registerLoginForm,
		handleSubmit: handleSubmitLoginForm,
		formState: { errors: errorsLoginForm },
		clearErrors: clearErrorsLoginForm,
		setError: setErrorLoginForm,
		resetField: resetFieldLoginForm,
	} = useForm({
		resolver: yupResolver(resetPasswordForm),
		mode: 'onSubmit',
		reValidateMode: 'onSubmit',
	});
	const {
		register,
		handleSubmit,
		formState: { errors },
		clearErrors,
		setError,
	} = useForm({
		resolver: yupResolver(loginForm),
		mode: 'onSubmit',
		reValidateMode: 'onSubmit',
	});

	// Change class of body
	useEffect(() => {
		dom('body').removeClass('main').removeClass('error-page').addClass('login');
	}, []);

	const navigate = useNavigate();
	const [userDB, setUserDB] = useRecoilState(userDBAtom);
	const [forgotPasswordModal, setForgotPasswordModal] = useState(false);
	const [loadingReset, setLoadingReset] = useState(false);

	const [loading, setLoading] = useState(false);
	const onSubmit = async (data, e) => {
		e.preventDefault();
		setLoading(true);
		const toastId = toast.loading('Checking...');
		try {
			const authUser = await signInWithEmailAndPassword(auth, data.email, data.password);
			// Get the user from the database
			const q = `
      *[_type == 'userProfile' && authUID==$id]{
				...,
			}
      `;
			const userInDB = await sanityClient.fetch(q, { id: authUser.user.uid });
			// Set user to local storage
			localStorage.setItem('userProfile', JSON.stringify(userInDB[0]));
			// Set user to global state
			setUserDB(userInDB[0]);

			// Toast the success
			toast.success('Login successful!', {
				id: toastId,
			});
			setLoading(false);
			navigate('/');
		} catch (error) {
			console.log('error', error);

			if (error.code === 'auth/user-not-found') {
				setError('email', { type: 'firebase', message: 'Email not found!' });
			} else if (error.code === 'auth/wrong-password') {
				setError('password', { type: 'firebase', message: 'Wrong Password!' });
			}

			toast.error('Something went wrong!', {
				id: toastId,
			});
			setLoading(false);
		}
	};

	const onSubmitP = async (data, e) => {
		e.preventDefault();
		setLoadingReset(true);
		sendPasswordResetEmail(auth, data.emailReset)
			.then(() => {
				// Password reset email sent!
				// ..
				toast.success('Password reset email sent!');
				setForgotPasswordModal(false);
				setLoadingReset(false);
				resetFieldLoginForm('emailReset');
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				console.log(errorCode);
				if (errorCode === 'auth/missing-email') {
					setErrorLoginForm('emailReset', { type: 'firebase', message: 'Email not found!' });
				} else {
					setErrorLoginForm('emailReset', { type: 'firebase', message: errorMessage });
				}
				// ..
			});
	};

	const onError = (errors, e) => {
		e.preventDefault();
		console.log('errors', errors);
		toast.error('Something went wrong!');
	};
	const onErrorP = (errors, e) => {
		e.preventDefault();
		console.log('errors', errors);
	};

	return (
		<>
			<div>
				<DarkModeSwitcher />
				<div className='container sm:px-10'>
					<div className='block xl:grid grid-cols-2 gap-4'>
						{/* BEGIN: Login Info */}
						<div className='hidden xl:flex flex-col min-h-screen'>
							<a href='src/views/login/Main' className='-intro-x flex items-center pt-5'>
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
									sign in to your account.
								</div>
								<div className='-intro-x mt-5 text-lg text-white text-opacity-70 dark:text-slate-400'>
									Manage all your e-commerce accounts in one place
								</div>
							</div>
						</div>
						{/* END: Login Info */}
						{/* BEGIN: Login Form */}
						<div className='h-screen xl:h-auto flex py-5 xl:py-0 my-10 xl:my-0'>
							<div className='my-auto mx-auto xl:ml-20 bg-white dark:bg-darkmode-600 xl:bg-transparent px-5 sm:px-8 py-8 xl:p-0 rounded-md shadow-md xl:shadow-none w-full sm:w-3/4 lg:w-2/4 xl:w-auto ml-2'>
								<h2 className='intro-x font-bold text-2xl xl:text-3xl text-center xl:text-left ml-2'>
									<FontAwesomeIcon icon='fa-duotone fa-arrow-right-to-arc' className='mr-2' />
									Sign In
								</h2>
								<div className='intro-x mt-2 text-slate-400 xl:hidden text-center'>
									A few more clicks to sign in to your account. Manage all your e-commerce accounts
									in one place
								</div>
								<form
									className='validate-form'
									onSubmit={handleSubmit(onSubmit, onError)}
									id='LoginForm'>
									<div className='intro-x mt-8 flex flex-col gap-4'>
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
													'intro-x login__input form-control py-3 px-4 block z-0': true,
													'intro-x login__input py-3 border-0 ring-2 ring-red-300 focus:ring-red-400 px-4 border-danger transition-all ease-in-out duration-150':
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
									</div>
									{/* BEGIN: Modal Toggle */}
									<div className='intro-x flex text-slate-600 dark:text-slate-500 text-xs sm:text-sm mt-4 cursor-pointer justify-end mr-2'>
										<span
											onClick={() => {
												setForgotPasswordModal(true);
											}}>
											Forgot Password?
										</span>
									</div>
									{/* END: Modal Toggle */}
									<div className='intro-x mt-5 xl:mt-8 text-center xl:text-left'>
										<button
											form="LoginForm"
											type='submit'
											disabled={loading}
											className='btn btn-primary py-3 px-4 w-full xl:w-32 xl:mr-3 align-top'>
											{loading ? (
												<>
													Loading
													<LoadingIcon
														icon='ball-triangle'
														color='#ffffff'
														className='w-5 h-5 ml-2'></LoadingIcon>
												</>
											) : (
												<div>
													Sign In
													<FontAwesomeIcon
														icon='fa-duotone fa-arrow-right-to-arc'
														className='ml-2'
													/>
												</div>
											)}
										</button>
										<button
											onClick={() => navigate('/register')}
											disabled={loading}
											className='btn btn-outline-secondary py-3 px-4 w-full xl:w-32 mt-3 xl:mt-0 align-top'>
											Register
											<FontAwesomeIcon
												icon='fa-duotone fa-arrow-up-right-from-square'
												className='ml-2'
											/>
										</button>
									</div>
								</form>
								<div className='intro-x mt-10 xl:mt-24 text-slate-600 dark:text-slate-500 text-center xl:text-left'>
									By signin up, you agree to our
									<Link className='text-primary dark:text-slate-200' to='#'>
										Terms and Conditions
									</Link>
									&
									<Link className='text-primary dark:text-slate-200' to='#'>
										Privacy Policy
									</Link>
								</div>
							</div>
						</div>
						{/* END: Login Form */}
					</div>
				</div>
			</div>
			{/* BEGIN: Modal Content */}
			<Modal
				show={forgotPasswordModal}
				onHidden={() => {
					setForgotPasswordModal(false);
				}}>
				<ModalHeader>
					<h2 className='font-medium text-base mr-auto'>Reset Password Email Link</h2>
				</ModalHeader>
				<ModalBody className='flex flex-col gap-2'>
					<label className='text-slate-600 dark:text-slate-200'>Type your email:</label>
					<form
						className='flex flex-col relative'
						id='resetPassword'
						onSubmit={handleSubmitLoginForm(onSubmitP,onErrorP)}>
						<input
							{...registerLoginForm('emailReset')}
							onChange={() => clearErrorsLoginForm('emailReset')}
							type='email'
							style={{ zIndex: 0 }}
							disabled={loading}
							className={classnames({
								'intro-x login__input form-control py-3 px-4 block': true,
								'intro-x login__input py-3 border-0 ring-2 ring-red-300 focus:ring-red-400 px-4 block border-danger transition-all ease-in-out duration-150':
									errorsLoginForm.emailReset,
							})}
							placeholder='Email'
						/>
						{errorsLoginForm.emailReset && (
							<div className='text-danger dark:text-red-300 z-30 absolute top-2.5 right-1 mt-1 text-end text-xs mr-2'>
								{errorsLoginForm.emailReset.message}{' '}
								<FontAwesomeIcon icon='fa-duotone fa-circle-exclamation' size='lg' />
							</div>
						)}
					</form>
				</ModalBody>
				<ModalFooter>
					<button
						disabled={loadingReset}
						type='button'
						onClick={() => {
							setForgotPasswordModal(false);
						}}
						className='btn btn-outline-secondary w-20 mr-1'>
						Cancel
					</button>
					<button type='submit' form='resetPassword' className='btn btn-primary w-36'>
						Send Email Link
					</button>
				</ModalFooter>
			</Modal>
			{/* END: Modal Content */}
		</>
	);
}

export default Login;
