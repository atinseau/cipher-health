

// const email = 'arthurtinseau@live.fr'
// const password = '06112001..Arttsn'

// const loginQuery = fetch('http://localhost:8080/api/v1/auth/signin', {
//   method: 'POST',
//   body: JSON.stringify({
//     email,
//     password,
//   }),
//   headers: {
//     'Content-Type': 'application/json',
//   }
// })

// loginQuery.then(async (res) => {
//   const data = await res.json()

//   if (res.status !== 200) {
//     return
//   }

//   for (let i = 0; i < 1000; i++) {
//     const refreshQuery = await fetch('http://localhost:8080/api/v1/auth/refresh', {
//       method: 'POST',
//       body: JSON.stringify({
//         refreshToken: data.refreshToken,
//       }),
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${data.accessToken}`,
//       }
//     })
//     const refreshData = await refreshQuery.json()
//     console.log(res.status)
//     console.log(JSON.stringify(refreshData, null, 2))

//     data.accessToken = refreshData.accessToken
//     data.refreshToken = refreshData.refreshToken
//   }

// })

// // const registerQuery = fetch('http://localhost:8080/api/v1/auth/signup', {
// //   method: 'POST',
// //   body: JSON.stringify({
// //     email,
// //     password,
// //     confirmPassword: password,
// //     firstName: 'Arthur',
// //     lastName: 'Tinseau',
// //   }),
// //   headers: {
// //     'Content-Type': 'application/json',
// //   },
// // })

// // registerQuery.then(async (res) => {
// //   const data = await res.json()
// //   console.log(res.status)
// //   console.log(JSON.stringify(data, null, 2))
// // })
