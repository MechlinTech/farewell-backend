import axios from 'axios';
import { env } from '../config/env.config.js';

interface ZipLocation {
    city: string;
    state: string;
    country: string;
}

interface AddressComponent {
    long_name: string;
    short_name: string;
    types: string[];
}

/**
 * Get location details (city, state, country) from US zipcode using Google Maps Geocoding API
 * @param zipcode - 5-digit US zipcode
 * @returns Location details or throws error if invalid/incomplete
 */
export async function getLocationFromZip(zipcode: string): Promise<ZipLocation> {
    // Validate zipcode format
    if (!/^\d{5}$/.test(zipcode)) {
        throw new Error('Invalid US zipcode format');
    }

    // Check if Google Maps API key is configured
    if (!env.googleMapsKey) {
        console.error('Google Maps API key is not configured');
        throw new Error('Google Maps API key is not configured');
    }

    try {
        const url = env.map_url;

        const { data } = await axios.get(url, {
            params: {
                address: zipcode,
                components: 'country:US',
                key: env.googleMapsKey,
            },
        });

        if (data.status !== 'OK') {
            console.error('Google Maps API error:', {
                status: data.status,
                errorMessage: data.error_message,
                zipcode,
            });
            throw new Error(`Failed to fetch location: ${data.status}`);
        }

        if (!data.results?.length) {
            console.warn('No results found for zipcode:', { zipcode });
            throw new Error('No location found for the provided zipcode');
        }

        const components: AddressComponent[] = data.results[0].address_components;

        // Extract city (locality or administrative_area_level_2)
        const city =
            components.find((c) => c.types.includes('locality'))?.long_name ||
            components.find((c) => c.types.includes('administrative_area_level_2'))?.long_name;

        // Extract state (administrative_area_level_1)
        const state = components.find((c) =>
            c.types.includes('administrative_area_level_1')
        )?.short_name;

        // Extract country
        const country = components.find((c) =>
            c.types.includes('country')
        )?.long_name;

        // Validate that all required fields are present
        if (!city || !state || !country) {
            console.warn('Incomplete location data for zipcode:', {
                zipcode,
                city,
                state,
                country,
            });
            throw new Error('Incomplete location data');
        }

        return { city, state, country };
    } catch (error) {
        // If it's already our custom error, rethrow it
        if (error instanceof Error && error.message.includes('Invalid US zipcode format')) {
            throw error;
        }
        if (error instanceof Error && error.message.includes('Failed to fetch location')) {
            throw error;
        }
        if (error instanceof Error && error.message.includes('No location found')) {
            throw error;
        }
        if (error instanceof Error && error.message.includes('Incomplete location data')) {
            throw error;
        }
        if (error instanceof Error && error.message.includes('Google Maps API key')) {
            throw error;
        }

        // Handle unexpected errors
        console.error('Location fetch from zipcode failed:', {
            error: error instanceof Error ? error.message : error,
            zipcode,
        });
        throw new Error('Failed to fetch location from zipcode');
    }
}
