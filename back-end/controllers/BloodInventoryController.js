const BloodInventory = require('../schemas/BloodInventory');
const ApiResponse = require('../utils/ApiResponse');

// Get all blood inventories
exports.getAllBloodInventories = async (req, res) => {
  try {
    const inventories = await BloodInventory.find();
    res.status(200).json(new ApiResponse(200, 'Success', inventories));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, 'Error fetching blood inventories', error.message));
  }
};

// Add a new blood inventory
exports.addBloodInventory = async (req, res) => {
  try {
    const inventoryData = req.body;
    const inventory = new BloodInventory(inventoryData);
    await inventory.save();
    res.status(201).json(new ApiResponse(201, 'Blood inventory added successfully', inventory));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, 'Error adding blood inventory', error.message));
  }
};

// Update a blood inventory
exports.updateBloodInventory = async (req, res) => {
  try {
    const { id } = req.params;
    const inventoryData = req.body;
    const inventory = await BloodInventory.findByIdAndUpdate(id, inventoryData, { new: true });
    if (!inventory) {
      return res.status(404).json(new ApiResponse(404, 'Blood inventory not found'));
    }
    res.status(200).json(new ApiResponse(200, 'Blood inventory updated successfully', inventory));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, 'Error updating blood inventory', error.message));
  }
};

// Delete a blood inventory
exports.deleteBloodInventory = async (req, res) => {
  try {
    const { id } = req.params;
    const inventory = await BloodInventory.findByIdAndDelete(id);
    if (!inventory) {
      return res.status(404).json(new ApiResponse(404, 'Blood inventory not found'));
    }
    res.status(200).json(new ApiResponse(200, 'Blood inventory deleted successfully'));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, 'Error deleting blood inventory', error.message));
  }
};