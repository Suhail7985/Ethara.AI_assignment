const express = require('express');
const router = express.Router();
const {
  getUsers, getUserById, inviteUser, updateUser,
  getNotifications, markNotificationRead, getAnalytics,
} = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect);

router.get('/', getUsers);
router.get('/analytics', getAnalytics);
router.get('/notifications', getNotifications);
router.put('/notifications/:notifId/read', markNotificationRead);
router.post('/invite', adminOnly, inviteUser);
router.get('/:id', getUserById);
router.put('/:id', adminOnly, updateUser);

module.exports = router;
