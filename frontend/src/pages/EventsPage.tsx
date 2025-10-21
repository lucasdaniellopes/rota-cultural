import { Calendar, Clock, MapPin, Search } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import styles from '../styles/EventsPage.module.css';

function EventsPage() {
  const navigate = useNavigate();
  const [favorited, setFavorited] = useState<{ [key: string]: boolean }>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas Categorias');
  const [selectedLocation, setSelectedLocation] = useState('Todas Regiões');

  const events = [
    {
      id: 'motofest',
      title: 'MotoFest',
      image: '/MotoFest.png',
      description: 'Festival de motociclismo que combina música, gastronomia e camaradagem entre motociclistas e público em geral',
      date: '30/08/2025',
      time: '18:00 - 23:00',
      location: 'Patos - PB',
      price: 'Gratuito',
      category: 'Música',
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
      category: 'Cultural',
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
      category: 'Festas Populares',
    },
  ];

  const categories = ['Todas Categorias', 'Música', 'Cultural', 'Festas Populares', 'Esportes'];
  const locations = ['Todas Regiões', 'Patos - PB', 'Região Metropolitana'];

  const toggleFavorite = (id: string) => {
    setFavorited(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas Categorias' || event.category === selectedCategory;
    const matchesLocation = selectedLocation === 'Todas Regiões' || event.location === selectedLocation;
    
    return matchesSearch && matchesCategory && matchesLocation;
  });

  return (
    <div>
      <Navbar isAuthenticated={true} />
      
      <section className={styles['header-section']}>
        <div className={styles['header-container']}>
          <h1 className={styles['header-title']}>Eventos</h1>
          <p className={styles['header-subtitle']}>
            {filteredEvents.length} Eventos Encontrados
          </p>
        </div>
      </section>

      <section className={styles['filters-section']}>
        <div className={styles['filters-container']}>
          
          <div className={styles['search-box']}>
            <Search size={18} className={styles['search-icon']} />
            <input
              type="text"
              placeholder="Buscar..."
              className={styles['search-input']}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className={styles['filter-group']}>
            <select
              className={styles['filter-select']}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className={styles['filter-group']}>
            <select
              className={styles['filter-select']}
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              {locations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className={styles['content-section']}>
        <div className={styles['content-container']}>
          <div className={styles['cards-grid']}>
            {filteredEvents.map(event => (
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

          {filteredEvents.length === 0 && (
            <div className={styles['empty-state']}>
              <p className={styles['empty-text']}>Nenhum evento encontrado com os filtros selecionados.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default EventsPage;
