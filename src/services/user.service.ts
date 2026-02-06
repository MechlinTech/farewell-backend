import prisma from '../config/prisma.js';
import { reverseGeocode } from '../lib/maps.js';

export class UserService {
  /**
   * Get user's latest location with formatted address by userId
   */
  static async getLocationByUserId(userId: string) {
    // Get the latest location for the user
    const location = await prisma.userLocation.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    if (!location) {
      throw new Error('No location found for this user, please set');
    }

    // Reverse geocode to get formatted address
    const addressInfo = await reverseGeocode(location.locationLat, location.locationLng);

    return {
      id: location.id,
      userId: location.userId,
      formattedAddress: addressInfo?.formattedAddress || null,
      placeId: addressInfo?.placeId || null,
      createdAt: location.createdAt,
    };
  }

  /**
   * Create a new user location
   */
  static async createLocation(data: {
    userId: string;
    locationLat: number;
    locationLng: number;
  }) {
    const location = await prisma.userLocation.create({
      data: {
        userId: data.userId,
        locationLat: data.locationLat,
        locationLng: data.locationLng,
      },
    });

    // Reverse geocode to get formatted address
    const addressInfo = await reverseGeocode(location.locationLat, location.locationLng);

    return {
      id: location.id,
      userId: location.userId,
      locationLat: location.locationLat,
      locationLng: location.locationLng,
      formattedAddress: addressInfo?.formattedAddress || null,
      placeId: addressInfo?.placeId || null,
      createdAt: location.createdAt,
    };
  }

  /**
   * Update a user location by userId
   */
  static async updateLocationByUserId(
    userId: string,
    data: {
      locationLat?: number;
      locationLng?: number;
    }
  ) {
    // Find the latest location for the user
    const location = await prisma.userLocation.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    if (!location) {
      throw new Error('Location not found for this user');
    }

    const updatedLocation = await prisma.userLocation.update({
      where: { id: location.id },
      data: {
        locationLat: data.locationLat,
        locationLng: data.locationLng,
      },
    });

    // Reverse geocode to get formatted address
    const addressInfo = await reverseGeocode(
      updatedLocation.locationLat,
      updatedLocation.locationLng
    );

    return {
      id: updatedLocation.id,
      userId: updatedLocation.userId,
      locationLat: updatedLocation.locationLat,
      locationLng: updatedLocation.locationLng,
      formattedAddress: addressInfo?.formattedAddress || null,
      placeId: addressInfo?.placeId || null,
      createdAt: updatedLocation.createdAt,
    };
  }

  /**
   * Delete a user location by userId
   */
  static async deleteLocationByUserId(userId: string) {
    // Find the latest location for the user
    const location = await prisma.userLocation.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    if (!location) {
      throw new Error('Location not found for this user');
    }

    await prisma.userLocation.delete({
      where: { id: location.id },
    });

    return { message: 'Location deleted successfully' };
  }
}
