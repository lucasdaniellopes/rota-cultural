import { api } from './api'

export interface RouteData {
    distance: number;
    duration: number;
    geometry: [number, number][] 
    start_location: {
        id: number;
        name: string;
        coordinates: [number, number];
    };
    end_location: {
        id: number;
        name: string;
        coordinates: [number, number];
    };
}

export const routingService ={
    calculateRoute: async (startId: number, endId: number): Promise<RouteData> => {
        const response = await api.post('/routes/calculate/', {
            start_location_id: startId,
            end_location_id: endId
        });
        return response.data;
    }
}