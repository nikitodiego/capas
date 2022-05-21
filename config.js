import admin from "firebase-admin";

admin.initializeApp({
    credential: admin.credential.cert("./db/dbfirebase-87073-firebase-adminsdk-mlzvf-abad7f2a0a.json")
});

const db = admin.firestore();

export default db;