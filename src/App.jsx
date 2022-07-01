import ScrollToTop from "@/base-components/scroll-to-top/Main";
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import Router from "./router";
import {Toaster} from 'react-hot-toast';

function App() {
  return (
    <RecoilRoot>
      <BrowserRouter>
        <Router />
        <ScrollToTop />
        <Toaster
        toastOptions={{
            className: 'py-5 pl-5 pr-14 bg-white border border-slate-200/60 rounded-lg shadow-xl dark:bg-darkmode-600 dark:text-slate-300 dark:border-darkmode-100'
        }}
        />
      </BrowserRouter>
    </RecoilRoot>
  );
}

export default App;
