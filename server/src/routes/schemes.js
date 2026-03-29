const router = require('express').Router();
const { getAll, create, update, apply, delete: deleteScheme } = require('../controllers/schemeController');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/', auth, getAll);
router.post('/', auth, adminOnly, create);
router.put('/:id', auth, adminOnly, update);
router.delete('/:id', auth, adminOnly, deleteScheme);
router.post('/:id/apply', auth, apply);

module.exports = router;
