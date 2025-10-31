import { Plus, X, MapPin } from "lucide-react";
import type { Location } from "@/services/api";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import styles from './DestinationSelector.module.css';

interface DestinationSelectorProps {
    waypoints: (Location | null)[];
    locations: Location[];
    onWaypointChange: (index: number, locationId: string) => void;
    onAddWaypoint: () => void;
    onRemoveWaypoint: (index: number) => void;
    onCalculateRoute: () => void;
    loadingRoute: boolean;
}

export default function DestinationSelector({
    waypoints,
    locations,
    onWaypointChange,
    onAddWaypoint,
    onRemoveWaypoint,
    onCalculateRoute,
    loadingRoute
}: DestinationSelectorProps) {
    return (
        <div className={styles['destination-selector-container']}>
            <Card className={styles['destination-card']}>
                <CardContent className={styles['destination-content']}>
                    <div className={styles['card-header']}>
                        <h3 className={styles['card-title']}>Planeje sua Rota</h3>
                    </div>
                    <div className={styles['waypoints-list']}>
                        {waypoints.map((waypoint, index) => (
                            <div key={index} className={styles['waypoint-item']}>
                                <div className={styles['waypoint-number']}>
                                    {index + 1}
                                </div>
                                <div className={styles['waypoint-connector']}></div>
                                <div className={styles['waypoint-input-group']}>
                                    <select
                                        value={waypoint?.id?.toString() || ''}
                                        onChange={(e) => onWaypointChange(index, e.target.value)}
                                        className={styles['waypoint-select']}
                                    >
                                        <option value="" disabled>
                                            {index === 0 ? 'Partida' : index === waypoints.length - 1 && waypoints.length > 1 ? 'Destino' : `Parada ${index}`}
                                        </option>
                                        {locations.map((location) => (
                                            <option key={`${index}-${location.id}`} value={location.id.toString()}>
                                                {location.name}
                                            </option>
                                        ))}
                                    </select>
                                    {waypoints.length > 2 && (
                                        <button
                                            className={styles['remove-waypoint-btn']}
                                            onClick={() => onRemoveWaypoint(index)}
                                        >
                                            <X size={14} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className={styles['actions']}>
                        <button
                            onClick={onAddWaypoint}
                            className={styles['add-waypoint-btn']}
                        >
                            <Plus size={16} />
                            Adicionar destino
                        </button>

                        <Button
                            onClick={onCalculateRoute}
                            className={styles['calculate-route-btn']}
                            disabled={loadingRoute || waypoints.length < 2 || !waypoints.every(w => w !== null)}
                        >
                            <MapPin size={16} />
                            {loadingRoute ? 'Calculando...' : 'Calcular rota'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
