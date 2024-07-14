import { Request, Response } from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
var hal = require('hal');
import { generateHALLinks } from '../services/halLinks';
import {MANAGER,CLIENT,LIVREUR} from '../services/roleService'
import bcrypt from 'bcryptjs';
dotenv.config();

export const register = async (req: Request, res: Response) => {
  const { email, password, name, address, phone, role, companyName, latitude, longitude } = req.body;

  try {
    const user = new User({ email, password, name, address, phone, role });

    // Ajouter les attributs spécifiques en fonction du rôle
    if (role === MANAGER) {
      user.set('companyName', companyName);
    } else if (role === CLIENT) {
      user.set('companyName', companyName);
    } else if (role === LIVREUR) {
      user.set('currentLocation', { latitude, longitude });
    }

    await user.save();

    const resource = new hal.Resource(
      { message: 'User registered successfully' },
      `/api/auth/register`
    );
    const links = generateHALLinks(`/api/auth/register`, {
      login: { href: '/api/auth/login', method: 'POST' },
      self: { href: '/api/auth/register', method: 'POST' }
    });
    resource.link(links);

    res.status(201).json(resource.toJSON());
  } catch (error) {
    res.status(400).json({ error });
  }
};

// Connexion d'un utilisateur
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      const resource = new hal.Resource(
        { message: 'User not found' },
        `/api/auth/login`
      );
      const links = generateHALLinks(`/api/auth/login`, {
        register: { href: '/api/auth/register', method: 'POST' },
        self: { href: '/api/auth/login', method: 'POST' }
      });
      return res.status(404).json(resource.toJSON());
    }

    const isMatch = bcrypt.compare(password, user.password);
    if (!isMatch) {
      const resource = new hal.Resource(
        { message: 'Invalid credentials' },
        `/api/auth/login`
      );
      const links = generateHALLinks(`/api/auth/login`, {
        register: { href: '/api/auth/register', method: 'POST' },
        self: { href: '/api/auth/login', method: 'POST' }
      });
      return res.status(400).json(resource.toJSON());
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '1h' });

    const resource = new hal.Resource(
      { token },
      `/api/auth/login`
    );
    const links = generateHALLinks(`/api/auth/login`, {
      logout: { href: '/api/auth/logout', method: 'POST' },
      self: { href: '/api/auth/login', method: 'POST' }
    });
    resource.link(links);
    res.status(200).json(resource.toJSON());
  } catch (error) {
    res.status(400).json({ error });
  }
};

// Déconnexion d'un utilisateur
export const logout = (req: Request, res: Response) => {
  const resource = new hal.Resource(
    { message: 'User logged out successfully' },
    `/api/auth/logout`
  );
  const links = generateHALLinks(`/api/auth/logout`, {
    login: { href: '/api/auth/login', method: 'POST' },
    self: { href: '/api/auth/logout', method: 'POST' }
  });
  resource.link(links);
  res.status(200).json(resource.toJSON());
};