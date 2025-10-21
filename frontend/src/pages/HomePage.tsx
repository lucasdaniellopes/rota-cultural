import { Calendar, MapPin, Clock, Eye, Landmark } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import styles from '../styles/HomePage.module.css';

function HomePage() {
  const navigate = useNavigate();
  const [favorited, setFavorited] = useState<{ [key: string]: boolean }>({});

  const upcomingEvents = [
    {
      id: 'motofest',
      title: 'MotoFest',
      image: '/MotoFest.png',
      description: 'Festival de motociclismo que combina música, gastronomia e camaradagem entre motociclistas e público em geral',
      date: '30/08/2025',
      time: '18:00 - 23:00',
      location: 'Patos - PB',
      price: 'Gratuito',
    },
    {
      id: 'terreirinho',
      title: 'Terreirinho',
      image: '/Terreirinho.png',
      description: 'Espaço ecológico e cultural que oferece atividades em um verde e apresentações culturais de artistas locais',
      date: '15/09/2025',
      time: '18:00 - 23:00',
      location: 'Patos - PB',
      price: 'R$ 25,00',
    },
    {
      id: 'sao-joao',
      title: 'São João de Patos',
      image: '/SãoJoão.png',
      description: 'Uma grande festa junina com estrutura de shows no Terreno do Patos. Festa bem recebida socialmente entre maiores e menores dias',
      date: '23/06/2025',
      time: '18:00 - 23:00',
      location: 'Patos - PB',
      price: 'R$ 30,00',
    },
  ];

  const touristPlaces = [
    {
      id: 'cruz-de-merina',
      title: 'Cruz de Merina',
      image: '/CruzdaMenina.png',
      description: 'A Igreja estrutura e a construção de 8 de Joséde Patos é uma estrutura bem conservada, localizada em Patos, Paraíba com grande importância histórica',
      location: 'Patos - PB',
    },
    {
      id: 'igreja-nossa-senhora',
      title: 'Igreja Nossa Senhora da Conceição',
      image: '/IgrejaConceicao.png',
      description: 'A Igreja de Nossa Senhora da Conceição, localizada no centro de Patos, é um importante ponto religioso e turístico da cidade com sua arquitetura característica',
      location: 'Patos - PB',
    },
    {
      id: 'patos-shopping',
      title: 'Patos Shopping',
      image: '/PatosShopping.png',
      description: 'É um centro comercial localizado na cidade de Patos, oferecendo compras, lazer e entretenimento para toda família',
      location: 'Patos - PB',
    },
  ];

  const toggleFavorite = (id: string) => {
    setFavorited(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div>
      <Navbar isAuthenticated={true} />
      
      <section className={styles['hero-section']}>
        <div className={styles['hero-container']}>
          <h1 className={styles['hero-title']}>Descubro os Melhores Destinos e Eventos</h1>
          <p className={styles['hero-subtitle']}>Explore pontos turísticos, eventos culturais e crie roteiros personalizados para sua visita</p>
          
          <div className={styles['hero-actions']}>
            <button 
              className={styles['hero-btn-primary']}
              onClick={() => navigate('/eventos')}
            >
              <Calendar size={18} />
              Ver Eventos
            </button>
            <button 
              className={styles['hero-btn-secondary']}
              onClick={() => navigate('/pontos-turisticos')}
            >
              <MapPin size={18} />
              Pontos Turísticos
            </button>
          </div>
        </div>
      </section>

      <section className={styles['events-section']}>
        <div className={styles['section-container']}>
          <div className={styles['section-header']}>
            <div className={styles['title-with-icon']}>
              <Calendar size={28} />
              <h2 className={styles['section-title']}>Próximos Eventos</h2>
            </div>
            <p className={styles['section-subtitle']}>Os eventos mais populares da cidade</p>
          </div>
          
                    <div className={styles['cards-grid']}>
            {upcomingEvents.map(event => (
              <Card 
                key={event.id}
                image={event.image}
              >
                <Card.TitleWithFav 
                  onFavorite={() => toggleFavorite(event.id)}
                  isFavorited={favorited[event.id] || false}
                >
                  {event.title}
                </Card.TitleWithFav>
                
                <Card.Description>
                  {event.description}
                </Card.Description>
                
                <Card.Meta>
                  <Card.MetaItem icon={<Calendar size={14} />}>
                    {event.date}
                  </Card.MetaItem>
                  <Card.MetaItem icon={<Clock size={14} />}>
                    {event.time}
                  </Card.MetaItem>
                  <Card.MetaItem icon={<MapPin size={14} />}>
                    {event.location}
                  </Card.MetaItem>
                  <Card.MetaItem>
                    {event.price}
                  </Card.MetaItem>
                </Card.Meta>
                
                <Card.Action onClick={() => navigate(`/eventos/${event.id}`)}>
                  Como Chegar
                </Card.Action>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className={styles['tourist-section']}>
        <div className={styles['section-container']}>
          <div className={styles['section-header']}>
            <div className={styles['title-with-icon']}>
              <Landmark size={28} />
              <h2 className={styles['section-title']}>Pontos Turísticos em Destaque</h2>
            </div>
            <p className={styles['section-subtitle']}>Os lugares mais visitados e bem avaliados</p>
          </div>
          
          <div className={styles['cards-grid']}>
            {touristPlaces.map(place => (
              <Card 
                key={place.id}
                image={place.image}
              >
                <Card.TitleWithFav 
                  onFavorite={() => toggleFavorite(place.id)}
                  isFavorited={favorited[place.id] || false}
                >
                  {place.title}
                </Card.TitleWithFav>
                
                <Card.Description>
                  {place.description}
                </Card.Description>
                
                <Card.Meta>
                  <Card.MetaItem icon={<MapPin size={14} />}>
                    {place.location}
                  </Card.MetaItem>
                </Card.Meta>
                
                <Card.Action onClick={() => navigate(`/pontos-turisticos/${place.id}`)}>
                  Como Chegar
                </Card.Action>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className={styles['cta-section']}>
        <div className={styles['cta-container']}>
          <h2 className={styles['cta-title']}>Planeje Sua Visita Perfeita</h2>
          <p className={styles['cta-subtitle']}>Crie roteiros personalizados, descubra eventos próximos e encontre melhores lugares para visitar</p>
          
          <div className={styles['cta-actions']}>
            <button 
              className={styles['cta-btn-primary']}
              onClick={() => navigate('/roteiros')}
            >
              <MapPin size={18} />
              Criar meu Roteiro
            </button>
            <button 
              className={styles['cta-btn-secondary']}
              onClick={() => navigate('/')}
            >
              <Eye size={18} />
              Avaliar o Site
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
