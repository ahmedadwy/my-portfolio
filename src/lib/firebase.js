import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// إعدادات مشروعك الحقيقية
const firebaseConfig = {
  apiKey: "AIzaSyApXiurJCXHQSPDIw-rA-lTZw30qmgST5M",
  authDomain: "adwy-portfolio-75bb9.firebaseapp.com",
  projectId: "adwy-portfolio-75bb9",
  storageBucket: "adwy-portfolio-75bb9.firebasestorage.app",
  messagingSenderId: "273772599650",
  appId: "1:273772599650:web:7a936a608fbb18755db43b",
  measurementId: "G-6GNGR2CSJV"
};

// منع تهيئة التطبيق أكثر من مرة أثناء تحديث المتصفح (مهم جداً لـ Next.js)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// تعريف قاعدة البيانات (Firestore)
const db = getFirestore(app);

export { db };