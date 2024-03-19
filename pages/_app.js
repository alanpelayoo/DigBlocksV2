

import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/bootstrap.min.css';

import "@/styles/globals.css";

import Header from '../components/Header';
import Footer from '../components/Footer';
import "@fortawesome/fontawesome-svg-core/styles.css"; 

export default function App({ Component, pageProps }) {
  return (
    <>
      <Header/>
      <main>
        <Component {...pageProps} />
      </main>
      <Footer/>
    </>
  );
}
