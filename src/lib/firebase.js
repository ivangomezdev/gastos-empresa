import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
  onSnapshot,
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';


const firebaseConfig = {
  apiKey: "AIzaSyC9-w-sOXmqG7bZr9mgJTLbyI06fApY3sg",
  authDomain: "gastos-1deb5.firebaseapp.com",
  projectId: "gastos-1deb5",
  storageBucket: "gastos-1deb5.firebasestorage.app",
  messagingSenderId: "877209222915",
  appId: "1:877209222915:web:167754ef07a9f66529b336"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export async function addTransaction(transaction) {
  try {
    console.log('Adding transaction to Firestore:', transaction);
    const docRef = await addDoc(collection(db, 'transactions'), transaction);
    console.log('Transaction added successfully, ID:', docRef.id);
    return docRef;
  } catch (err) {
    console.error('Error adding transaction:', err.message);
    throw err;
  }
}

export async function getTransactions() {
  try {
    console.log('Fetching transactions from Firestore');
    const querySnapshot = await getDocs(collection(db, 'transactions'));
    const transactions = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    console.log('Transactions fetched:', transactions);
    return transactions;
  } catch (err) {
    console.error('Error fetching transactions:', err.message);
    throw err;
  }
}

export function listenTransactions(onUpdate, onError) {
  try {
    console.log('Setting up real-time listener for transactions');
    const unsubscribe = onSnapshot(
      collection(db, 'transactions'),
      (snapshot) => {
        const transactions = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        onUpdate(transactions);
      },
      (err) => {
        onError(err);
      }
    );
    return unsubscribe;
  } catch (err) {
    console.error('Error setting up transaction listener:', err.message);
    throw err;
  }
}

export async function addLugar(lugar) {
  try {
    console.log('Adding lugar to Firestore:', lugar);
    const docRef = await addDoc(collection(db, 'lugares'), { nombre: lugar, isCustom: true });
    console.log('Lugar added successfully, ID:', docRef.id);
    return docRef;
  } catch (err) {
    console.error('Error adding lugar:', err.message);
    throw err;
  }
}

export async function getLugares() {
  try {
    console.log('Fetching lugares from Firestore');
    const querySnapshot = await getDocs(collection(db, 'lugares'));
    const lugares = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    console.log('Lugares fetched:', lugares);
    return lugares;
  } catch (err) {
    console.error('Error fetching lugares:', err.message);
    throw err;
  }
}

export async function deleteLugar(lugar) {
  try {
    console.log('Deleting lugar from Firestore:', lugar);
    const q = query(collection(db, 'lugares'), where('nombre', '==', lugar));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      console.log('No matching lugar found');
      return;
    }
    const deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    console.log('Lugar deleted successfully');
  } catch (err) {
    console.error('Error deleting lugar:', err.message);
    throw err;
  }
}

export async function uploadRecibo(file) {
  try {
    console.log('Uploading recibo to Storage:', file.name);
    const storageRef = ref(storage, `recibos/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    console.log('Recibo uploaded, URL:', url);
    return url;
  } catch (err) {
    console.error('Error uploading recibo:', err.message);
    throw err;
  }
}
