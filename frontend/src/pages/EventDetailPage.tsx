import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, DollarSign, Heart, ArrowLeft, Accessibility, Share2 } from 'lucide-react';
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
  organizer?: string;
  capacity?: number;
  attendees?: number;
}

function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isFavorited, setIsFavorited] = useState(false);

  // Mock data - em produção virá do backend
  const events: { [key: string]: Event } = {
    motofest: {
      id: 'motofest',
      title: 'MotoFest',
      image: '/MotoFest.png',
      description: 'Festival de motociclismo que combina música, gastronomia e camaradagem entre motociclistas e público em geral. Um evento imperdível para todos os amantes de motociclismo, com exibição de motos customizadas, shows ao vivo de bandas locais e food trucks com deliciosa culinária local.',
      date: '30/08/2025',
      time: '18:00 - 23:00',
      location: 'Patos - PB',
      price: 'Gratuito',
      category: 'Música',
      accessibility: 'Acesso para cadeirantes, banheiros acessíveis e estacionamento reservado',
      organizer: 'Associação de Motociclistas de Patos',
      capacity: 5000,
      attendees: 3240,
    },
    terreirinho: {
      id: 'terreirinho',
      title: 'Terreirinho',
      image: '/Terreirinho.png',
      description: 'Espaço ecológico e cultural que oferece atividades em um verde e apresentações culturais de artistas locais. Um ambiente aconchegante e sustentável perfeito para famílias, com shows acústicos, oficinas de arte e gastronomia local.',
      date: '15/09/2025',
      time: '18:00 - 23:00',
      location: 'Patos - PB',
      price: 'R$ 25,00',
      category: 'Cultural',
      accessibility: 'Área com grama, banheiros simples, sem acesso específico para cadeirantes',
      organizer: 'Coletivo Terreirinho',
      capacity: 2000,
      attendees: 1250,
    },
    'sao-joao': {
      id: 'sao-joao',
      title: 'São João de Patos',
      image: '/SãoJoão.png',
      description: 'Uma grande festa junina com estrutura de shows no Terreno do Patos. Festa bem recebida socialmente entre maiores e menores dias. Venha dançar forró, aproveitar comidas típicas nordestinas e se divertir em um dos maiores eventos juninos da região.',
      date: '23/06/2025',
      time: '18:00 - 23:00',
      location: 'Patos - PB',
      price: 'R$ 30,00',
      category: 'Festas Populares',
      accessibility: 'Acesso para cadeirantes em áreas específicas, estrutura de sinalização',
      organizer: 'Prefeitura de Patos',
      capacity: 10000,
      attendees: 8500,
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

  const occupancy = event.capacity ? Math.round((event.attendees || 0) / event.capacity * 100) : 0;

  return (
    <div>
      <Navbar isAuthenticated={true} />

      {/* Hero Section com Imagem */}
      <div className={styles['hero-section']}>
        <img src={event.image} alt={event.title} className={styles['hero-image']} />
        <div className={styles['hero-overlay']}>
          <button onClick={() => navigate('/eventos')} className={styles['back-button']}>
            <ArrowLeft size={20} />
            Voltar
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles['container']}>
        <div className={styles['content-grid']}>
          {/* Coluna Principal */}
          <div className={styles['main-content']}>
            {/* Cabeçalho com Título e Ações */}
            <div className={styles['header']}>
              <div>
                <span className={styles['category-badge']}>{event.category}</span>
                <h1 className={styles['title']}>{event.title}</h1>
              </div>
              <div className={styles['header-actions']}>
                <button
                  className={`${styles['favorite-btn']} ${isFavorited ? styles.active : ''}`}
                  onClick={() => setIsFavorited(!isFavorited)}
                  title={isFavorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                >
                  <Heart size={24} />
                </button>
                <button className={styles['share-btn']} title="Compartilhar">
                  <Share2 size={24} />
                </button>
              </div>
            </div>

            {/* Descrição */}
            <section className={styles['description-section']}>
              <h2>Sobre o Evento</h2>
              <p className={styles['description']}>{event.description}</p>
            </section>

            {/* Informações Principais em Grid */}
            <section className={styles['info-grid']}>
              <div className={styles['info-card']}>
                <Calendar className={styles['icon']} size={24} />
                <div>
                  <h3>Data</h3>
                  <p>{event.date}</p>
                </div>
              </div>

              <div className={styles['info-card']}>
                <Clock className={styles['icon']} size={24} />
                <div>
                  <h3>Horário</h3>
                  <p>{event.time}</p>
                </div>
              </div>

              <div className={styles['info-card']}>
                <MapPin className={styles['icon']} size={24} />
                <div>
                  <h3>Local</h3>
                  <p>{event.location}</p>
                </div>
              </div>

              <div className={styles['info-card']}>
                <DollarSign className={styles['icon']} size={24} />
                <div>
                  <h3>Entrada</h3>
                  <p>{event.price}</p>
                </div>
              </div>
            </section>

            {/* Acessibilidade */}
            {event.accessibility && (
              <section className={styles['accessibility-section']}>
                <div className={styles['accessibility-header']}>
                  <Accessibility size={24} />
                  <h2>Acessibilidade</h2>
                </div>
                <p className={styles['accessibility-text']}>{event.accessibility}</p>
              </section>
            )}

            {/* Organizador */}
            {event.organizer && (
              <section className={styles['organizer-section']}>
                <h2>Organizador</h2>
                <div className={styles['organizer-card']}>
                  <div className={styles['organizer-avatar']}>{event.organizer.charAt(0)}</div>
                  <div className={styles['organizer-info']}>
                    <p className={styles['organizer-name']}>{event.organizer}</p>
                    <p className={styles['organizer-meta']}>Organizador Verificado</p>
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className={styles['sidebar']}>
            {/* Card de CTA */}
            <div className={styles['cta-card']}>
              <h3>Planeje sua visita</h3>
              <button className={styles['primary-btn']} onClick={() => navigate('/mapa')}>
                <MapPin size={18} />
                Como Chegar
              </button>
              <button className={styles['secondary-btn']}>
                Comprar Ingresso
              </button>
            </div>

            {/* Ocupação */}
            {event.capacity && (
              <div className={styles['capacity-card']}>
                <h3>Ocupação</h3>
                <div className={styles['capacity-info']}>
                  <div className={styles['capacity-bar']}>
                    <div
                      className={styles['capacity-fill']}
                      style={{ width: `${occupancy}%` }}
                    ></div>
                  </div>
                  <p className={styles['capacity-text']}>
                    {event.attendees} de {event.capacity} pessoas
                  </p>
                </div>
                <p className={styles['occupancy-percent']}>{occupancy}% de ocupação</p>
              </div>
            )}

            {/* Mapa Rápido */}
            <div className={styles['location-card']}>
              <h3>Localização</h3>
              <div className={styles['location-placeholder']}>
                <MapPin size={32} />
                <p>{event.location}</p>
              </div>
            </div>

            {/* Compartilhar */}
            <div className={styles['share-card']}>
              <h3>Compartilhar</h3>
              <div className={styles['share-buttons']}>
                <button className={styles['share-social']} title="Compartilhar no Facebook">f</button>
                <button className={styles['share-social']} title="Compartilhar no Twitter">𝕏</button>
                <button className={styles['share-social']} title="Compartilhar no WhatsApp">W</button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default EventDetailPage;
