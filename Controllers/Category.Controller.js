const { Category } = require('../Models');

const getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      order: [['name', 'ASC']]
    });
    
    return res.status(200).json({ categories });
  } catch (error) {
    return res.status(500).json({ 
      message: "Server error", 
      error: error.message 
    });
  }
};

module.exports = { getCategories };