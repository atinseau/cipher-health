
import { Admin, CustomRoutes, Resource } from 'react-admin';
import Dashboard from './components/Dashboard';
import { darkTheme, lightTheme } from './lib/themes';
import { authProvider } from './lib/authProvider'
import { adminResource } from './resources/AdminResource/adminResource';
import { dataProvider } from './lib/dataProvider';
import { BrowserRouter } from 'react-router-dom';


export const App = () => (
  <BrowserRouter>
    <Admin
      dashboard={Dashboard}
      authProvider={authProvider}
      dataProvider={dataProvider}
      theme={lightTheme}
      darkTheme={darkTheme}
    >
      {adminResource}
    </Admin>
  </BrowserRouter>
);

