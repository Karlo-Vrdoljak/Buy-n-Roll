export class Config {
  corsOptions = {
    origin: 'http://localhost:4444',
    // origin: 'https://buy-n-roll.web.app', //deploy
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  };
  dbAccessQueryLogs: boolean = false;
  locationIQ_token = '575da4a2ca5c53';
}
