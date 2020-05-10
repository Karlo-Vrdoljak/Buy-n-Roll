export class Config {
  corsOptions = {
    origin: 'http://localhost:4444',
    // origin: 'https://test-27530.web.app', //deploy
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    db_logs:true
  };
}
