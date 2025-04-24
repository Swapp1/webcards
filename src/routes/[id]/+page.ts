import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { getSpecificCard } from '$lib/firebase';


export const load: PageLoad = async ({ params }) => {

    const cardDetails = await getSpecificCard(params.id)

    if (cardDetails.exists()) {
        return {
            params: params.id,
            card: cardDetails.data(),
        }
    }

    error(404, 'Not found');

};