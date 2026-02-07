import { Router } from 'express';
import { getTasks, createTask, getTask, updateTask, deleteTask, toggleTaskCategory } from '../controllers/tasks';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken); // Protect all task routes

router.get('/', getTasks);
router.post('/', createTask);
router.get('/:id', getTask);
router.patch('/:id', updateTask);
router.delete('/:id', deleteTask);
router.patch('/:id/toggle', toggleTaskCategory);

export default router;
