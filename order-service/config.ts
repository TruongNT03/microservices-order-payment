export default () => ({
  DB_PASSWORD: process.env.DB_PASSWORD || 'Taki2003!',
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: process.env.DB_PORT || 'postgres',
  DB_NAME: process.env.DB_NAME,
  PORT: process.env.PORT || 8080,
});
