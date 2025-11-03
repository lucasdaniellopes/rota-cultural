import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Heart, ArrowLeft, Share2, Star, Clock, Camera } from 'lucide-react';
import Navbar from '@/components/Navbar';
import styles from '@/styles/TouristPlaceDetailPage.module.css';

interface TouristPlace {
  id: string;
  title: string;
  image: string;
  description: string;
  location: string;
  operatingHours?: string;
  entryFee?: string;
  rating?: number;
  reviews?: number;
  contact?: string;
  historicalInfo?: string;
  highlights?: string[];
}

function TouristPlaceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isFavorited, setIsFavorited] = useState(false);

  // Mock data - em produção virá do backend
  const places: { [key: string]: TouristPlace } = {
    'cruz-de-merina': {
      id: 'cruz-de-merina',
      title: 'Cruz de Merina',
      image: '/CruzdaMenina.png',
      description: 'A Igreja estrutura e a construção de 8 de Joséde Patos é uma estrutura bem conservada, localizada em Patos, Paraíba com grande importância histórica. Este monumento religioso é um exemplo impressionante da arquitetura colonial nordestina e representa um importante patrimônio cultural da região.',
      location: 'Centro de Patos - PB',
      operatingHours: 'Aberto para visitação: Segunda a Sexta, 08:00 - 17:00 | Sábado e Domingo, 09:00 - 15:00',
      entryFee: 'Gratuito',
      rating: 4.7,
      reviews: 342,
      contact: '(83) 3422-1234',
      historicalInfo: 'Construída em 1892, a Igreja da Cruz é um símbolo da fé e da história de Patos. Sua fachada e interior preservam características da arquitetura religiosa do século XIX.',
      highlights: ['Arquitetura colonial bem preservada', 'Vista panorâmica da cidade', 'Ambiente tranquilo para meditação', 'Importância religiosa e histórica'],
    },
    'igreja-nossa-senhora': {
      id: 'igreja-nossa-senhora',
      title: 'Igreja Nossa Senhora da Conceição',
      image: '/IgrejaConceicao.png',
      description: 'A Igreja de Nossa Senhora da Conceição, localizada no centro de Patos, é um importante ponto religioso e turístico da cidade com sua arquitetura característica. Seu interior é decorado com arte sacra valiosa e oferece um espaço de paz e espiritualidade.',
      location: 'Praça Central de Patos - PB',
      operatingHours: 'Aberto para visitação: Terça a Domingo, 09:00 - 18:00 | Segunda: fechado',
      entryFee: 'Gratuito',
      rating: 4.8,
      reviews: 521,
      contact: '(83) 3422-5678',
      historicalInfo: 'Reconstruída em 1905, a Igreja é considerada um dos marcos arquitetônicos mais importantes de Patos. Suas modificações ao longo dos anos refletem a evolução cultural da região.',
      highlights: ['Altar principal ricamente decorado', 'Vitrais históricos', 'Arte sacra valiosa', 'Eventos litúrgicos especiais'],
    },
    'patos-shopping': {
      id: 'patos-shopping',
      title: 'Patos Shopping',
      image: '/PatosShopping.png',
      description: 'É um centro comercial localizado na cidade de Patos, oferecendo compras, lazer e entretenimento para toda família. Com lojas de marcas variadas, restaurantes, cinemas e áreas de convivência, é o local ideal para toda a família aproveitar.',
      location: 'Avenida principal, Patos - PB',
      operatingHours: 'Segunda a Sábado: 09:00 - 21:00 | Domingo: 12:00 - 19:00',
      entryFee: 'Gratuito (compras opcionais)',
      rating: 4.5,
      reviews: 876,
      contact: '(83) 3422-9999',
      historicalInfo: 'Inaugurado em 2010, o Shopping tornou-se um dos principais pontos de encontro e entretenimento da população local e região.',
      highlights: ['Múltiplas lojas de marcas', 'Praça de alimentação variada', 'Cinema com 4 salas', 'Estacionamento gratuito', 'Área kids para crianças'],
    },
  };

  const place = places[id || ''];

  if (!place) {
    return (
      <div className={styles['not-found']}>
        <Navbar isAuthenticated={true} />
        <div className={styles['not-found-container']}>
          <h1>Ponto turístico não encontrado</h1>
          <button onClick={() => navigate('/pontos-turisticos')} className={styles['back-btn']}>
            Voltar para Pontos Turísticos
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
        <img src={place.image} alt={place.title} className={styles['hero-image']} />
        <div className={styles['hero-overlay']}>
          <button onClick={() => navigate('/pontos-turisticos')} className={styles['back-button']}>
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
            {/* Cabeçalho */}
            <div className={styles['header']}>
              <div>
                <h1 className={styles['title']}>{place.title}</h1>
                {place.rating && (
                  <div className={styles['rating']}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        className={i < Math.round(place.rating || 0) ? styles['star-filled'] : styles['star-empty']}
                      />
                    ))}
                    <span className={styles['rating-text']}>
                      {place.rating} ({place.reviews} avaliações)
                    </span>
                  </div>
                )}
              </div>
              <div className={styles['header-actions']}>
                <button
                  className={`${styles['favorite-btn']} ${isFavorited ? styles.active : ''}`}
                  onClick={() => setIsFavorited(!isFavorited)}
                >
                  <Heart size={24} />
                </button>
                <button className={styles['share-btn']}>
                  <Share2 size={24} />
                </button>
              </div>
            </div>

            {/* Descrição */}
            <section className={styles['description-section']}>
              <h2>Sobre Este Local</h2>
              <p className={styles['description']}>{place.description}</p>
            </section>

            {/* Informações Principais */}
            <section className={styles['info-grid']}>
              <div className={styles['info-card']}>
                <MapPin className={styles['icon']} size={24} />
                <div>
                  <h3>Localização</h3>
                  <p>{place.location}</p>
                </div>
              </div>

              <div className={styles['info-card']}>
                <Clock className={styles['icon']} size={24} />
                <div>
                  <h3>Horário de Funcionamento</h3>
                  <p>{place.operatingHours}</p>
                </div>
              </div>

              <div className={styles['info-card']}>
                <span className={styles['icon-text']}>$</span>
                <div>
                  <h3>Entrada</h3>
                  <p>{place.entryFee}</p>
                </div>
              </div>

              <div className={styles['info-card']}>
                <Camera className={styles['icon']} size={24} />
                <div>
                  <h3>Contato</h3>
                  <p>{place.contact}</p>
                </div>
              </div>
            </section>

            {/* Informações Históricas */}
            {place.historicalInfo && (
              <section className={styles['historical-section']}>
                <h2>Informações Históricas</h2>
                <div className={styles['historical-card']}>
                  <p className={styles['historical-text']}>{place.historicalInfo}</p>
                </div>
              </section>
            )}

            {/* Destaques */}
            {place.highlights && place.highlights.length > 0 && (
              <section className={styles['highlights-section']}>
                <h2>Destaques do Local</h2>
                <ul className={styles['highlights-list']}>
                  {place.highlights.map((highlight, index) => (
                    <li key={index} className={styles['highlight-item']}>
                      <span className={styles['highlight-dot']}></span>
                      {highlight}
                    </li>
                  ))}
                </ul>
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
                Fazer Reserva
              </button>
            </div>

            {/* Informações Rápidas */}
            <div className={styles['quick-info-card']}>
              <h3>Informações Rápidas</h3>
              <div className={styles['quick-info-item']}>
                <span className={styles['label']}>Horário</span>
                <span className={styles['value']}>
                  {place.operatingHours?.split('|')[0] || 'Consulte'}
                </span>
              </div>
              <div className={styles['quick-info-item']}>
                <span className={styles['label']}>Entrada</span>
                <span className={styles['value']}>{place.entryFee}</span>
              </div>
              <div className={styles['quick-info-item']}>
                <span className={styles['label']}>Avaliação</span>
                <span className={styles['value']}>⭐ {place.rating}</span>
              </div>
            </div>

            {/* Mapa Rápido */}
            <div className={styles['location-card']}>
              <h3>Localização</h3>
              <div className={styles['location-placeholder']}>
                <MapPin size={32} />
                <p>{place.location}</p>
              </div>
            </div>

            {/* Compartilhar */}
            <div className={styles['share-card']}>
              <h3>Compartilhar</h3>
              <div className={styles['share-buttons']}>
                <button className={styles['share-social']} title="Compartilhar no Facebook">
                  f
                </button>
                <button className={styles['share-social']} title="Compartilhar no Twitter">
                  𝕏
                </button>
                <button className={styles['share-social']} title="Compartilhar no WhatsApp">
                  W
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default TouristPlaceDetailPage;
