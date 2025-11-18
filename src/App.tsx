import { LandingPage } from './components/LandingPage';
import { Toaster } from 'sonner';
import BankDashboard from './bank';
import './App.css';

function App() {
  const isBrowser = typeof window !== 'undefined';
  const isBankRoute = isBrowser && window.location.pathname.startsWith('/bank');

  if (isBankRoute) {
    return <BankDashboard />;
  }

  return (
    <>
      <LandingPage />
      <Toaster position="top-center" />
    </>
  );
}

export default App;