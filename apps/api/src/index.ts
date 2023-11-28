import App from './server/app'

const app = new App()

app
  .init()
  .then(() => {
    app.run()
  })
