// src/controllers/instantDeliveryCart.controller.ts
import type { Request, Response } from 'express';
import { InstantDeliveryCartService } from '../services/instantDelivery.service.js';

export class InstantDeliveryCartController {
    static async createCart(req: Request, res: Response): Promise<void> {
        try {
            const {
                customerId,
                pickupLat,
                pickupLng,
                dropoffLat,
                dropoffLng,
                quantity,
                size,
                picture,
            } = req.body;

            if (
                !customerId ||
                pickupLat == null ||
                pickupLng == null ||
                dropoffLat == null ||
                dropoffLng == null ||
                !quantity ||
                !size
            ) {
                res.status(400).json({ success: false, message: 'Missing required fields' });
                return;
            }

            const cart = await InstantDeliveryCartService.create({
                customerId,
                pickupLat,
                pickupLng,
                dropoffLat,
                dropoffLng,
                quantity,
                size,
                picture,
            });

            res.status(201).json({ success: true, data: cart });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    static async getAll(req: Request, res: Response): Promise<void> {
        try {
            const carts = await InstantDeliveryCartService.getAll();
            res.status(200).json({ success: true, data: carts });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    static async getById(req: Request, res: Response): Promise<void> {
        try {
            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            if (!id) {
                res.status(400).json({ success: false, message: 'ID is required' });
                return;
            }
            const cart = await InstantDeliveryCartService.getById(id);
            if (!cart) {
                res.status(404).json({ success: false, message: 'Not found' });
                return;
            }
            res.status(200).json({ success: true, data: cart });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    static async update(req: Request, res: Response): Promise<void> {
        try {
            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            if (!id) {
                res.status(400).json({ success: false, message: 'ID is required' });
                return;
            }
            const cart = await InstantDeliveryCartService.update(id, req.body);
            res.status(200).json({ success: true, data: cart });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    static async delete(req: Request, res: Response): Promise<void> {
        try {
            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            if (!id) {
                res.status(400).json({ success: false, message: 'ID is required' });
                return;
            }
            await InstantDeliveryCartService.delete(id);
            res.status(204).send();
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
}
