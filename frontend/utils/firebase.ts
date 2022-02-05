// import firebase from 'firebase/app'
import { initializeApp } from 'firebase/app'
import { getStorage } from 'firebase/storage'
// import { getAnalytics } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: process.env.NEXT_APIKEY,
  authDomain: process.env.NEXT_AUTHDOMAIN,
  projectId: process.env.NEXT_PROJECTID,
  storageBucket: process.env.NEXT_STORAGEBUCKET,
  messagingSenderId: process.env.NEXT_MESSAGINGSENDERID,
  appId: process.env.NEXT_APPID,
  measurementId: process.env.NEXT_MEASUREMENTID,
}

const app = initializeApp(firebaseConfig)
const storage = getStorage(app)
// const analytics = getAnalytics(app)

export { storage, app as default }
