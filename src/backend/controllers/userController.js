const pool = require('../config/db');
const bcrypt = require('bcryptjs');

// Register new user
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const [existingUsers] = await pool.execute(
      'SELECT * FROM users WHERE email = ? OR username = ?',
      [email, username]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'User with this email or username already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const [result] = await pool.execute(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );

    // Get the newly created user
    const [newUser] = await pool.execute(
      'SELECT id, username, email, premium_status, subscription_end_date, Credit_count FROM users WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: newUser[0]
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering user',
      error: error.message
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const [users] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials :('
      });
    }

    const user = users[0];

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials :('
      });
    }

    res.status(200).json({
      success: true,
      message: 'Login successful!',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        premium_status: user.premium_status,
        subscription_end_date: user.subscription_end_date,
        Credit_count: user.Credit_count
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during login',
      error: error.message
    });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const { userId, currentPassword, newPassword } = req.body;

    // Get user from database
    const [users] = await pool.execute(
      'SELECT * FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const user = users[0];

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password in database
    await pool.execute(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, userId]
    );

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error changing password',
      error: error.message
    });
  }
};

// Purchase credits
exports.purchaseCredits = async (req, res) => {
  try {
    const { userId, creditAmount } = req.body;

    // Get current user
    const [users] = await pool.execute(
      'SELECT * FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const user = users[0];
    const newCreditCount = (user.Credit_count || 0) + creditAmount;

    // Update user's credit count
    await pool.execute(
      'UPDATE users SET Credit_count = ? WHERE id = ?',
      [newCreditCount, userId]
    );

    res.status(200).json({
      success: true,
      message: 'Credits purchased successfully',
      newCreditCount
    });
  } catch (error) {
    console.error('Purchase credits error:', error);
    res.status(500).json({
      success: false,
      message: 'Error purchasing credits',
      error: error.message
    });
  }
};

// Purchase subscription
exports.purchaseSubscription = async (req, res) => {
  try {
    const { userId, months } = req.body;

    // Get current user
    const [users] = await pool.execute(
      'SELECT * FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Calculate subscription end date (1 month from now)
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + months);
    const formattedEndDate = endDate.toISOString().split('T')[0];

    // Update user's premium status and end date
    await pool.execute(
      'UPDATE users SET premium_status = 1, subscription_end_date = ? WHERE id = ?',
      [formattedEndDate, userId]
    );

    res.status(200).json({
      success: true,
      message: 'Premium subscription activated successfully',
      subscription_end_date: formattedEndDate
    });
  } catch (error) {
    console.error('Purchase subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Error purchasing subscription',
      error: error.message
    });
  }
};

// Update credits
exports.updateCredits = async (req, res) => {
  try {
    const { userId, creditAmount } = req.body;

    // Get current user
    const [users] = await pool.execute(
      'SELECT * FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const user = users[0];
    const newCreditCount = user.Credit_count + creditAmount;

    // Don't allow negative credits
    if (newCreditCount < 0) {
      return res.status(400).json({
        success: false,
        message: 'Not enough credits'
      });
    }

    // Update user's credit count
    await pool.execute(
      'UPDATE users SET Credit_count = ? WHERE id = ?',
      [newCreditCount, userId]
    );

    res.status(200).json({
      success: true,
      message: 'Credits updated successfully',
      newCreditCount
    });
  } catch (error) {
    console.error('Update credits error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating credits',
      error: error.message
    });
  }
}; 