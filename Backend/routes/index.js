import { Router } from 'express';
import {
  deleteUser,
  getAllUsers,
  Login,
  Register,
  SendPasswordResetEmail,
} from '../Controller/UserController.js';
import { verificationToken } from '../middlewares/verificationToken.js';

const router = Router();

router.get('/', (request, response) => {
  response.send({ message: 'Hello from routes!' });
});

//#region User routes
router.get('/users/all', verificationToken, getAllUsers);
router.post('/login', Login);
router.post('/register', Register);
router.post('/users/resetPassword', SendPasswordResetEmail);
router.delete('/users/delete', verificationToken, deleteUser);

router.get('/test/test', (req, res) => {
  res.send({ message: 'Test route works!' });
});
export default router;
