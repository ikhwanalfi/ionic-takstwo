import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'MyApp',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000, // Durasi splash screen (dalam milidetik)
      launchAutoHide: true, // Otomatis sembunyikan splash screen setelah durasi
      backgroundColor: '#ffffffff', // Warna latar belakang splash screen (putih)
      androidSplashResourceName: 'splash', // Nama file splash screen untuk Android
      showSpinner: true, // Tampilkan spinner (ikon loading)
      spinnerStyle: 'large', // Gaya spinner (large/small)
      spinnerColor: '#999999', // Warna spinner
      splashFullScreen: true, // Mode full screen
      splashImmersive: true, // Immersive mode (hanya di Android)
    },
  },
};

export default config;
