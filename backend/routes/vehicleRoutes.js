const express = require('express');
const router = express.Router();
const {
  addVehicle,
  getVehicles,
  searchVehicles,
  updateVehicle,
  deleteVehicle,
  purchaseVehicle,
  restockVehicle
} = require('../controllers/vehicleController');
const { protect, adminOnly } = require('../middleware/auth');
const { validate, vehicleSchema, restockSchema } = require('../middleware/validator');

router.use(protect);

router.get('/', getVehicles);
router.get('/search', searchVehicles);
router.post('/', validate(vehicleSchema), addVehicle);
router.put('/:id', validate(vehicleSchema), updateVehicle);
router.delete('/:id', adminOnly, deleteVehicle);

router.post('/:id/purchase', purchaseVehicle);
router.post('/:id/restock', adminOnly, validate(restockSchema), restockVehicle);

module.exports = router;
