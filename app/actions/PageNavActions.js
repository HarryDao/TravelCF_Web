import { PAGE_NAV_CHANGED } from './types';

export const pageNavChange = (page) => {
    return { type: PAGE_NAV_CHANGED, payload: page };
}