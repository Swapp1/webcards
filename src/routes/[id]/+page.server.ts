import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getSpecificCard } from '$lib/firebase';
import type { CardData } from '$lib/types/cards';

export const load: PageServerLoad = async ({ params }) => {
    const cardDetails = await getSpecificCard(params.id);

    if (!cardDetails.empty) {
        const doc = cardDetails.docs[0];
        return {
            params: params.id,
            card: doc.data() as CardData,
        };
    }
    throw error(404, 'Not found');
};
