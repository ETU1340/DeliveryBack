import { Request } from 'express';
const { DEFAULT_IMAGE_PROFILE,BASE_URL } = require('../services/utilsService');
exports.getImageUrl = async (req: Request) => {


    let dirFileUrl = 'other';
    if (req.body.dirFileUrl) {
        dirFileUrl = req.body.dirFileUrl;
    }
    const file = (req as any).file;
    if (file) {
        return BASE_URL + dirFileUrl + `/${file.filename}`;
    } 
        return  DEFAULT_IMAGE_PROFILE;
}