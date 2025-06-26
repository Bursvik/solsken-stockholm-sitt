
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.3d18b767a60845ce825769a65b795297',
  appName: 'solsken-stockholm-sitt',
  webDir: 'dist',
  server: {
    url: 'https://3d18b767-a608-45ce-8257-69a65b795297.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#f59e0b',
      showSpinner: false
    }
  }
};

export default config;
