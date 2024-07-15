const express = require('express');
const {createStudent,getallUsers, deleteUser,updateUser} = require('../Controllers/users');
const authMiddleware = require('../Middleware/Auth');

const router = express.Router();

router.get('/', (req, res) => {
    res.send('this is user route');// this gets executed when user visit http://localhost:3000/user
});
router.post('/createUser',authMiddleware,createStudent);
router.get('/allUsers',authMiddleware,getallUsers);
router.delete('/deleteUser',authMiddleware,deleteUser);
router.patch('/updateUser',authMiddleware,updateUser);

module.exports = router;