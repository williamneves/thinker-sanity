import DarkModeSwitcher from '@/components/dark-mode-switcher/Main';
import dom from '@left4code/tw-starter/dist/js/dom';
import logoUrl from '@/assets/images/logo.svg';
import illustrationUrl from '@/assets/images/illustration.svg';
import Toastify from 'toastify-js';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import classnames from 'classnames';
import * as yup from 'yup';
import { Lucide } from '@/base-components';
import { useNavigate, Link } from 'react-router-dom';

// Yup schema for login form
const schema = yup.object().shape({
	name: yup.string().required('Name is required*').min(2, 'Too short*').max(60, 'Too long*'),
	email: yup.string().email().required('Email is required*'),
	password: yup.string().required('Password is required*').min(6, 'Too short*'),
	confirmPassword: yup
		.string()
		.required('Password is required*')
		.oneOf([yup.ref('password'), null], 'Passwords must match'),
});

function Register() {
	useEffect(() => {
		dom('body').removeClass('main').removeClass('error-page').addClass('login');
	}, []);

	const [loading, setLoading] = useState(false);
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
	};

	const onError = (errors, e) => {
		e.preventDefault();
		// toast.error('Something went wrong!');
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
								<h2 className='intro-x font-bold text-2xl xl:text-3xl text-center xl:text-left'>
									Sign Up
								</h2>
								<div className='intro-x mt-2 text-slate-400 dark:text-slate-400 xl:hidden text-center'>
									A few more clicks to sign in to your account. <br />
									"Don't think, just do it."
								</div>
								<form className='validate-form' onSubmit={handleSubmit(onSubmit, onError)}>
									<div className='intro-x mt-8 flex flex-col gap-4'>
										<div className='flex flex-col'>
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
													{errors.name.message}
												</div>
											)}
										</div>
										<div className='flex flex-col'>
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
													{errors.email.message}
												</div>
											)}
										</div>
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
									
									</div>
									<div className='intro-x mt-5 xl:mt-8 text-center xl:text-left'>
										<button className='btn btn-primary py-3 px-4 w-full xl:w-32 xl:mr-3 align-top'>
											Register
										</button>
										<button
											onClick={() => navigate('/login')}
											className='btn btn-outline-secondary py-3 px-4 w-full xl:w-32 mt-3 xl:mt-0 align-top'>
											Sign in
										</button>
									</div>
								</form>
							</div>
						</div>
						{/* END: Register Form */}
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
					</div>
				</div>
			</div>
		</>
	);
}

export default Register;
