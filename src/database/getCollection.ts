import { app } from './connection';
import {
    getFirestore, collection
} from 'firebase/firestore';

// init services
export const db = getFirestore(app);

// collection ref
export const booksCollection = collection(db, 'books');
export const recipesCollection = collection(db, 'recipes');
