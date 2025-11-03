import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Heart, ArrowLeft } from 'lucide-react';
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
}

function TouristPlaceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isFavorited, setIsFavorited] = useState(false);

  const places: { [key: string]: TouristPlace } = {
    'cruz-de-merina': {
      id: 'cruz-de-merina',
      title: 'Cruz de Merina',
      image: '/CruzdaMenina.png',
      description: 'A Igreja da Cruz é um símbolo da fé e da história de Patos. Construída em 1892, é um exemplo impressionante da arquitetura colonial nordestina com grande importância histórica e cultural.',
      location: 'Centro de Patos - PB',
      operatingHours: 'Segunda a Sexta: 08:00 - 17:00 | Sábado e Domingo: 09:00 - 15:00',
      entryFee: 'Gratuito',
    },
    'igreja-nossa-senhora': {
      id: 'igreja-nossa-senhora',
      title: 'Igreja Nossa Senhora da Conceição',
      image: '/IgrejaConceicao.png',
      description: 'Igreja reconstruída em 1905, considerada um dos marcos arquitetônicos mais importantes de Patos. Seu interior é decorado com arte sacra valiosa e oferece um espaço de paz e espiritualidade.',
      location: 'Praça Central de Patos - PB',
      operatingHours: 'Terça a Domingo: 09:00 - 18:00 | Segunda: fechado',
      entryFee: 'Gratuito',
    },
    'patos-shopping': {
      id: 'patos-shopping',
      title: 'Patos Shopping',
      image: '/PatosShopping.png',
      description: 'Centro comercial inaugurado em 2010, oferecendo compras, lazer e entretenimento para toda família. Com lojas variadas, restaurantes, cinemas e áreas de convivência.',
      location: 'Avenida principal, Patos - PB',
      operatingHours: 'Segunda a Sábado: 09:00 - 21:00 | Domingo: 12:00 - 19:00',
      entryFee: 'Gratuito (compras opcionais)',
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
        <button onClick={() => navigate('/pontos-turisticos')} className={styles['back-button']}>
          <ArrowLeft size={20} />
        </button>
      </div>

      {/* Main Content */}
      <div className={styles['container']}>
        {/* Header */}
        <div className={styles['header']}>
          <h1 className={styles['title']}>{place.title}</h1>
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
            <MapPin size={20} />
            <div>
              <p className={styles['label']}>Localização</p>
              <p className={styles['value']}>{place.location}</p>
            </div>
          </div>

          <div className={styles['info-item']}>
            <span className={styles['icon-text']}>🕐</span>
            <div>
              <p className={styles['label']}>Horário</p>
              <p className={styles['value']}>{place.operatingHours?.split('|')[0] || 'Consulte'}</p>
            </div>
          </div>

          <div className={styles['info-item']}>
            <span className={styles['icon-text']}>$</span>
            <div>
              <p className={styles['label']}>Entrada</p>
              <p className={styles['value']}>{place.entryFee}</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <section className={styles['section']}>
          <h2>Sobre Este Local</h2>
          <p className={styles['description']}>{place.description}</p>
        </section>

        {/* Operating Hours */}
        {place.operatingHours && (
          <section className={styles['section']}>
            <h2>Horário de Funcionamento</h2>
            <p className={styles['text']}>{place.operatingHours}</p>
          </section>
        )}

        {/* Map */}
        <section className={styles['section']}>
          <h2>Localização</h2>
          <div className={styles['map-placeholder']}>
            <MapPin size={40} />
            <p>{place.location}</p>
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
            Mais Informações
          </button>
        </div>
      </div>
    </div>
  );
}

export default TouristPlaceDetailPage;
