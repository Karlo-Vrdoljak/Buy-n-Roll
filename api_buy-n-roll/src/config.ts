export class Config {
  corsOptions = {
    origin: 'http://localhost:4444',
    // origin: 'https://buy-n-roll.web.app', //deploy
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    db_logs:true
  };
}
