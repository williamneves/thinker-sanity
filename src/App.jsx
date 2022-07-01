import ScrollToTop from "@/base-components/scroll-to-top/Main";
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import Router from "./router";
import { Toaster } from 'react-hot-toast';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fad } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

library.add(fad);



function App() {
  return (
		<RecoilRoot>
			<BrowserRouter>
				<Router />
				<ScrollToTop />
				<Toaster
					toastOptions={{
						className:
							'py-5 pl-5 pr-5 bg-white border border-slate-300/60 rounded-lg shadow-xl dark:bg-darkmode-600 dark:text-slate-300 dark:border-darkmode-100',
						success: {
							icon: (
								<FontAwesomeIcon
									icon='fa-duotone fa-circle-check'
									className='text-success dark:text-green-400'
									size='xl'
								/>
							),
						},
						error: {
							icon: (
								<FontAwesomeIcon
									icon='fa-duotone fa-circle-xmark'
									className='text-danger dark:text-red-400'
									size='xl'
								/>
							),
						},
					}}
				/>
			</BrowserRouter>
		</RecoilRoot>
	);
}

export default App;
