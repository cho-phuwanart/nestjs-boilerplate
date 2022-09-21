export default () => ({
  env: process.env.NODE_ENV || 'development',
  apiPrefix: process.env.API_PREFIX || '',
  port: parseInt(process.env.PORT, 10) || 3030,
});
