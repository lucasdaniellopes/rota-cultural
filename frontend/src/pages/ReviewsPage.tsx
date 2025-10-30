import { Star, ThumbsUp, User, Calendar } from 'lucide-react';
import { useState } from 'react';
import Navbar from '../components/Navbar';
import styles from '../styles/ReviewsPage.module.css';

interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  helpful: number;
  avatar?: string;
}

function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: '1',
      author: 'João Silva',
      rating: 5,
      date: '15 de Outubro de 2025',
      title: 'Excelente plataforma!',
      comment: 'Encontrei os melhores roteiros da cidade! A interface é intuitiva e as informações são muito úteis. Com certeza vou usar novamente.',
      helpful: 24,
    },
    {
      id: '2',
      author: 'Maria Santos',
      rating: 4,
      date: '12 de Outubro de 2025',
      title: 'Muito bom, com pequenas melhorias',
      comment: 'O mapa é funcional e ajuda bastante a se locomover pela cidade. Gostaria que tivesse mais eventos cadastrados.',
      helpful: 18,
    },
    {
      id: '3',
      author: 'Pedro Gomes',
      rating: 5,
      date: '10 de Outubro de 2025',
      title: 'Perfeito para turistas',
      comment: 'Eu e minha família usamos para planejar nossa viagem e foi essencial! Todos os pontos turísticos estão bem marcados.',
      helpful: 32,
    },
  ]);

  const [newReview, setNewReview] = useState({
    title: '',
    comment: '',
    rating: 5,
  });

  const [showForm, setShowForm] = useState(false);
  const [sortBy, setSortBy] = useState<'recent' | 'helpful' | 'rating'>('recent');
  const [helpfulReviews, setHelpfulReviews] = useState<Set<string>>(new Set(['1', '3']));

  const averageRating = (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1);
  const ratingDistribution = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: reviews.filter(r => r.rating === 3).length,
    2: reviews.filter(r => r.rating === 2).length,
    1: reviews.filter(r => r.rating === 1).length,
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newReview.title.trim() || !newReview.comment.trim()) {
      alert('Por favor, preencha todos os campos');
      return;
    }

    const review: Review = {
      id: String(reviews.length + 1),
      author: 'Você',
      rating: newReview.rating,
      date: new Date().toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      title: newReview.title,
      comment: newReview.comment,
      helpful: 0,
    };

    setReviews([review, ...reviews]);
    setNewReview({ title: '', comment: '', rating: 5 });
    setShowForm(false);
  };

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === 'recent') return 0;
    if (sortBy === 'helpful') return b.helpful - a.helpful;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  const renderStars = (rating: number) => {
    return (
      <div className={styles['stars']}>
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            size={16}
            className={star <= rating ? styles['star-filled'] : styles['star-empty']}
            fill={star <= rating ? 'currentColor' : 'none'}
          />
        ))}
      </div>
    );
  };

  const toggleHelpful = (reviewId: string) => {
    const newHelpful = new Set(helpfulReviews);
    if (newHelpful.has(reviewId)) {
      newHelpful.delete(reviewId);
    } else {
      newHelpful.add(reviewId);
    }
    setHelpfulReviews(newHelpful);
  };

  return (
    <div>
      <Navbar isAuthenticated={true} />

      <section className={styles['header-section']}>
        <div className={styles['header-container']}>
          <div>
            <h1 className={styles['header-title']}>Avaliações da Rota Cultural</h1>
            <p className={styles['header-subtitle']}>Compartilhe sua experiência e ajude a melhorar nossa plataforma</p>
          </div>
        </div>
      </section>

      <section className={styles['content-section']}>
        <div className={styles['content-container']}>
          <div className={styles['main-grid']}>
            {/* Coluna Esquerda - Stats e Novo Review */}
            <div className={styles['left-column']}>
              {/* Rating Summary */}
              <div className={styles['rating-summary']}>
                <div className={styles['average-rating']}>
                  <div className={styles['big-rating']}>{averageRating}</div>
                  <div className={styles['rating-out-of']}>de 5</div>
                  {renderStars(Math.round(parseFloat(averageRating)))}
                  <div className={styles['total-reviews']}>
                    {reviews.length} {reviews.length === 1 ? 'avaliação' : 'avaliações'}
                  </div>
                </div>

                {/* Rating Distribution */}
                <div className={styles['rating-distribution']}>
                  {[5, 4, 3, 2, 1].map(rating => (
                    <div key={rating} className={styles['distribution-row']}>
                      <span className={styles['distribution-label']}>{rating} ⭐</span>
                      <div className={styles['distribution-bar']}>
                        <div
                          className={styles['distribution-fill']}
                          style={{
                            width: `${(ratingDistribution[rating as keyof typeof ratingDistribution] / reviews.length) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <span className={styles['distribution-count']}>
                        {ratingDistribution[rating as keyof typeof ratingDistribution]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* New Review Form */}
              {!showForm ? (
                <button
                  className={styles['write-review-btn']}
                  onClick={() => setShowForm(true)}
                >
                  ✏️ Escrever uma Avaliação
                </button>
              ) : (
                <form className={styles['review-form']} onSubmit={handleSubmitReview}>
                  <h3 className={styles['form-title']}>Sua Avaliação</h3>

                  <div className={styles['form-group']}>
                    <label className={styles['form-label']}>Classificação</label>
                    <div className={styles['rating-input']}>
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          type="button"
                          className={`${styles['rating-btn']} ${
                            star <= newReview.rating ? styles['active'] : ''
                          }`}
                          onClick={() => setNewReview({ ...newReview, rating: star })}
                        >
                          <Star size={28} fill="currentColor" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className={styles['form-group']}>
                    <label className={styles['form-label']}>Título</label>
                    <input
                      type="text"
                      className={styles['form-input']}
                      placeholder="Resumo da sua avaliação"
                      value={newReview.title}
                      onChange={e => setNewReview({ ...newReview, title: e.target.value })}
                      maxLength={60}
                    />
                  </div>

                  <div className={styles['form-group']}>
                    <label className={styles['form-label']}>Comentário</label>
                    <textarea
                      className={styles['form-textarea']}
                      placeholder="Compartilhe sua experiência..."
                      value={newReview.comment}
                      onChange={e => setNewReview({ ...newReview, comment: e.target.value })}
                      maxLength={500}
                      rows={5}
                    ></textarea>
                    <div className={styles['char-count']}>
                      {newReview.comment.length}/500
                    </div>
                  </div>

                  <div className={styles['form-actions']}>
                    <button
                      type="submit"
                      className={styles['submit-btn']}
                    >
                      Enviar Avaliação
                    </button>
                    <button
                      type="button"
                      className={styles['cancel-btn']}
                      onClick={() => setShowForm(false)}
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Coluna Direita - Reviews List */}
            <div className={styles['right-column']}>
              <div className={styles['reviews-header']}>
                <h2 className={styles['reviews-title']}>Avaliações de Usuários</h2>
                <select
                  className={styles['sort-select']}
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as 'recent' | 'helpful' | 'rating')}
                >
                  <option value="recent">Mais Recentes</option>
                  <option value="helpful">Mais Úteis</option>
                  <option value="rating">Melhor Avaliadas</option>
                </select>
              </div>

              <div className={styles['reviews-list']}>
                {sortedReviews.map(review => (
                  <div key={review.id} className={styles['review-card']}>
                    <div className={styles['review-header']}>
                      <div className={styles['reviewer-info']}>
                        <div className={styles['reviewer-avatar']}>
                          <User size={20} />
                        </div>
                        <div>
                          <div className={styles['reviewer-name']}>{review.author}</div>
                          <div className={styles['review-date']}>
                            <Calendar size={13} />
                            {review.date}
                          </div>
                        </div>
                      </div>
                      {renderStars(review.rating)}
                    </div>

                    <h4 className={styles['review-title']}>{review.title}</h4>
                    <p className={styles['review-comment']}>{review.comment}</p>

                    <div className={styles['review-footer']}>
                      <button 
                        className={`${styles['helpful-btn']} ${helpfulReviews.has(review.id) ? styles['helpful-active'] : ''}`}
                        onClick={() => toggleHelpful(review.id)}
                      >
                        <ThumbsUp size={16} />
                        Útil ({review.helpful})
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ReviewsPage;
