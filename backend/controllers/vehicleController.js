const Vehicle = require('../models/Vehicle');

const addVehicle = async (req, res, next) => {
  try {
    const { make, model, category, price, quantity } = req.body;
    const vehicle = new Vehicle({ make, model, category, price, quantity });
    await vehicle.save();
    return res.status(201).json({
      success: true,
      message: 'Vehicle added successfully',
      data: vehicle
    });
  } catch (error) {
    next(error);
  }
};

const getVehicles = async (req, res, next) => {
  try {
    const vehicles = await Vehicle.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      message: 'Vehicles retrieved successfully',
      data: vehicles
    });
  } catch (error) {
    next(error);
  }
};

const searchVehicles = async (req, res, next) => {
  try {
    const { make, model, category, minPrice, maxPrice } = req.query;
    const query = {};

    if (make) query.make = new RegExp(make, 'i');
    if (model) query.model = new RegExp(model, 'i');
    if (category) query.category = new RegExp(category, 'i');
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    const vehicles = await Vehicle.find(query);
    return res.status(200).json({
      success: true,
      message: 'Search completed successfully',
      data: vehicles
    });
  } catch (error) {
    next(error);
  }
};

const updateVehicle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { make, model, category, price, quantity } = req.body;

    const vehicle = await Vehicle.findByIdAndUpdate(
      id,
      { make, model, category, price, quantity },
      { new: true, runValidators: true }
    );

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found',
        data: null
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Vehicle updated successfully',
      data: vehicle
    });
  } catch (error) {
    next(error);
  }
};

const deleteVehicle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const vehicle = await Vehicle.findByIdAndDelete(id);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found',
        data: null
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Vehicle deleted successfully',
      data: null
    });
  } catch (error) {
    next(error);
  }
};

const purchaseVehicle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const vehicle = await Vehicle.findById(id);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found',
        data: null
      });
    }

    if (vehicle.quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Vehicle is out of stock',
        data: null
      });
    }

    vehicle.quantity -= 1;
    await vehicle.save();

    return res.status(200).json({
      success: true,
      message: 'Purchase completed successfully',
      data: vehicle
    });
  } catch (error) {
    next(error);
  }
};

const restockVehicle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const vehicle = await Vehicle.findById(id);
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found',
        data: null
      });
    }

    vehicle.quantity += quantity;
    await vehicle.save();

    return res.status(200).json({
      success: true,
      message: 'Vehicle restocked successfully',
      data: vehicle
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addVehicle,
  getVehicles,
  searchVehicles,
  updateVehicle,
  deleteVehicle,
  purchaseVehicle,
  restockVehicle
};
