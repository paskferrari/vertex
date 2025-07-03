import { Outlet } from 'react-router-dom';
import GuestHeader from './GuestHeader';

/**
 * Layout component per utenti guest (non autenticati)
 * Include header semplificato senza funzionalità utente
 */
const GuestLayout = () => {
  return (
    <div className="min-h-screen bg-dark text-white">
      <GuestHeader />
      
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default GuestLayout;