const express = require('express');
const router = express.Router();
const discussionController = require('../controllers/discussionController');

// Route pour récupérer une discussion entre un livreur et son manager
router.get('/:delivererId/:managerId', discussionController.getDiscussion);



module.exports = router;