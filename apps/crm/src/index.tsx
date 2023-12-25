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

// const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// async function bootstrap() {

//   try {
//     await authentificator.login({
//       email: 'arthurtweak@gmail.com',
//       password: '06112001..Arttsn'
//     })

//     const client = authentificator.getClient()

//     client.addHook('afterRequest', async (req, controller) => {
//       if (!req.ok)
//         controller.retry()
//     })

//     client.get({
//       endpoint: '/admin/53c2b6c9-be05-4693-91ab-bad8939cfd82',
//       // skipRetry: true
//     })
//     client.get('/admin/53c2b6c9-be05-4693-91ab-bad8939cfd82')
//     await client.get('/admin/53c2b6c9-be05-4693-91ab-bad8939cfd82')

//     await authentificator.logout()
//   } catch (e) {
//     console.log(e)
//   }

// }

// bootstrap()