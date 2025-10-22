import { Map as MapIcon, Plus } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import styles from '../styles/ItinerariesPage.module.css';

interface Itinerary {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

function ItinerariesPage() {
  const navigate = useNavigate();
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);

  const handleCreateItinerary = () => {
    navigate('/roteiros/criar');
  };

  const handleDeleteItinerary = (id: string) => {
    setItineraries(itineraries.filter(item => item.id !== id));
  };

  return (
    <div>
      <Navbar isAuthenticated={true} />
      
      <section className={styles['header-section']}>
        <div className={styles['header-container']}>
          <div className={styles['header-content']}>
            <h1 className={styles['header-title']}>Meus Roteiros</h1>
            <p className={styles['header-subtitle']}>Crie e gerencie roteiros personalizados para sua viagem</p>
          </div>
        </div>
      </section>

      <section className={styles['action-section']}>
        <div className={styles['action-container']}>
          <button 
            className={styles['create-btn']}
            onClick={handleCreateItinerary}
          >
            <Plus size={18} />
            Criar Novo Roteiro
          </button>
        </div>
      </section>

      {itineraries.length === 0 ? (
        <section className={styles['empty-state-section']}>
          <div className={styles['empty-state-container']}>
            <div className={styles['empty-icon']}>
              <MapIcon size={64} strokeWidth={1} />
            </div>
            
            <h2 className={styles['empty-title']}>Nenhum roteiro criado ainda</h2>
            <p className={styles['empty-text']}>Comece criando seu primeiro roteiro personalizado</p>
            
            <button 
              className={styles['empty-cta-btn']}
              onClick={handleCreateItinerary}
            >
              <Plus size={18} />
              Criar Primeiro Roteiro
            </button>
          </div>
        </section>
      ) : (
        <section className={styles['content-section']}>
          <div className={styles['content-container']}>
            <div className={styles['itineraries-grid']}>
              {itineraries.map(itinerary => (
                <div key={itinerary.id} className={styles['itinerary-card']}>
                  <div className={styles['card-header']}>
                    <h3 className={styles['card-title']}>{itinerary.title}</h3>
                    <button
                      className={styles['delete-btn']}
                      onClick={() => handleDeleteItinerary(itinerary.id)}
                      title="Deletar roteiro"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <p className={styles['card-description']}>{itinerary.description}</p>
                  
                  <div className={styles['card-footer']}>
                    <span className={styles['created-date']}>
                      Criado em: {new Date(itinerary.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                    <button
                      className={styles['view-btn']}
                      onClick={() => navigate(`/roteiros/${itinerary.id}`)}
                    >
                      Ver Detalhes
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default ItinerariesPage;
