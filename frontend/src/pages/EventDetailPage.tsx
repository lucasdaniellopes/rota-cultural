import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, DollarSign, Heart, ArrowLeft, Accessibility } from 'lucide-react';
import Navbar from '@/components/Navbar';
import styles from '@/styles/EventDetailPage.module.css';

interface Event {
  id: string;
  title: string;
  image: string;
  description: string;
  date: string;
  time: string;
  location: string;
  price: string;
  category: string;
  accessibility?: string;
}

function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isFavorited, setIsFavorited] = useState(false);

  const events: { [key: string]: Event } = {
    motofest: {
      id: 'motofest',
      title: 'MotoFest',
      image: '/MotoFest.png',
      description: 'Festival de motociclismo com música, gastronomia e apresentações locais.',
      date: '30/08/2025',
      time: '18:00 - 23:00',
      location: 'Patos - PB',
      price: 'Gratuito',
      category: 'Música',
      accessibility: 'Acesso para cadeirantes, banheiros acessíveis e estacionamento reservado',
    },
    terreirinho: {
      id: 'terreirinho',
      title: 'Terreirinho',
      image: '/Terreirinho.png',
      description: 'Espaço ecológico com apresentações culturais e shows acústicos.',
      date: '15/09/2025',
      time: '18:00 - 23:00',
      location: 'Patos - PB',
      price: 'R$ 25,00',
      category: 'Cultural',
      accessibility: 'Área com grama, banheiros simples, sem acesso específico para cadeirantes',
    },
    'sao-joao': {
      id: 'sao-joao',
      title: 'São João de Patos',
      image: '/SãoJoão.png',
      description: 'Grande festa junina com forró, comidas típicas nordestinas e muita diversão.',
      date: '23/06/2025',
      time: '18:00 - 23:00',
      location: 'Patos - PB',
      price: 'R$ 30,00',
      category: 'Festas Populares',
      accessibility: 'Acesso para cadeirantes em áreas específicas, estrutura de sinalização',
    },
  };

  const event = events[id || ''];

  if (!event) {
    return (
      <div className={styles['not-found']}>
        <Navbar isAuthenticated={true} />
        <div className={styles['not-found-container']}>
          <h1>Evento não encontrado</h1>
          <button onClick={() => navigate('/eventos')} className={styles['back-btn']}>
            Voltar para Eventos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar isAuthenticated={true} />

      {/* Hero Section */}
      <div className={styles['hero-section']}>
        <img src={event.image} alt={event.title} className={styles['hero-image']} />
        <button onClick={() => navigate('/eventos')} className={styles['back-button']}>
          <ArrowLeft size={20} />
        </button>
      </div>

      {/* Main Content */}
      <div className={styles['container']}>
        {/* Header */}
        <div className={styles['header']}>
          <div>
            <span className={styles['category-badge']}>{event.category}</span>
            <h1 className={styles['title']}>{event.title}</h1>
          </div>
          <button
            className={`${styles['favorite-btn']} ${isFavorited ? styles.active : ''}`}
            onClick={() => setIsFavorited(!isFavorited)}
            title={isFavorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          >
            <Heart size={24} fill={isFavorited ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Info Grid */}
        <div className={styles['info-grid']}>
          <div className={styles['info-item']}>
            <Calendar size={20} />
            <div>
              <p className={styles['label']}>Data</p>
              <p className={styles['value']}>{event.date}</p>
            </div>
          </div>

          <div className={styles['info-item']}>
            <Clock size={20} />
            <div>
              <p className={styles['label']}>Horário</p>
              <p className={styles['value']}>{event.time}</p>
            </div>
          </div>

          <div className={styles['info-item']}>
            <DollarSign size={20} />
            <div>
              <p className={styles['label']}>Entrada</p>
              <p className={styles['value']}>{event.price}</p>
            </div>
          </div>

          <div className={styles['info-item']}>
            <MapPin size={20} />
            <div>
              <p className={styles['label']}>Local</p>
              <p className={styles['value']}>{event.location}</p>
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
            <p>{event.location}</p>
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
          <button className={styles['secondary-btn']}>
            Comprar Ingresso
          </button>
        </div>
      </div>
    </div>
  );
}

export default EventDetailPage;
