// seedCategories.js
const sequelize = require('../Data/DB.js');
const Category  = require('../Models/Category.js');

const seedCategories = async () => {
  try {
    await sequelize.sync();
    
    const categories = [
      // Expense categories
      { name: 'Food & Dining', type: 'expense', icon: '🍔', color: '#FF6B6B' },
      { name: 'Transportation', type: 'expense', icon: '🚗', color: '#4ECDC4' },
      { name: 'Shopping', type: 'expense', icon: '🛍️', color: '#95E1D3' },
      { name: 'Entertainment', type: 'expense', icon: '🎮', color: '#FFE66D' },
      { name: 'Bills', type: 'expense', icon: '💡', color: '#F38181' },
      { name: 'Other', type: 'expense', icon: '📌', color: '#9E9E9E' },
      
      // Income categories
      { name: 'Salary', type: 'income', icon: '💰', color: '#4CAF50' },
      { name: 'Freelance', type: 'income', icon: '💻', color: '#9C27B0' },
      { name: 'Business', type: 'income', icon: '💼', color: '#2196F3' },
      { name: 'Other', type: 'income', icon: '💵', color: '#607D8B' }
    ];
    
    await Category.bulkCreate(categories);
    console.log('✅ Categories seeded!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedCategories();