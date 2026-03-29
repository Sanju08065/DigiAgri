const router = require('express').Router();
const { recommend, getSoilTypes, getSeasons, getRegions } = require('../controllers/cropController');
const { auth } = require('../middleware/auth');

router.post('/recommend', auth, recommend);
router.get('/soil-types', auth, getSoilTypes);
router.get('/seasons', auth, getSeasons);
router.get('/regions', auth, getRegions);

module.exports = router;
