import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, DollarSign, Heart, ArrowLeft, Accessibility, AlertTriangle, Loader } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { eventsService, type Event } from '@/services/events';
import { useAuth } from '@/contexts/AuthContext';
import styles from '@/styles/EventDetailPage.module.css';

function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadEvent();
    }
  }, [id]);

  const loadEvent = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await eventsService.getEventById(parseInt(id!));
      setEvent(data);
    } catch (err: any) {
      console.error('Error loading event:', err);
      setError('Falha ao carregar evento. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const formatTime = (timeString: string) => {
    return timeString.slice(0, 5); // HH:MM
  };

  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    if (numPrice === 0) return 'Gratuito';
    return `R$ ${numPrice.toFixed(2).replace('.', ',')}`;
  };

  if (isLoading) {
    return (
      <div>
        <Navbar />
        <div className={styles['loading-container']}>
          <Loader size={48} className={styles['loader']} />
          <p>Carregando evento...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div>
        <Navbar />
        <div className={styles['not-found-container']}>
          <AlertTriangle size={48} />
          <h1>Evento não encontrado</h1>
          <p>{error || 'O evento que você procura não existe ou foi removido.'}</p>
          <button onClick={() => navigate('/eventos')} className={styles['back-btn']}>
            <ArrowLeft size={18} />
            Voltar para Eventos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      {/* Hero Section */}
      <div className={styles['hero-section']}>
        {event.image_url ? (
          <img src={event.image_url} alt={event.name} className={styles['hero-image']} />
        ) : (
          <div className={styles['hero-placeholder']}>
            <MapPin size={64} />
          </div>
        )}
        <button onClick={() => navigate('/eventos')} className={styles['back-button']}>
          <ArrowLeft size={20} />
        </button>
      </div>

      {/* Main Content */}
      <div className={styles['container']}>
        {/* Header */}
        <div className={styles['header']}>
          <div>
            <span className={styles['category-badge']}>{event.category_name || 'Evento'}</span>
            <h1 className={styles['title']}>{event.name}</h1>
          </div>
          <button
            className={`${styles['favorite-btn']} ${isFavorited ? styles.active : ''}`}
            onClick={() => setIsFavorited(!isFavorited)}
            title={isFavorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            disabled={!isAuthenticated}
          >
            <Heart size={24} fill={isFavorited ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Info Grid */}
        <div className={styles['info-grid']}>
          <div className={styles['info-item']}>
            <Calendar size={20} />
            <div>
              <p className={styles['label']}>Data Início</p>
              <p className={styles['value']}>{formatDate(event.start_date)}</p>
            </div>
          </div>

          <div className={styles['info-item']}>
            <Clock size={20} />
            <div>
              <p className={styles['label']}>Horário</p>
              <p className={styles['value']}>{formatTime(event.start_time)} - {formatTime(event.end_time)}</p>
            </div>
          </div>

          <div className={styles['info-item']}>
            <DollarSign size={20} />
            <div>
              <p className={styles['label']}>Entrada</p>
              <p className={styles['value']}>{formatPrice(event.price)}</p>
            </div>
          </div>

          <div className={styles['info-item']}>
            <MapPin size={20} />
            <div>
              <p className={styles['label']}>Local</p>
              <p className={styles['value']}>{event.location_name || 'Local não especificado'}</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <section className={styles['section']}>
          <h2>Sobre</h2>
          <p className={styles['description']}>{event.description}</p>
        </section>

        {/* Accessibility */}
        {event.accessibility && (
          <section className={styles['section']}>
            <div className={styles['section-header']}>
              <Accessibility size={20} />
              <h2>Acessibilidade</h2>
            </div>
            <p className={styles['text']}>{event.accessibility}</p>
          </section>
        )}

        {/* Map */}
        <section className={styles['section']}>
          <h2>Localização</h2>
          <div className={styles['map-placeholder']}>
            <MapPin size={40} />
            <p>{event.location_name || 'Local não especificado'}</p>
            <button className={styles['map-btn']} onClick={() => navigate('/mapa')}>
              Ver no Mapa
            </button>
          </div>
        </section>

        {/* CTA */}
        <div className={styles['cta-section']}>
          <button className={styles['primary-btn']} onClick={() => navigate('/mapa')}>
            Como Chegar
          </button>
          <button className={styles['secondary-btn']} disabled>
            Comprar Ingresso (em breve)
          </button>
        </div>
      </div>
    </div>
  );
}

export default EventDetailPage;
