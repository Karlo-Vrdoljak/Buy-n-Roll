export class Config {
  corsOptions = {
    origin: ['http://localhost:4444','http://localhost:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    db_logs:true
  };
}
