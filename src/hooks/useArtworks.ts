import { useEffect, useState } from 'react';
import { fetchPaginatedArtworks } from '../services/artworkService';
import { type ArtPiece } from '../types/art';

export const useArtworks = (pageNumber: number) => {
    const [artworks, setArtworks] = useState<ArtPiece[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        const getArt = async () => {
            setLoading(true);
            setError(null);

            try {
                const res = await fetchPaginatedArtworks(pageNumber);
                setArtworks(res.data);
                setTotalCount(res.pagination.total);
            } catch (err) {
                console.error('Error during fetch:', err);
                setError('Something went wrong while loading artworks.');
            } finally {
                setLoading(false);
            }
        };

        getArt();
    }, [pageNumber]);

    return {
        artList: artworks,
        totalItems: totalCount,
        isBusy: loading,
        fetchError: error
    };
};
