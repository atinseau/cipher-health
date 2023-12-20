
import { Admin, Resource } from 'react-admin';
import Dashboard from './components/Dashboard';
import { darkTheme, lightTheme } from './lib/themes';

export const App = () => (
    <Admin
        dashboard={Dashboard}
        requireAuth
        theme={lightTheme}
        darkTheme={darkTheme}
    >
        {/* Placeholder until api is not ready */}
        <Resource name='Worker' />
    </Admin>
);

