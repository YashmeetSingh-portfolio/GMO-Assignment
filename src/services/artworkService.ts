import { type ArtPiece } from '../types/art';

const BASE_URL = 'https://api.artic.edu/api/v1/artworks';
const FIELDS = 'id,title,place_of_origin,artist_display,inscriptions,date_start,date_end';
const LIMIT = 12;

export const fetchPaginatedArtworks = async (pg: number) => {
    const endpoint = `${BASE_URL}?page=${pg}&limit=${LIMIT}&fields=${FIELDS}`;
    const res = await fetch(endpoint);
    if (!res.ok) {
        throw new Error('fetchPaginatedArtworks: request failed');
    }
    return res.json();
};

export const fetchBulkArtworks = async (howMany: number): Promise<ArtPiece[]> => {
    const numPages = Math.ceil(howMany / LIMIT);
    const fetches = [];

    for (let p = 1; p <= numPages; p++) {
        const u = `${BASE_URL}?page=${p}&limit=${LIMIT}&fields=${FIELDS}`;
        const req = fetch(u).then(r => {
            if (!r.ok) throw new Error(`page ${p} failed`);
            return r.json();
        });
        fetches.push(req);
    }

    const results = await Promise.all(fetches);
    const combined = results.flatMap(r => r.data);
    return combined.slice(0, howMany);
};
