const express = require('express');
const router = express.Router();
const authMiddleware = require('../Middleware/Auth'); // Import your authentication middleware
const { getAllIssues, createIssue, updateIssue, deleteIssue } = require('../Controllers/issues'); // Import controller functions


router.get('/', (req, res) => {
    res.send('this is user route')
});
router.get('/getAllUsers',authMiddleware,getAllIssues)
router.post('/createIssue',authMiddleware,createIssue)
router.put('/updateIssue/:id', authMiddleware, updateIssue);
router.delete('/deleteIssue/:id', authMiddleware, deleteIssue);
module.exports = router