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
        <Toaster />
      </BrowserRouter>
    </RecoilRoot>
  );
}

export default App;
