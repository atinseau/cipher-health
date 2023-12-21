
import { Admin, Resource } from 'react-admin';
import Dashboard from './components/Dashboard';
import { darkTheme, lightTheme } from './lib/themes';
import { authProvider } from './lib/authProvider'
import LoginPage from './components/LoginPage';

export const App = () => (
    <Admin
        dashboard={Dashboard}
        loginPage={LoginPage}
        authProvider={authProvider}
        requireAuth
        theme={lightTheme}
        darkTheme={darkTheme}
    >
        {/* Placeholder until api is not ready */}
        <Resource name='Worker' />
    </Admin>
);

