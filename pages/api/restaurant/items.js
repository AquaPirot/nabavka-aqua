// pages/api/admin/restaurants.js
import { adminMiddleware } from '@/middleware/auth';
import { prisma } from '@/lib/prisma';

export default async function handler(req, res) {
  // Provera admin privilegija
  const authResponse = await adminMiddleware(req);
  if (authResponse.status === 403) {
    return authResponse;
  }

  // GET - Lista svih restorana
  if (req.method === 'GET') {
    try {
      const restaurants = await prisma.restaurant.findMany({
        include: {
          user: true,
          menuItems: true
        }
      });
      return res.status(200).json(restaurants);
    } catch (error) {
      return res.status(500).json({ error: 'Error fetching restaurants' });
    }
  }

  // POST - Kreiranje novog restorana
  if (req.method === 'POST') {
    try {
      const { name, address, userId } = req.body;
      const newRestaurant = await prisma.restaurant.create({
        data: {
          name,
          address,
          userId
        }
      });
      return res.status(201).json(newRestaurant);
    } catch (error) {
      return res.status(500).json({ error: 'Error creating restaurant' });
    }
  }

  // PUT - Ažuriranje restorana
  if (req.method === 'PUT') {
    try {
      const { id, ...updateData } = req.body;
      const updatedRestaurant = await prisma.restaurant.update({
        where: { id },
        data: updateData
      });
      return res.status(200).json(updatedRestaurant);
    } catch (error) {
      return res.status(500).json({ error: 'Error updating restaurant' });
    }
  }

  // DELETE - Brisanje restorana
  if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      await prisma.restaurant.delete({
        where: { id }
      });
      return res.status(204).end();
    } catch (error) {
      return res.status(500).json({ error: 'Error deleting restaurant' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
