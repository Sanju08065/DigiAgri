const router = require('express').Router();
const { getAll, getStats } = require('../controllers/userController');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/', auth, adminOnly, getAll);
router.get('/stats', auth, getStats);

module.exports = router;
