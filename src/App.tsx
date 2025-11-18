import { LandingPage } from './components/LandingPage';
import { Toaster } from 'sonner';
import BankDashboard from './bank';
import ContractDashboard from './dashboard';
import './App.css';

function App() {
  const isBrowser = typeof window !== 'undefined';
  const isBankRoute = isBrowser && window.location.pathname.startsWith('/bank');
  const isDashboardRoute = isBrowser && window.location.pathname.startsWith('/dashboard');

  if (isBankRoute) {
    return <BankDashboard />;
  }

  if (isDashboardRoute) {
    return <ContractDashboard />;
  }

  return (
    <>
      <LandingPage />
      <Toaster position="top-center" />
    </>
  );
}

export default App;