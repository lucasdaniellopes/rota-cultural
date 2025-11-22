import { api } from './api'

export interface RouteData {
    distance: number;
    duration: number;
    geometry: [number, number][] 
    waypoints: Array<{
        id: number;
        name: string;
        coordinates: [number, number];
    }>
}

export const routingService ={
    calculateRoute: async (data: { waypointIds?: number[], coordinates?: Array<{lat: number, lon: number}> }): Promise<RouteData> => {
        const response = await api.post('/routes/calculate/', {
            waypoint_ids: data.waypointIds,
            coordinates: data.coordinates
        });
        return response.data;
    }
}