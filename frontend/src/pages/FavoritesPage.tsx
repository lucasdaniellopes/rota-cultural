import { Heart, MapPin, Calendar, Clock } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import styles from '../styles/FavoritesPage.module.css';

interface FavoriteItem {
  id: string;
  title: string;
  image: string;
  description: string;
  type: 'event' | 'place';
  location: string;
  date?: string;
  time?: string;
}

function FavoritesPage() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([
    {
      id: 'cruz-de-merina',
      title: 'Cruz de Merina',
      image: '/CruzdaMenina.png',
      description: 'A Igreja estrutura e a construção de 8 de Joséde Patos é uma estrutura bem conservada, localizada em Patos, Paraíba com grande importância histórica',
      type: 'place',
      location: 'Patos - PB',
    },
    {
      id: 'igreja-nossa-senhora',
      title: 'Igreja Nossa Senhora da Conceição',
      image: '/IgrejaConceicao.png',
      description: 'A Igreja de Nossa Senhora da Conceição, localizada no centro de Patos, é um importante ponto religioso e turístico da cidade com sua arquitetura característica',
      type: 'place',
      location: 'Patos - PB',
    },
    {
      id: 'patos-shopping',
      title: 'Patos Shopping',
      image: '/PatosShopping.png',
      description: 'É um centro comercial localizado na cidade de Patos, oferecendo compras, lazer e entretenimento para toda família',
      type: 'place',
      location: 'Patos - PB',
    },
  ]);

  const [activeTab, setActiveTab] = useState<'all' | 'places' | 'events'>('all');

  const handleRemoveFavorite = (id: string) => {
    setFavorites(favorites.filter(fav => fav.id !== id));
  };

  const filteredFavorites = favorites.filter(fav => {
    if (activeTab === 'all') return true;
    if (activeTab === 'places') return fav.type === 'place';
    if (activeTab === 'events') return fav.type === 'event';
    return true;
  });

  const placesCount = favorites.filter(f => f.type === 'place').length;
  const eventsCount = favorites.filter(f => f.type === 'event').length;

  return (
    <div>
      <Navbar isAuthenticated={true} />
      
      <section className={styles['header-section']}>
        <div className={styles['header-container']}>
          <div className={styles['header-content']}>
            <div className={styles['header-icon']}>
              <Heart size={32} fill="#e74c3c" color="#e74c3c" />
            </div>
            <div>
              <h1 className={styles['header-title']}>Meus Favoritos</h1>
              <p className={styles['header-subtitle']}>Locais e eventos que você salvou para visitar</p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles['filters-section']}>
        <div className={styles['filters-container']}>
          <div className={styles['tabs']}>
            <button
              className={`${styles['tab']} ${activeTab === 'all' ? styles['active'] : ''}`}
              onClick={() => setActiveTab('all')}
            >
              Todos ({favorites.length})
            </button>
            <button
              className={`${styles['tab']} ${activeTab === 'places' ? styles['active'] : ''}`}
              onClick={() => setActiveTab('places')}
            >
              Pontos Turísticos ({placesCount})
            </button>
            <button
              className={`${styles['tab']} ${activeTab === 'events' ? styles['active'] : ''}`}
              onClick={() => setActiveTab('events')}
            >
              Eventos ({eventsCount})
            </button>
          </div>
        </div>
      </section>

      <section className={styles['content-section']}>
        <div className={styles['content-container']}>
          {filteredFavorites.length === 0 ? (
            <div className={styles['empty-state']}>
              <div className={styles['empty-icon']}>
                <Heart size={64} color="#ddd" />
              </div>
              <h2 className={styles['empty-title']}>
                {activeTab === 'all'
                  ? 'Nenhum favorito ainda'
                  : activeTab === 'places'
                  ? 'Nenhum ponto turístico favoritado'
                  : 'Nenhum evento favoritado'}
              </h2>
              <p className={styles['empty-text']}>
                {activeTab === 'all'
                  ? 'Explore e salve seus locais e eventos favoritos'
                  : activeTab === 'places'
                  ? 'Salve pontos turísticos para visitá-los depois'
                  : 'Salve eventos que você não quer perder'}
              </p>
              <button
                className={styles['explore-btn']}
                onClick={() => navigate(activeTab === 'events' ? '/eventos' : '/pontos-turisticos')}
              >
                Explorar {activeTab === 'events' ? 'Eventos' : 'Pontos Turísticos'}
              </button>
            </div>
          ) : (
            <div className={styles['cards-grid']}>
              {filteredFavorites.map(favorite => (
                <div key={favorite.id} className={styles['favorite-card-wrapper']}>
                  <Card
                    image={favorite.image}
                  >
                    <div className={styles['card-header']}>
                      <h3 className={styles['card-title']}>{favorite.title}</h3>
                      <button
                        className={styles['remove-btn']}
                        onClick={() => handleRemoveFavorite(favorite.id)}
                        title="Remover dos favoritos"
                      >
                        <Heart size={20} fill="#e74c3c" color="#e74c3c" />
                      </button>
                    </div>

                    <Card.Description>
                      {favorite.description}
                    </Card.Description>

                    <Card.Meta>
                      <Card.MetaItem icon={<MapPin size={14} />}>
                        {favorite.location}
                      </Card.MetaItem>
                      {favorite.date && (
                        <Card.MetaItem icon={<Calendar size={14} />}>
                          {favorite.date}
                        </Card.MetaItem>
                      )}
                      {favorite.time && (
                        <Card.MetaItem icon={<Clock size={14} />}>
                          {favorite.time}
                        </Card.MetaItem>
                      )}
                    </Card.Meta>

                    <Card.Action
                      onClick={() =>
                        navigate(
                          favorite.type === 'event'
                            ? `/eventos/${favorite.id}`
                            : `/pontos-turisticos/${favorite.id}`
                        )
                      }
                    >
                      Ver Detalhes
                    </Card.Action>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default FavoritesPage;
