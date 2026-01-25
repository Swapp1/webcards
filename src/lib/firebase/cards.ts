import { db } from "$lib/config/firebase"
import { collection, getDocs, query, where, addDoc, serverTimestamp } from "firebase/firestore"

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

export interface LeadData {
    name: string;
    email: string;
    phone?: string;
    job?: string;
}

export const submitLead = async (ownerId: string, cardId: string, leadData: LeadData) => {
    const leadDoc = await addDoc(collection(db, 'leads'), {
        ownerId,
        cardId,
        ...leadData,
        createdAt: serverTimestamp(),
    });
    return leadDoc.id;
}