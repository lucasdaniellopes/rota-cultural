import styled, { keyframes } from 'styled-components';
import { Star, ThumbsUp, User, Calendar, Loader, AlertTriangle, PenLine, Edit, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { reviewsService, type Review } from '@/services/reviews';
import { useAuth } from '@/contexts/AuthContext';

// --- Animations ---
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

// --- Styled Components ---

const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: #ffffff;
  font-family: 'Inter', sans-serif;
  color: #1a1a1a;
`;

// Header
const HeaderSection = styled.header`
  background-color: #f8f8f8;
  padding: 3rem 1.5rem 2rem 1.5rem;
  border-bottom: 1px solid #e0e0e0;
`;

const HeaderContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 0.5rem 0;
`;

const PageSubtitle = styled.p`
  font-size: 1rem;
  color: #666666;
  margin: 0;
`;

// Content Layout
const ContentSection = styled.main`
  padding: 3rem 1.5rem;
`;

const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 2rem;
  animation: ${fadeIn} 0.4s ease-out;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

// Cards (General)
const DarkCard = styled.div`
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`;

// Rating Summary Component
const AverageRatingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 1.5rem;
`;

const BigRating = styled.div`
  font-size: 3.5rem;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1;
`;

const RatingOutOf = styled.div`
  font-size: 0.9rem;
  color: #999999;
`;

const StarRow = styled.div`
  display: flex;
  gap: 0.25rem;
  color: #eab308; /* Yellow-500 */
`;

const TotalReviews = styled.div`
  font-size: 0.85rem;
  color: #666666;
  margin-top: 0.25rem;
`;

// Distribution Bars
const DistributionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
`;

const DistributionLabel = styled.span`
  font-size: 0.85rem;
  color: #666666;
  min-width: 35px;
`;

const ProgressBarBg = styled.div`
  flex: 1;
  height: 6px;
  background-color: #e0e0e0;
  border-radius: 3px;
  overflow: hidden;
`;

const ProgressBarFill = styled.div<{ $percent: number }>`
  height: 100%;
  width: ${props => props.$percent}%;
  background-color: #eab308;
  border-radius: 3px;
  transition: width 0.5s ease-out;
`;

const DistributionCount = styled.span`
  font-size: 0.85rem;
  color: #999999;
  min-width: 25px;
  text-align: right;
`;

// Action Buttons
const WriteReviewButton = styled.button`
  width: 100%;
  padding: 1rem;
  background-color: #0052cc;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, background-color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-2px);
    background-color: #0043a8;
  }
`;

// Form Styling
const FormTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 1rem 0;
`;

const FormGroup = styled.div`
  margin-bottom: 1.25rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.9rem;
  color: #666666;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  background-color: #ffffff;
  border: 1px solid #d0d0d0;
  border-radius: 6px;
  color: #1a1a1a;
  font-size: 0.95rem;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #0052cc;
    box-shadow: 0 0 0 3px rgba(0, 82, 204, 0.1);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  background-color: #ffffff;
  border: 1px solid #d0d0d0;
  border-radius: 6px;
  color: #1a1a1a;
  font-size: 0.95rem;
  resize: vertical;
  min-height: 100px;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #0052cc;
    box-shadow: 0 0 0 3px rgba(0, 82, 204, 0.1);
  }
`;

const StarInputContainer = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const StarButton = styled.button<{ $active: boolean }>`
  background: transparent;
  border: 1px solid ${props => props.$active ? '#eab308' : '#d0d0d0'};
  color: ${props => props.$active ? '#eab308' : '#999999'};
  padding: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #eab308;
    color: #eab308;
  }
`;

const CharCount = styled.div`
  text-align: right;
  font-size: 0.8rem;
  color: #999999;
  margin-top: 0.25rem;
`;

const FormActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const SubmitButton = styled.button`
  flex: 1;
  padding: 0.75rem;
  background-color: #0052cc;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover { background-color: #0043a8; }
`;

const CancelButton = styled.button`
  flex: 1;
  padding: 0.75rem;
  background-color: transparent;
  color: #666666;
  border: 1px solid #d0d0d0;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover { border-color: #999999; color: #1a1a1a; background-color: #f5f5f5; }
`;

// Reviews List Header
const ListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const ListTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  color: #1a1a1a;
`;

const SortSelect = styled.select`
  background-color: #ffffff;
  color: #1a1a1a;
  border: 1px solid #d0d0d0;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;

  &:focus { outline: none; border-color: #0052cc; }
`;

// Review Item
const ReviewCard = styled(DarkCard)`
  transition: border-color 0.2s, box-shadow 0.2s;
  &:hover { border-color: #0052cc; box-shadow: 0 4px 12px rgba(0, 82, 204, 0.1); }
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const ReviewerInfo = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666666;
`;

const ReviewerName = styled.div`
  font-weight: 600;
  color: #1a1a1a;
  font-size: 0.95rem;
`;

const ReviewDate = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.8rem;
  color: #999999;
  margin-top: 0.2rem;
`;

const ReviewTitle = styled.h4`
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: #1a1a1a;
`;

const ReviewComment = styled.p`
  font-size: 0.95rem;
  color: #4a4a4a;
  line-height: 1.6;
  margin: 0 0 1.5rem 0;
`;

const HelpfulButton = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: ${props => props.$active ? '#f0f0f0' : 'transparent'};
  border: 1px solid ${props => props.$active ? '#0052cc' : '#d0d0d0'};
  border-radius: 6px;
  color: ${props => props.$active ? '#0052cc' : '#666666'};
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #f0f0f0;
    border-color: #0052cc;
    color: #0052cc;
  }
`;

// Loading / Error
const CenterState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  color: #999999;
  text-align: center;
  padding: 2rem;
`;

// --- Logic ---

function ReviewsPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newReview, setNewReview] = useState({
    title: '',
    comment: '',
    rating: 5,
  });

  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [sortBy, setSortBy] = useState<'recent' | 'helpful' | 'rating'>('recent');
  const [helpfulReviews, setHelpfulReviews] = useState<Set<number>>(new Set());

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      setIsLoading(true);
      const data = await reviewsService.getReviews();
      setReviews(data);
      
      const helpfulSet = new Set<number>();
      data.forEach(r => {
        if (r.is_helpful) helpfulSet.add(r.id);
      });
      setHelpfulReviews(helpfulSet);
    } catch (err) {
      console.error('Error loading reviews:', err);
      setError('Falha ao carregar avaliações.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (review: Review) => {
    setEditingReview(review);
    setNewReview({
      title: review.title,
      comment: review.comment,
      rating: review.rating,
    });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (reviewId: number) => {
    if (!confirm('Tem certeza que deseja excluir esta avaliação?')) return;

    try {
      await reviewsService.deleteReview(reviewId);
      setReviews(reviews.filter(r => r.id !== reviewId));
    } catch (err) {
      console.error('Error deleting review:', err);
      alert('Erro ao excluir avaliação. Tente novamente.');
    }
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
    : '0.0';

  const ratingDistribution = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: reviews.filter(r => r.rating === 3).length,
    2: reviews.filter(r => r.rating === 2).length,
    1: reviews.filter(r => r.rating === 1).length,
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/entrar');
      return;
    }

    if (!newReview.title.trim() || !newReview.comment.trim()) {
      alert('Por favor, preencha todos os campos');
      return;
    }

    try {
      if (isEditing && editingReview) {
        const updatedReview = await reviewsService.updateReview(editingReview.id, {
          title: newReview.title,
          comment: newReview.comment,
          rating: newReview.rating,
        });
        setReviews(reviews.map(r => r.id === editingReview.id ? updatedReview : r));
        setEditingReview(null);
        setIsEditing(false);
      } else {
        const createdReview = await reviewsService.createReview({
          title: newReview.title,
          comment: newReview.comment,
          rating: newReview.rating,
          content_type: null, 
          object_id: null,
        });
        setReviews([createdReview, ...reviews]);
      }
      setNewReview({ title: '', comment: '', rating: 5 });
      setShowForm(false);
    } catch (err) {
      console.error('Error submitting review:', err);
      alert('Erro ao enviar avaliação. Tente novamente.');
    }
  };

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === 'recent') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    if (sortBy === 'helpful') return (b.helpful_count || 0) - (a.helpful_count || 0);
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  const toggleHelpful = async (reviewId: number) => {
    if (!isAuthenticated) {
      navigate('/entrar');
      return;
    }

    try {
      const result = await reviewsService.markHelpful(reviewId);
      
      const newHelpful = new Set(helpfulReviews);
      if (result.status === 'marked') {
        newHelpful.add(reviewId);
      } else {
        newHelpful.delete(reviewId);
      }
      setHelpfulReviews(newHelpful);

      setReviews(prev => prev.map(r => 
        r.id === reviewId 
          ? { ...r, helpful_count: result.helpful_count }
          : r
      ));
    } catch (err) {
      console.error('Error toggling helpful:', err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const renderStars = (rating: number) => (
    <StarRow>
      {[1, 2, 3, 4, 5].map(star => (
        <Star
          key={star}
          size={16}
          fill={star <= rating ? 'currentColor' : 'none'}
          color={star <= rating ? '#eab308' : '#444'}
        />
      ))}
    </StarRow>
  );

  return (
    <PageWrapper>
      <Navbar />

      <HeaderSection>
        <HeaderContainer>
          <PageTitle>Avaliações da Rota Cultural</PageTitle>
          <PageSubtitle>Compartilhe sua experiência e ajude a melhorar nossa plataforma</PageSubtitle>
        </HeaderContainer>
      </HeaderSection>

      <ContentSection>
        <ContentContainer>
          {isLoading ? (
            <CenterState>
              <Loader size={40} style={{ animation: 'spin 1s linear infinite' }} />
              <p>Carregando avaliações...</p>
            </CenterState>
          ) : error ? (
            <CenterState>
              <AlertTriangle size={40} color="#ef4444" />
              <p>{error}</p>
            </CenterState>
          ) : (
            <MainGrid>
              {/* Left Column: Stats & Form */}
              <LeftColumn>
                <DarkCard>
                  <AverageRatingContainer>
                    <BigRating>{averageRating}</BigRating>
                    <RatingOutOf>de 5</RatingOutOf>
                    {renderStars(Math.round(parseFloat(averageRating)))}
                    <TotalReviews>
                      {reviews.length} {reviews.length === 1 ? 'avaliação' : 'avaliações'}
                    </TotalReviews>
                  </AverageRatingContainer>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {[5, 4, 3, 2, 1].map(rating => (
                      <DistributionRow key={rating}>
                        <DistributionLabel>{rating} ★</DistributionLabel>
                        <ProgressBarBg>
                          <ProgressBarFill 
                            $percent={reviews.length > 0 
                              ? (ratingDistribution[rating as keyof typeof ratingDistribution] / reviews.length) * 100 
                              : 0} 
                          />
                        </ProgressBarBg>
                        <DistributionCount>
                          {ratingDistribution[rating as keyof typeof ratingDistribution]}
                        </DistributionCount>
                      </DistributionRow>
                    ))}
                  </div>
                </DarkCard>

                {!showForm ? (
                  <WriteReviewButton onClick={() => isAuthenticated ? setShowForm(true) : navigate('/entrar')}>
                    <PenLine size={18} /> Escrever Avaliação
                  </WriteReviewButton>
                ) : (
                  <DarkCard>
                    <FormTitle>{isEditing ? 'Editar Avaliação' : 'Sua Avaliação'}</FormTitle>
                    <form onSubmit={handleSubmitReview}>
                      <FormGroup>
                        <Label>Classificação</Label>
                        <StarInputContainer>
                          {[1, 2, 3, 4, 5].map(star => (
                            <StarButton
                              key={star}
                              type="button"
                              $active={star <= newReview.rating}
                              onClick={() => setNewReview({ ...newReview, rating: star })}
                            >
                              <Star size={24} fill={star <= newReview.rating ? 'currentColor' : 'none'} />
                            </StarButton>
                          ))}
                        </StarInputContainer>
                      </FormGroup>

                      <FormGroup>
                        <Label>Título</Label>
                        <Input 
                          type="text"
                          placeholder="Resumo da sua experiência"
                          value={newReview.title}
                          onChange={e => setNewReview({ ...newReview, title: e.target.value })}
                          maxLength={60}
                        />
                      </FormGroup>

                      <FormGroup>
                        <Label>Comentário</Label>
                        <TextArea
                          placeholder="Conte mais detalhes..."
                          value={newReview.comment}
                          onChange={e => setNewReview({ ...newReview, comment: e.target.value })}
                          maxLength={500}
                          rows={5}
                        />
                        <CharCount>{newReview.comment.length}/500</CharCount>
                      </FormGroup>

                      <FormActions>
                        <CancelButton type="button" onClick={() => {
                          setShowForm(false);
                          setEditingReview(null);
                          setIsEditing(false);
                          setNewReview({ title: '', comment: '', rating: 5 });
                        }}>
                          Cancelar
                        </CancelButton>
                        <SubmitButton type="submit">
                          {isEditing ? 'Atualizar Avaliação' : 'Enviar Avaliação'}
                        </SubmitButton>
                      </FormActions>
                    </form>
                  </DarkCard>
                )}
              </LeftColumn>

              {/* Right Column: List */}
              <RightColumn>
                <ListHeader>
                  <ListTitle>Avaliações de Usuários</ListTitle>
                  <SortSelect 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                  >
                    <option value="recent">Mais Recentes</option>
                    <option value="helpful">Mais Úteis</option>
                    <option value="rating">Melhor Avaliadas</option>
                  </SortSelect>
                </ListHeader>

                {sortedReviews.length === 0 ? (
                  <CenterState style={{ minHeight: '200px' }}>
                    <p>Nenhuma avaliação encontrada. Seja o primeiro a avaliar!</p>
                  </CenterState>
                ) : (
                  sortedReviews.map(review => (
                    <ReviewCard key={review.id}>
                      <ReviewHeader>
                        <ReviewerInfo>
                          <Avatar><User size={20} /></Avatar>
                          <div>
                            <ReviewerName>{review.user_name}</ReviewerName>
                            <ReviewDate>
                              <Calendar size={12} /> {formatDate(review.created_at)}
                            </ReviewDate>
                          </div>
                        </ReviewerInfo>
                        {renderStars(review.rating)}
                      </ReviewHeader>

                      <ReviewTitle>{review.title}</ReviewTitle>
                      <ReviewComment>{review.comment}</ReviewComment>

                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <HelpfulButton 
                          $active={helpfulReviews.has(review.id)}
                          onClick={() => toggleHelpful(review.id)}
                        >
                          <ThumbsUp size={14} />
                          Útil ({review.helpful_count || 0})
                        </HelpfulButton>
                        {user && user.id === review.user && (
                          <>
                            <HelpfulButton 
                              as="button"
                              $active={false}
                              onClick={() => handleEdit(review)}
                              style={{ backgroundColor: '#f0f0f0', borderColor: '#0052cc', color: '#0052cc' }}
                            >
                              <Edit size={14} />
                              Editar
                            </HelpfulButton>
                            <HelpfulButton 
                              as="button"
                              $active={false}
                              onClick={() => handleDelete(review.id)}
                              style={{ backgroundColor: '#fee2e2', borderColor: '#ef4444', color: '#ef4444' }}
                            >
                              <Trash2 size={14} />
                              Excluir
                            </HelpfulButton>
                          </>
                        )}
                      </div>
                    </ReviewCard>
                  ))
                )}
              </RightColumn>
            </MainGrid>
          )}
        </ContentContainer>
      </ContentSection>
    </PageWrapper>
  );
}

export default ReviewsPage;