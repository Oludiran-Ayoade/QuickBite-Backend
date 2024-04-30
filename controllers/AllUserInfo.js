const User = require('../model/userModel'); // Assuming your User model file location

const AllUserInfo = async (req, res) => {
// router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, 'firstName lastName email totalSpent'); // Fetch only required fields
    res.json(users);
    // console.log(users);
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = AllUserInfo;
