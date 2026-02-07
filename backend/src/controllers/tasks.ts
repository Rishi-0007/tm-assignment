import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

// Get all tasks with pagination, filtering, and search
export const getTasks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { page = '1', limit = '10', status, search } = req.query;
    
    // Safely cast query params to strings/numbers
    const pageNum = Number(String(page));
    const limitNum = Number(String(limit));
    const statusStr = status ? String(status) : undefined;
    const searchStr = search ? String(search) : undefined;
    
    const skip = (pageNum - 1) * limitNum;
    
    const where: any = { userId };
    
    if (statusStr && statusStr !== 'all') {
      where.status = statusStr;
    }
    
    if (searchStr) {
      where.title = { contains: searchStr, mode: 'insensitive' };
    }

    const [tasks, total] = await prisma.$transaction([
      prisma.task.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.task.count({ where }),
    ]);

    res.json({
      tasks,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create a new task
export const createTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { title, description, status } = req.body;

    if (!title) {
      res.status(400).json({ error: 'Title is required' });
      return;
    }

    if (!userId) {
       res.status(401).json({ error: 'Unauthorized' });
       return;
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status: status || 'pending',
        userId,
      },
    });

    res.status(201).json(task);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get a single task
export const getTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    if (!id) {
        res.status(400).json({ error: 'Task ID required' });
        return;
    }

    const task = await prisma.task.findFirst({
      where: { id: String(id), userId },
    });

    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    res.json(task);
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update a task
export const updateTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;
    const { title, description, status } = req.body;

    if (!id) {
        res.status(400).json({ error: 'Task ID required' });
        return;
    }

    const task = await prisma.task.findFirst({ where: { id: String(id), userId } });

    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    const updatedTask = await prisma.task.update({
      where: { id: String(id) },
      data: { title, description, status },
    });

    res.json(updatedTask);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete a task
export const deleteTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    if (!id) {
        res.status(400).json({ error: 'Task ID required' });
        return;
    }

    const task = await prisma.task.findFirst({ where: { id: String(id), userId } });

    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    await prisma.task.delete({ where: { id: String(id) } });

    res.sendStatus(204);
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Toggle task status
export const toggleTaskCategory = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const { id } = req.params;

        if (!id) {
            res.status(400).json({ error: 'Task ID required' });
            return;
        }

        const task = await prisma.task.findFirst({ where: { id: String(id), userId } });

        if (!task) {
            res.status(404).json({ error: 'Task not found' });
            return;
        }

        const newStatus = task.status === 'completed' ? 'pending' : 'completed';

        const updatedTask = await prisma.task.update({
            where: { id: String(id) },
            data: { status: newStatus },
        });

        res.json(updatedTask);
    } catch (error) {
        console.error('Toggle task error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
