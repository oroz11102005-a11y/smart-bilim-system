const firebaseConfig = {
  apiKey: "AIzaSyACqWw-o81yJdt64IewiWCAeOWG1A_bv8Y",
  authDomain: "smart-bilim-2d2f1.firebaseapp.com",
  projectId: "smart-bilim-2d2f1",
  storageBucket: "smart-bilim-2d2f1.firebasestorage.app",
  messagingSenderId: "347775620871",
  appId: "1:347775620871:web:b377e4f38121a5a19197a2",
  measurementId: "G-3QCS8Q042W"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth();

const firebaseReady = true;