import { Request, Response } from 'express';
import User from '../models/User';
import Manager from '../models/Manager';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
var hal = require('hal');
import { generateHALLinks } from '../services/halLinks';
import {MANAGER,CLIENT,LIVREUR} from '../services/roleService'
const { getImageUrl } = require('../services/userServices');
import bcrypt from 'bcryptjs';
dotenv.config();

export const register = async (req: Request, res: Response) => {
  const { email, password, firstName,userName,name, address, phone,companyName,province,location} = req.body;
  const image = await getImageUrl(req);
  try {
    const manager = new Manager({ email,userName, password, name,image,firstName, address, phone,MANAGER,companyName,province,location});


    await manager.save();

    const resource = new hal.Resource(
      { message: 'User registered successfully' }
    );
    const links = generateHALLinks('/api/auth/register', {
      login: { href: '/api/auth/login', method: 'POST' }
    });

    for (const rel in links._links) {
      if (links._links.hasOwnProperty(rel)) {
          resource.link(rel, links._links[rel].href, links._links[rel].method);
      }
    }

    console.log(resource);
    return res.status(200).send(resource);
  } catch (error: any) {
    console.log( error.message);
    return res.status(400).send({ error: error.message });
  }
};

// Connexion d'un utilisateur
export const login = async (req: Request, res: Response) => {
  const { userName, password } = req.body;
  console.log(req.body);

  try {
    const user = await User.findOne({ userName: userName });
    console.log(user);
    if (!user) {
      return res.status(404).send({message:"User not found"});
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log(isMatch);
    if (!isMatch) {
        return res.status(404).send({message:"Invalid credential"});
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '5h' });

    const resource = new hal.Resource(
      { token,user },
      `/api/auth/login`
    );
    const links = generateHALLinks(`/api/auth/login`, {
      logout: { href: '/api/auth/logout', method: 'POST' },
      self: { href: '/api/auth/login', method: 'POST' }
    });
    
    for (const rel in links._links) {
      if (links._links.hasOwnProperty(rel)) {
          resource.link(rel, links._links[rel].href, links._links[rel].method);
      }
    }
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