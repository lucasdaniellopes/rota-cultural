import { api } from './api';

export interface Review {
  id: number;
  user: number;
  user_name: string;
  reviewable_type: string;
  reviewable_name: string;
  object_id: number | null;
  title: string;
  rating: number;
  comment: string;
  helpful_count: number;
  created_at: string;
  is_helpful?: boolean;
}

export interface ReviewCreate {
  title: string;
  rating: number;
  comment: string;
  content_type?: number | null;
  object_id?: number | null;
}

export const reviewsService = {
  async getReviews(params?: { content_type?: string; object_id?: number }): Promise<Review[]> {
    const response = await api.get('/reviews/', { params });
    return Array.isArray(response.data) ? response.data : response.data.results || [];
  },

  async createReview(data: ReviewCreate): Promise<Review> {
    const response = await api.post('/reviews/', data);
    return response.data;
  },

  async updateReview(id: number, data: Partial<ReviewCreate>): Promise<Review> {
    const response = await api.put(`/reviews/${id}/`, data);
    return response.data;
  },

  async deleteReview(id: number): Promise<void> {
    await api.delete(`/reviews/${id}/`);
  },

  async markHelpful(reviewId: number): Promise<{ status: string; helpful_count: number }> {
    const response = await api.post(`/reviews/${reviewId}/mark_helpful/`);
    return response.data;
  },
  
  async getMyReviews(): Promise<Review[]> {
      const response = await api.get('/reviews/my-reviews/');
      return Array.isArray(response.data) ? response.data : response.data.results || [];
  }
};
