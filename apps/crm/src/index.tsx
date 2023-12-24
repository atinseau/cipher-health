import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';


ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);



// PLAYGROUND

// import { authentificator } from "./auth";

// async function bootstrap() {

//   try {
//     await authentificator.login({
//       email: 'arthurtweak@gmail.com',
//       password: '06112001..Arttsn'
//     })

//     const client = authentificator.getClient()

//     client.get('/admin/all')
//     client.get('/admin/all')
//     client.get('/admin/all')

//     await authentificator.logout()
//   } catch (e) {
//     console.log(e)
//   }

// }

// bootstrap()