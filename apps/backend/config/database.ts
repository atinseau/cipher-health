export default ({ env }) => {
  return {
    connection: {
      client: 'postgres',
      connection: {
        host: env('POSTGRES_HOST', '127.0.0.1'),
        port: 5432,
        database: env('POSTGRES_DATABASE', 'strapi'),
        user: env('POSTGRES_USER', 'strapi'),
        password: env('POSTGRES_PASSWORD', 'strapi'),
        ssl: {},
      },
      debug: false,
    },
  };
};
