import { db } from "$lib/config/firebase"
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore"

export const getAllCards = async () => {
    const cards = await getDocs(collection(db, 'cards'))
    return cards.docs.map(doc => doc.data())
}

export const getCardsAccordingByOwnerId = async (id: string) => {
    const q = query(collection(db, 'cards'), where('ownerId', '==', id))
    const cards = await getDocs(q)
    return cards.docs.map(doc => doc.data())
}

export const getSpecificCard = async (id: string) => {
    const q = query(collection(db, 'cards'), where('personalizedLink', '==', id));
    const cards = await getDocs(q);
    return cards;
}