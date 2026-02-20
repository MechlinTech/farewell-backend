import axios from 'axios';
import { env } from '../config/env.config.js';

export async function reverseGeocode(lat: number, lng: number) {
    try {
        const url = env.map_url;

        if (!env.googleMapsKey) {
            console.error('Google Maps API key is not configured');
            return null;
        }

        const { data } = await axios.get(url, {
            params: {
                latlng: `${lat},${lng}`,
                key: env.googleMapsKey,
            },
        });

        if (data.status !== 'OK') {
            console.error('Google Maps API error:', {
                status: data.status,
                errorMessage: data.error_message,
                lat,
                lng,
            });
            return null;
        }

        if (!data.results?.length) {
            console.warn('No results found for coordinates:', { lat, lng });
            return null;
        }

        return {
            formattedAddress: data.results[0].formatted_address,
            placeId: data.results[0].place_id,
        };
    } catch (error) {
        console.error('Reverse geocoding failed:', {
            error: error instanceof Error ? error.message : error,
            lat,
            lng,
        });
        return null;
    }
}