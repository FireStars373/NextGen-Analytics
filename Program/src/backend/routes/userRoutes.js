const express = require('express');
const router = express.Router();
const { register, login, changePassword, purchaseCredits, purchaseSubscription, updateCredits } = require('../controllers/userController');

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account with username, email, and password
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: User's username
 *                 example: john_doe
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password (min 6 characters)
 *                 example: password123
 *     responses:
 *       201:
 *         description: User successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     username:
 *                       type: string
 *                       example: john_doe
 *                     email:
 *                       type: string
 *                       example: john@example.com
 *       400:
 *         description: Bad request (e.g., user already exists)
 *       500:
 *         description: Server error
 */
router.post('/register', register);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login user
 *     description: Login with email and password
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
router.post('/login', login);

/**
 * @swagger
 * /api/users/change-password:
 *   post:
 *     summary: Change user password
 *     description: Change the password for the logged-in user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: User's ID
 *                 example: 1
 *               currentPassword:
 *                 type: string
 *                 format: password
 *                 description: User's current password
 *                 example: currentPassword123
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 description: User's new password
 *                 example: newPassword123
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       401:
 *         description: Current password is incorrect
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.post('/change-password', changePassword);

/**
 * @swagger
 * /api/users/purchase-credits:
 *   post:
 *     summary: Purchase credits
 *     description: Add credits to user's account
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - creditAmount
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: User's ID
 *                 example: 1
 *               creditAmount:
 *                 type: integer
 *                 description: Number of credits to purchase
 *                 example: 1
 *     responses:
 *       200:
 *         description: Credits purchased successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.post('/purchase-credits', purchaseCredits);

/**
 * @swagger
 * /api/users/purchase-subscription:
 *   post:
 *     summary: Purchase premium subscription
 *     description: Activate premium subscription for a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - months
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: User's ID
 *                 example: 1
 *               months:
 *                 type: integer
 *                 description: Number of months to subscribe
 *                 example: 1
 *     responses:
 *       200:
 *         description: Subscription purchased successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.post('/purchase-subscription', purchaseSubscription);

/**
 * @swagger
 * /api/users/update-credits:
 *   post:
 *     summary: Update user credits
 *     description: Update the credit count for a user (increase or decrease)
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - creditAmount
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: User's ID
 *                 example: 1
 *               creditAmount:
 *                 type: integer
 *                 description: Amount to change credits by (positive or negative)
 *                 example: -1
 *     responses:
 *       200:
 *         description: Credits updated successfully
 *       400:
 *         description: Not enough credits
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.post('/update-credits', updateCredits);

module.exports = router; 