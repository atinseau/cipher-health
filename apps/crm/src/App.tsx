
import { Admin, Resource } from 'react-admin';
import Dashboard from './components/Dashboard';
import { darkTheme, lightTheme } from './lib/themes';
import { authProvider } from './lib/authProvider'
import { adminResource } from './resources/AdminResource/adminResource';
import { dataProvider } from './lib/dataProvider';

export const App = () => (
    <Admin
        dashboard={Dashboard}
        authProvider={authProvider}
        dataProvider={dataProvider}
        requireAuth
        theme={lightTheme}
        darkTheme={darkTheme}
    >
        {/* Placeholder until api is not ready */}
        <Resource {...adminResource} />
    </Admin>
);

