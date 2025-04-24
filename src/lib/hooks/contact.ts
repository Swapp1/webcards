import type { SwappsTypes } from "$lib/types/cards";

export const getContact = (swapps: SwappsTypes[]) => {
    return swapps.filter(value => value.title === 'Phone number' || value.title === 'Email').map((value) => {
        if (value.title === 'Phone number') {
            return `tel:${value.detail}`
        }
        if (value.title === 'Email' || value.title === 'Gmail') {
            return `mailto:${value.detail}`
        }
    })[0]
}