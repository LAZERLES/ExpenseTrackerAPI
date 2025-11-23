const Category  = require("../Models/Category.js");

const getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      order: [
        ["type", "ASC"],
        ["name", "ASC"],
      ],
    });

    return res.status(200).json({ 
      categories: categories,
      count: categories.length 
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getCategoriesByType = async (req, res) => {
  try {
    const {type} = req.params;

    // validate type
    if(type !== 'income' && type !== 'expense'){
      return res.status(400).json({message: "Invalid type. Must be 'income' or 'expense'"});
    }

    const categories = await Category.findAll({
      where: {type: type},
      order: [["name", "ASC"]],
    });

    return res.status(200).json({
      categories: categories,
      count: categories.length,
    });
  } catch (error) {
    console.error('Get categories by type error:', error);
    return res.status(500).json({ 
      message: "Server error", 
      error: error.message 
    });
  }
}

module.exports = { getCategories, getCategoriesByType };