import { MapPin, Calendar, Plus, Trash2, ArrowUp, ArrowDown, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import styles from '../styles/CreateItineraryPage.module.css';

interface ItineraryItem {
  id: string;
  type: 'event' | 'place';
  title: string;
  location: string;
  date?: string;
  time?: string;
  estimatedArrival?: string;
  estimatedDeparture?: string;
}

interface SelectionItem {
  id: string;
  type: 'event' | 'place';
  title: string;
  location: string;
  date?: string;
  time?: string;
  image: string;
  description: string;
  price?: string;
  category?: string;
}

function CreateItineraryPage() {
  const navigate = useNavigate();
  const [itineraryName, setItineraryName] = useState('');
  const [items, setItems] = useState<ItineraryItem[]>([]);
  const [showEventPicker, setShowEventPicker] = useState(false);
  const [showPlacePicker, setShowPlacePicker] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Mock data - em produção virá da API
  const events: SelectionItem[] = [
    {
      id: 'motofest',
      type: 'event',
      title: 'MotoFest',
      image: '/MotoFest.png',
      description: 'Festival de motociclismo que combina música, gastronomia e camaradagem',
      date: '30/08/2025',
      time: '18:00 - 23:00',
      location: 'Patos - PB',
      price: 'Gratuito',
      category: 'Música',
    },
    {
      id: 'terreirinho',
      type: 'event',
      title: 'Terreirinho',
      image: '/Terreirinho.png',
      description: 'Espaço ecológico e cultural que oferece atividades em um verde',
      date: '15/09/2025',
      time: '18:00 - 23:00',
      location: 'Patos - PB',
      price: 'R$ 25,00',
      category: 'Cultural',
    },
    {
      id: 'sao-joao',
      type: 'event',
      title: 'São João de Patos',
      image: '/SãoJoão.png',
      description: 'Uma grande festa junina com estrutura de shows',
      date: '23/06/2025',
      time: '18:00 - 23:00',
      location: 'Patos - PB',
      price: 'R$ 30,00',
      category: 'Festas Populares',
    },
  ];

  const places: SelectionItem[] = [
    {
      id: 'cruz-de-merina',
      type: 'place',
      title: 'Cruz de Merina',
      image: '/CruzdaMenina.png',
      description: 'Igreja estrutura bem conservada com grande importância histórica',
      location: 'Patos - PB',
      category: 'Religioso',
    },
    {
      id: 'igreja-nossa-senhora',
      type: 'place',
      title: 'Igreja Nossa Senhora da Conceição',
      image: '/IgrejaConceicao.png',
      description: 'Importante ponto religioso e turístico com sua arquitetura característica',
      location: 'Patos - PB',
      category: 'Religioso',
    },
    {
      id: 'patos-shopping',
      type: 'place',
      title: 'Patos Shopping',
      image: '/PatosShopping.png',
      description: 'Centro comercial oferecendo compras, lazer e entretenimento',
      location: 'Patos - PB',
      category: 'Comércio',
    },
  ];

  const addItem = (item: SelectionItem) => {
    if (items.find(i => i.id === item.id)) {
      setErrors({ item: 'Este item já foi adicionado' });
      setTimeout(() => setErrors({}), 3000);
      return;
    }

    const newItem: ItineraryItem = {
      id: item.id,
      type: item.type,
      title: item.title,
      location: item.location,
      date: item.date,
      time: item.time,
    };

    setItems([...items, newItem]);
    setShowEventPicker(false);
    setShowPlacePicker(false);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newItems = [...items];
    if (direction === 'up' && index > 0) {
      [newItems[index], newItems[index - 1]] = [newItems[index - 1], newItems[index]];
    } else if (direction === 'down' && index < newItems.length - 1) {
      [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
    }
    setItems(newItems);
  };

  const updateItemTime = (
    index: number,
    field: 'estimatedArrival' | 'estimatedDeparture',
    value: string
  ) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      [field]: value,
    };
    setItems(newItems);
  };

  const handleSave = () => {
    const newErrors: { [key: string]: string } = {};

    if (!itineraryName.trim()) {
      newErrors.name = 'Nome do roteiro é obrigatório';
    }

    if (items.length === 0) {
      newErrors.items = 'Adicione pelo menos um item ao roteiro';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Salvar roteiro
    console.log('Salvando roteiro:', {
      name: itineraryName,
      items: items,
    });

    // Redirecionar para página de roteiros
    navigate('/roteiros');
  };

  return (
    <div>
      <Navbar isAuthenticated={true} />

      <section className={styles['header-section']}>
        <div className={styles['header-container']}>
          <h1 className={styles['header-title']}>Criar Novo Roteiro</h1>
          <p className={styles['header-subtitle']}>
            Planeje sua jornada adicionando eventos e pontos turísticos
          </p>
        </div>
      </section>

      <section className={styles['content-section']}>
        <div className={styles['content-container']}>
          <div className={styles['form-section']}>
            <div className={styles['form-group']}>
              <label htmlFor="itinerary-name" className={styles['form-label']}>
                Nome do Roteiro *
              </label>
              <input
                id="itinerary-name"
                type="text"
                placeholder="Ex: Fim de semana em Patos"
                className={styles['form-input']}
                value={itineraryName}
                onChange={(e) => setItineraryName(e.target.value)}
              />
              {errors.name && <span className={styles['error-text']}>{errors.name}</span>}
            </div>

            <div className={styles['items-section']}>
              <h2 className={styles['items-title']}>Roteiro ({items.length} itens)</h2>

              {errors.items && <span className={styles['error-text']}>{errors.items}</span>}

              {items.length === 0 ? (
                <div className={styles['empty-items']}>
                  <p className={styles['empty-text']}>Nenhum item adicionado ainda</p>
                  <p className={styles['empty-subtext']}>
                    Comece adicionando eventos ou pontos turísticos
                  </p>
                </div>
              ) : (
                <div className={styles['items-list']}>
                  {items.map((item, index) => (
                    <div key={item.id} className={styles['item-card']}>
                      <div className={styles['item-header']}>
                        <div className={styles['item-number']}>
                          {index + 1}
                        </div>
                        <div className={styles['item-info']}>
                          <h3 className={styles['item-title']}>{item.title}</h3>
                          <p className={styles['item-location']}>
                            <MapPin size={14} />
                            {item.location}
                          </p>
                          {item.date && (
                            <p className={styles['item-meta']}>
                              <Calendar size={14} />
                              {item.date}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className={styles['item-times']}>
                        <div className={styles['time-input-group']}>
                          <label className={styles['time-label']}>Chegada</label>
                          <input
                            type="time"
                            className={styles['time-input']}
                            value={item.estimatedArrival || ''}
                            onChange={(e) =>
                              updateItemTime(index, 'estimatedArrival', e.target.value)
                            }
                          />
                        </div>
                        <div className={styles['time-input-group']}>
                          <label className={styles['time-label']}>Saída</label>
                          <input
                            type="time"
                            className={styles['time-input']}
                            value={item.estimatedDeparture || ''}
                            onChange={(e) =>
                              updateItemTime(index, 'estimatedDeparture', e.target.value)
                            }
                          />
                        </div>
                      </div>

                      <div className={styles['item-actions']}>
                        <button
                          className={styles['action-btn']}
                          onClick={() => moveItem(index, 'up')}
                          disabled={index === 0}
                          title="Mover para cima"
                        >
                          <ArrowUp size={16} />
                        </button>
                        <button
                          className={styles['action-btn']}
                          onClick={() => moveItem(index, 'down')}
                          disabled={index === items.length - 1}
                          title="Mover para baixo"
                        >
                          <ArrowDown size={16} />
                        </button>
                        <button
                          className={`${styles['action-btn']} ${styles['delete-btn']}`}
                          onClick={() => removeItem(item.id)}
                          title="Remover item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className={styles['add-items-section']}>
              <div className={styles['add-buttons']}>
                <button
                  className={styles['add-btn']}
                  onClick={() => setShowEventPicker(!showEventPicker)}
                >
                  <Plus size={18} />
                  Adicionar Evento
                  <ChevronDown size={16} />
                </button>

                <button
                  className={styles['add-btn']}
                  onClick={() => setShowPlacePicker(!showPlacePicker)}
                >
                  <Plus size={18} />
                  Adicionar Ponto Turístico
                  <ChevronDown size={16} />
                </button>
              </div>

              {showEventPicker && (
                <div className={styles['picker-section']}>
                  <h3 className={styles['picker-title']}>Selecione um Evento</h3>
                  <div className={styles['picker-grid']}>
                    {events.map(event => (
                      <div key={event.id} className={styles['picker-item']}>
                        <img
                          src={event.image}
                          alt={event.title}
                          className={styles['picker-image']}
                        />
                        <div className={styles['picker-content']}>
                          <h4 className={styles['picker-item-title']}>{event.title}</h4>
                          <p className={styles['picker-item-meta']}>
                            <Calendar size={12} />
                            {event.date}
                          </p>
                          <button
                            className={styles['picker-btn']}
                            onClick={() => addItem(event)}
                          >
                            <Plus size={14} />
                            Adicionar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {showPlacePicker && (
                <div className={styles['picker-section']}>
                  <h3 className={styles['picker-title']}>Selecione um Ponto Turístico</h3>
                  <div className={styles['picker-grid']}>
                    {places.map(place => (
                      <div key={place.id} className={styles['picker-item']}>
                        <img
                          src={place.image}
                          alt={place.title}
                          className={styles['picker-image']}
                        />
                        <div className={styles['picker-content']}>
                          <h4 className={styles['picker-item-title']}>{place.title}</h4>
                          <p className={styles['picker-item-meta']}>
                            <MapPin size={12} />
                            {place.location}
                          </p>
                          <button
                            className={styles['picker-btn']}
                            onClick={() => addItem(place)}
                          >
                            <Plus size={14} />
                            Adicionar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className={styles['form-actions']}>
              <button
                className={styles['btn-cancel']}
                onClick={() => navigate('/roteiros')}
              >
                Cancelar
              </button>
              <button className={styles['btn-save']} onClick={handleSave}>
                Salvar Roteiro
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default CreateItineraryPage;
