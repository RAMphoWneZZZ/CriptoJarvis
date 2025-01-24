import { Router } from 'express';
import { register, login } from '../controllers/auth.controller.js';
import { validateSchema } from '../middleware/validate.middleware.js';
import { loginSchema, registerSchema } from '../schemas/auth.schema.js';

const router = Router();

router.post('/register', validateSchema(registerSchema), register);
router.post('/login', validateSchema(loginSchema), login);

export { router as authRouter };