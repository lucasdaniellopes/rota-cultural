import { useState, useEffect } from 'react';
import { favoritesService } from '@/services/favorites';
import { useAuth } from '@/contexts/AuthContext';

export function useFavorite(objectId: number, contentTypeName: 'event' | 'touristspot') {
  const { isAuthenticated } = useAuth();
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [contentTypeId, setContentTypeId] = useState<number | null>(null);

  // Get content type ID on mount
  useEffect(() => {
    const fetchContentTypeId = async () => {
      try {
        const id = await favoritesService.getContentTypeId(contentTypeName);
        setContentTypeId(id);
      } catch (err) {
        console.error('Error fetching content type:', err);
      }
    };

    if (isAuthenticated) {
      fetchContentTypeId();
    }
  }, [isAuthenticated, contentTypeName]);

  // Check if item is favorited
  useEffect(() => {
    if (!isAuthenticated || contentTypeId === null) {
      setIsFavorited(false);
      return;
    }

    const checkFavorite = async () => {
      try {
        const result = await favoritesService.checkFavorite(contentTypeId, objectId);
        setIsFavorited(result);
      } catch (err) {
        console.error('Error checking favorite:', err);
      }
    };

    checkFavorite();
  }, [objectId, contentTypeId, isAuthenticated]);

  const toggleFavorite = async () => {
    if (!isAuthenticated || contentTypeId === null) return;

    setIsLoading(true);
    try {
      if (isFavorited) {
        // Get favorite ID and remove
        const favorites = await favoritesService.getFavorites();
        const favorite = favorites.find(
          fav =>
            fav.favoritable_type === contentTypeName &&
            fav.object_id === objectId
        );
        if (favorite) {
          await favoritesService.removeFavorite(favorite.id);
        }
      } else {
        // Add to favorites
        await favoritesService.addFavorite(contentTypeId, objectId);
      }
      setIsFavorited(!isFavorited);
    } catch (err) {
      console.error('Error toggling favorite:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return { isFavorited, toggleFavorite, isLoading };
}
