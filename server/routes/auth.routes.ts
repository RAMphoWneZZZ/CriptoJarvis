import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';
import { validateSchema } from '../middleware/validate.middleware';
import { loginSchema, registerSchema } from '../schemas/auth.schema';

const router = Router();

router.post('/register', validateSchema(registerSchema), register);
router.post('/login', validateSchema(loginSchema), login);

export { router as authRouter };