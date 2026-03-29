const router = require('express').Router();
const { create, getMyComplaints, getAll, updateStatus } = require('../controllers/complaintController');
const { auth, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/', auth, upload.array('images', 5), create);
router.get('/my', auth, getMyComplaints);
router.get('/', auth, adminOnly, getAll);
router.patch('/:id', auth, adminOnly, updateStatus);

module.exports = router;
