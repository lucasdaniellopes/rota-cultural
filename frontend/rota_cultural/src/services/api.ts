import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
})

export interface Location {
    id: number;
    name: string;
    description: string;
    latitude: number;
    longitude: number;
    created_at: string;
}

export const locationService = {
    async getLocations(): Promise<Location[]> {
        const response = await api.get('/locations/')
        return response.data
    }
}