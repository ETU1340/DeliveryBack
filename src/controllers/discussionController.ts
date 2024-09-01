const Discussion = require('../models/Chat');
import { Request, Response } from 'express';
// Récupérer une discussion entre un livreur et son manager
exports.getDiscussion = async (req: Request, res: Response) => {
    console.log(req.params);
  try {
    const { delivererId, managerId } = req.params;
    const discussion = await Discussion.findOne({ delivererId, managerId });
    res.status(200).json({ success: true, discussion });
  } catch (error:any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
