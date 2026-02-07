"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tasks_1 = require("../controllers/tasks");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authenticateToken); // Protect all task routes
router.get('/', tasks_1.getTasks);
router.post('/', tasks_1.createTask);
router.get('/:id', tasks_1.getTask);
router.patch('/:id', tasks_1.updateTask);
router.delete('/:id', tasks_1.deleteTask);
router.patch('/:id/toggle', tasks_1.toggleTaskCategory);
exports.default = router;
