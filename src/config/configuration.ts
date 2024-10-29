export default () => ({
    database: {
        type: process.env.DB_CONNECTION,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        migration:process.env.DB_MIGRATION,
        synchronize: process.env.DB_SYNCHRONIZE === 'true' ? true : false,
        logging: process.env.DB_LOGGING,
        autoLoadEntities: true,
        timezone: 'Z',
      },
})