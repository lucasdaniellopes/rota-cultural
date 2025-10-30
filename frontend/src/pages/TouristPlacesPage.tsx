import { MapPin, Search } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import styles from '../styles/TouristPlacesPage.module.css';

function TouristPlacesPage() {
  const navigate = useNavigate();
  const [favorited, setFavorited] = useState<{ [key: string]: boolean }>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas Categorias');
  const [selectedLocation, setSelectedLocation] = useState('Todas Regiões');

  const touristPlaces = [
    {
      id: 'cruz-de-merina',
      title: 'Cruz de Merina',
      image: '/CruzdaMenina.png',
      description: 'A Igreja estrutura e a construção de 8 de Joséde Patos é uma estrutura bem conservada, localizada em Patos, Paraíba com grande importância histórica',
      location: 'Patos - PB',
      category: 'Religioso',
    },
    {
      id: 'igreja-nossa-senhora',
      title: 'Igreja Nossa Senhora da Conceição',
      image: '/IgrejaConceicao.png',
      description: 'A Igreja de Nossa Senhora da Conceição, localizada no centro de Patos, é um importante ponto religioso e turístico da cidade com sua arquitetura característica',
      location: 'Patos - PB',
      category: 'Religioso',
    },
    {
      id: 'patos-shopping',
      title: 'Patos Shopping',
      image: '/PatosShopping.png',
      description: 'É um centro comercial localizado na cidade de Patos, oferecendo compras, lazer e entretenimento para toda família',
      location: 'Patos - PB',
      category: 'Comércio',
    },
  ];

  const categories = ['Todas Categorias', 'Religioso', 'Comércio', 'Cultural', 'Natureza'];
  const locations = ['Todas Regiões', 'Patos - PB', 'Região Metropolitana'];

  const toggleFavorite = (id: string) => {
    setFavorited(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredPlaces = touristPlaces.filter(place => {
    const matchesSearch = place.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         place.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas Categorias' || place.category === selectedCategory;
    const matchesLocation = selectedLocation === 'Todas Regiões' || place.location === selectedLocation;
    
    return matchesSearch && matchesCategory && matchesLocation;
  });

  return (
    <div>
      <Navbar isAuthenticated={true} />
      
      <section className={styles['header-section']}>
        <div className={styles['header-container']}>
          <h1 className={styles['header-title']}>Pontos Turísticos</h1>
          <p className={styles['header-subtitle']}>
            {filteredPlaces.length} Locais Encontrados
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
            {filteredPlaces.map(place => (
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

          {filteredPlaces.length === 0 && (
            <div className={styles['empty-state']}>
              <p className={styles['empty-text']}>Nenhum ponto turístico encontrado com os filtros selecionados.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default TouristPlacesPage;
