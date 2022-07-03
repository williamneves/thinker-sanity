import React, { useState, useEffect } from "react";
import sanityClient from "../../../client.js";
import { useLocation } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { breadcrumbAtom } from '../../atoms/userAtom';

function Main() {
  const [breadcrumb, setBreadcrumb] = useRecoilState(breadcrumbAtom);
	const location = useLocation();
  
  useEffect(() => {
		setBreadcrumb('Home');
	}, []);
  
  return (
		<>
			<div className='intro-y flex items-center mt-8'>
				<h2 className='text-lg font-medium mr-auto'>Page 1</h2>
			</div>
			{/* BEGIN: Page Layout */}
			<div className='intro-y box p-5 mt-5'>Name: </div>
			{/* END: Page Layout */}
		</>
	);
}

export default Main;
