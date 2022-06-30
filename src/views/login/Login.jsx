import DarkModeSwitcher from "@/components/dark-mode-switcher/Main";
import dom from "@left4code/tw-starter/dist/js/dom";
import logoUrl from "@/assets/images/logo.svg";
import illustrationUrl from "@/assets/images/illustration.svg";
import Toastify from 'toastify-js';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import classnames from 'classnames';
import * as yup from 'yup';
import { Lucide } from '@/base-components';
import { useNavigate } from 'react-router-dom';
import { auth, signInWithEmailAndPassword } from '../../lib/firebase';

// Yup schema for login form
const schema = yup.object().shape({
	email: yup.string().email().required('Email is required*'),
	password: yup.string().required('Password is required*').min(6, 'Too short*'),
});

function Login() {
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

	// Change class of body
	useEffect(() => {
		dom('body').removeClass('main').removeClass('error-page').addClass('login');
	}, []);

	// Handle sign in with email and password
	const [firebaseErrors, setFirebaseErrors] = useState({
		email: '',
		password: '',
	});
	const navigate = useNavigate();

	const [loading, setLoading] = useState(false);
	const onSubmit = async (data, e) => {
		e.preventDefault();
		console.log('data', data);

		setLoading(true);
		try {
			await signInWithEmailAndPassword(auth, data.email, data.password);
			// Show success notification
			Toastify({
				node: dom('#success-notification-content').clone().removeClass('hidden')[0],
				duration: 3000,
				newWindow: true,
				close: true,
				gravity: 'top',
				position: 'center',
				stopOnFocus: true,
			}).showToast();

			setLoading(false);
			navigate('/');
		} catch (error) {
			console.log('error', error);
			if ( error.code === 'auth/user-not-found' ) {
				setError('email', { type: 'firebase', message: 'Email not found!' });

			} else if (error.code === 'auth/wrong-password') {
				setError('password', { type: 'firebase', message: 'Wrong Password!' });
			}
			// Show error notification
			Toastify({
				node: dom('#failed-notification-content').clone().removeClass('hidden')[0],
				duration: 3000,
				newWindow: true,
				close: true,
				gravity: 'top',
				position: 'center',
				stopOnFocus: true,
			}).showToast();
			setLoading(false);
		}
	};

	const onError = (errors, e) => {
		e.preventDefault();
		Toastify({
			node: dom('#failed-notification-content').clone().removeClass('hidden')[0],
			duration: 3000,
			newWindow: true,
			close: true,
			gravity: 'top',
			position: 'center',
			stopOnFocus: true,
		}).showToast();
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
							<div className='my-auto mx-auto xl:ml-20 bg-white dark:bg-darkmode-600 xl:bg-transparent px-5 sm:px-8 py-8 xl:p-0 rounded-md shadow-md xl:shadow-none w-full sm:w-3/4 lg:w-2/4 xl:w-auto'>
								<h2 className='intro-x font-bold text-2xl xl:text-3xl text-center xl:text-left'>
									Sign In
								</h2>
								<div className='intro-x mt-2 text-slate-400 xl:hidden text-center'>
									A few more clicks to sign in to your account. Manage all your e-commerce accounts
									in one place
								</div>
								<form className='validate-form' onSubmit={handleSubmit(onSubmit, onError)}>
									<div className='intro-x mt-8 flex flex-col gap-4'>
										<div className='flex flex-col'>
											<input
												{...register('email')}
												onChange={() => clearErrors('email')}
                        type='email'
                        disabled={loading}
												className={classnames({
													'intro-x login__input form-control py-3 px-4 block': true,
													'intro-x login__input py-3 px-4 block border-danger': errors.email,
												})}
												placeholder='Email'
											/>
											{errors.email && (
												<div className='text-danger mt-1 text-end text-xs mr-2'>
													{errors.email.message}
												</div>
											)}
										</div>
										<div className='flex flex-col'>
											<input
												{...register('password')}
												onChange={() => clearErrors('password')}
                        type='password'
                        disabled={loading}
												className={classnames({
													'intro-x login__input form-control py-3 px-4 block': true,
													'intro-x login__input  py-3 px-4 block border-danger': errors.password,
												})}
												placeholder='Password'
											/>
											{errors.password && (
												<div className='text-danger mt-1 text-end text-xs mr-2'>
													{errors.password.message}
												</div>
											)}
										</div>
									</div>
									<div className='intro-x flex text-slate-600 dark:text-slate-500 text-xs sm:text-sm mt-4'>
										{/* <div className='flex items-center mr-auto'>
											<input
												id='remember-me'
												type='checkbox'
												className='form-check-input border mr-2'
											/>
											<label className='cursor-pointer select-none' htmlFor='remember-me'>
												Remember me
											</label>
										</div> */}
										<a href='src/views/login/Main'>Forgot Password?</a>
									</div>
									<div className='intro-x mt-5 xl:mt-8 text-center xl:text-left'>
										<button
                      type='submit'
                      disabled={loading}
											className='btn btn-primary py-3 px-4 w-full xl:w-32 xl:mr-3 align-top'>
											Login
										</button>
                    <button
                      disabled={loading}
                      className='btn btn-outline-secondary py-3 px-4 w-full xl:w-32 mt-3 xl:mt-0 align-top'>
											Register
										</button>
									</div>
								</form>
								<div className='intro-x mt-10 xl:mt-24 text-slate-600 dark:text-slate-500 text-center xl:text-left'>
									By signin up, you agree to our
									<a className='text-primary dark:text-slate-200' href='src/views/login/Main'>
										Terms and Conditions
									</a>
									&
									<a className='text-primary dark:text-slate-200' href='src/views/login/Main'>
										Privacy Policy
									</a>
								</div>
							</div>
						</div>
						{/* END: Login Form */}
					</div>
				</div>
			</div>
			{/* BEGIN: Success Notification Content */}
			<div id='success-notification-content' className='toastify-content hidden flex'>
				<Lucide icon='CheckCircle' className='text-success' />
				<div className='ml-4 mr-4'>
					<div className='font-medium'>Login Success!</div>
					<div className='text-slate-500 mt-1'>Welcome back!</div>
				</div>
			</div>
			{/* END: Success Notification Content */}
			{/* BEGIN: Failed Notification Content */}
			<div id='failed-notification-content' className='toastify-content hidden flex'>
				<Lucide icon='XCircle' className='text-danger' />
				<div className='ml-4 mr-4'>
					<div className='font-medium'>Login failed!</div>
					<div className='text-slate-500 mt-1'>Please check the fileld form.</div>
				</div>
			</div>
			{/* END: Failed Notification Content */}
		</>
	);
}

export default Login;
