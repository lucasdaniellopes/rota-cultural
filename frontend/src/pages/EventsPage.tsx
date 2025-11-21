import { Calendar, Clock, MapPin, Search, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import { eventsService, type Event } from '@/services/events';
import { useAuth } from '@/contexts/AuthContext';
import styles from '../styles/EventsPage.module.css';

function EventsPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<string[]>(['Todas Categorias']);
  const [favorited, setFavorited] = useState<{ [key: string]: boolean }>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas Categorias');
  const [selectedLocation, setSelectedLocation] = useState('Todas Regiões');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const locations = ['Todas Regiões', 'Patos - PB', 'Região Metropolitana'];

  useEffect(() => {
    loadEvents();
    loadCategories();
  }, []);

  const loadEvents = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await eventsService.getEvents({ filter: 'upcoming' });
      setEvents(data);
    } catch (err: any) {
      setError('Falha ao carregar eventos. Tente novamente.');
      console.error('Error loading events:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await eventsService.getCategories();
      const categoryNames = data.map(cat => cat.name);
      setCategories(['Todas Categorias', ...categoryNames]);
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };

  const toggleFavorite = (id: number) => {
    setFavorited(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
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

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas Categorias' || event.category_name === selectedCategory;
    const matchesLocation = selectedLocation === 'Todas Regiões' || event.location_name?.includes(selectedLocation);
    
    return matchesSearch && matchesCategory && matchesLocation;
  });

  const handleCreateEvent = () => {
    if (!isAuthenticated) {
      navigate('/entrar');
      return;
    }
    navigate('/eventos/criar');
  };

  return (
    <div>
      <Navbar />
      
      <section className={styles['header-section']}>
        <div className={styles['header-container']}>
          <div className={styles['header-content']}>
            <div>
              <h1 className={styles['header-title']}>Eventos</h1>
              <p className={styles['header-subtitle']}>
                {filteredEvents.length} Eventos Encontrados
              </p>
            </div>
            <button 
              className={styles['create-button']}
              onClick={handleCreateEvent}
            >
              <Plus size={20} />
              Criar Evento
            </button>
          </div>
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
          {isLoading ? (
            <div className={styles['empty-state']}>
              <p className={styles['empty-text']}>Carregando eventos...</p>
            </div>
          ) : error ? (
            <div className={styles['empty-state']}>
              <p className={styles['empty-text']}>{error}</p>
            </div>
          ) : (
            <>
              <div className={styles['cards-grid']}>
                {filteredEvents.map(event => (
                  <Card 
                    key={event.id}
                    image={event.image_url || "/event-placeholder.jpg"}
                    onClick={() => navigate(`/eventos/${event.id}`)}
                  >
                    <Card.TitleWithFav 
                      onFavorite={() => toggleFavorite(event.id)}
                      isFavorited={favorited[event.id] || false}
                    >
                      {event.name}
                    </Card.TitleWithFav>
                    
                    <Card.Description>
                      {event.description}
                    </Card.Description>
                    
                    <Card.Meta>
                      <Card.MetaItem icon={<Calendar size={14} />}>
                        {formatDate(event.start_date)}
                      </Card.MetaItem>
                      <Card.MetaItem icon={<Clock size={14} />}>
                        {formatTime(event.start_time)} - {formatTime(event.end_time)}
                      </Card.MetaItem>
                      <Card.MetaItem icon={<MapPin size={14} />}>
                        {event.location_name || 'Local não especificado'}
                      </Card.MetaItem>
                      <Card.MetaItem>
                        {formatPrice(event.price)}
                      </Card.MetaItem>
                    </Card.Meta>
                    
                    <Card.Action onClick={() => navigate(`/eventos/${event.id}`)}>
                      Como Chegar
                    </Card.Action>
                  </Card>
                ))}
              </div>

              {filteredEvents.length === 0 && !isLoading && (
                <div className={styles['empty-state']}>
                  <p className={styles['empty-text']}>Nenhum evento encontrado com os filtros selecionados.</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}

export default EventsPage;
