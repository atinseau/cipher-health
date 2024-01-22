
import { Admin } from 'react-admin';
import Dashboard from './components/Dashboard';
import { darkTheme, lightTheme } from './lib/themes';
import { authProvider } from './lib/authProvider'
import { adminResource } from './resources/AdminResource/adminResource';
import { dataProvider } from './lib/dataProvider';
import { BrowserRouter } from 'react-router-dom';
import SigninPage from './resources/AdminResource/components/Signin/SigninPage';
import { workerResource } from './resources/WorkerResource/workerResource';


export const App = () => (
  <BrowserRouter>
    <Admin
      loginPage={SigninPage}
      dashboard={Dashboard}
      authProvider={authProvider}
      dataProvider={dataProvider}
      theme={lightTheme}
      darkTheme={darkTheme}
    >
      {adminResource}
      {workerResource}
    </Admin>
  </BrowserRouter>
);

