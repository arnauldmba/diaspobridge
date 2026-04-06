import { AppEnvironment } from "./models/app-environments";

export const environment: AppEnvironment = {
  production: false,
  //apiUrl: 'http://localhost:8080/diasporabridge/api', // Development API URL service TransporterTrip
  //apiUrl: 'http://192.168.178.75:8080/diasporabridge/api',
  apiUrl: 'https://diaspobridge-production.up.railway.app/diasporabridge/api',
  appName: 'MbokoGO'
};
