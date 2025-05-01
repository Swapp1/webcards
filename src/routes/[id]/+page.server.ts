import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { getSpecificCard } from '$lib/firebase';

export const load: PageLoad = async ({ params }) => {
    const cardDetails = await getSpecificCard(params.id)

    if (!cardDetails.empty) {

        const doc = cardDetails.docs[0];
        return {
            params: params.id,
            card: doc.data(),
        }
    }
    throw error(404, 'Not found');
};
