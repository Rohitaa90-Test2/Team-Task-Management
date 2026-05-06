const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createTask = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description, status, assignedToId, dueDate } = req.body;
    const createdById = req.user.userId;

    // Verify assignedToId is a member of the project if provided
    if (assignedToId) {
      const assignedMember = await prisma.projectMember.findUnique({
        where: {
          projectId_userId: {
            projectId: parseInt(projectId),
            userId: assignedToId
          }
        }
      });

      if (!assignedMember) {
        return res.status(400).json({ message: 'Assigned user is not a member of this project' });
      }
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        projectId: parseInt(projectId),
        createdById,
        assignedToId: assignedToId || null,
        status: status || 'TODO',
        dueDate: dueDate ? new Date(dueDate) : null
      },
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
        project: { select: { id: true, name: true } }
      }
    });

    res.status(201).json({
      message: 'Task created successfully',
      task
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Error creating task' });
  }
};

const getProjectTasks = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { status, assignedToId } = req.query;

    const whereClause = {
      projectId: parseInt(projectId)
    };

    if (status) {
      whereClause.status = status;
    }

    if (assignedToId) {
      whereClause.assignedToId = parseInt(assignedToId);
    }

    const tasks = await prisma.task.findMany({
      where: whereClause,
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
        project: { select: { id: true, name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      message: 'Tasks retrieved successfully',
      tasks
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Error fetching tasks' });
  }
};

const getTaskById = async (req, res) => {
  try {
    const { projectId, taskId } = req.params;

    const task = await prisma.task.findUnique({
      where: { id: parseInt(taskId) },
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
        project: { select: { id: true, name: true } }
      }
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.projectId !== parseInt(projectId)) {
      return res.status(403).json({ message: 'Task does not belong to this project' });
    }

    res.json({ task });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ message: 'Error fetching task' });
  }
};

const updateTask = async (req, res) => {
  try {
    const { projectId, taskId } = req.params;
    const { title, description, status, assignedToId, dueDate } = req.body;

    // Verify assignedToId is a member of the project if provided
    if (assignedToId) {
      const assignedMember = await prisma.projectMember.findUnique({
        where: {
          projectId_userId: {
            projectId: parseInt(projectId),
            userId: assignedToId
          }
        }
      });

      if (!assignedMember) {
        return res.status(400).json({ message: 'Assigned user is not a member of this project' });
      }
    }

    const task = await prisma.task.update({
      where: { id: parseInt(taskId) },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(status && { status }),
        ...(assignedToId !== undefined && { assignedToId: assignedToId || null }),
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null })
      },
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
        project: { select: { id: true, name: true } }
      }
    });

    res.json({
      message: 'Task updated successfully',
      task
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Error updating task' });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { projectId, taskId } = req.params;

    await prisma.task.delete({
      where: { id: parseInt(taskId) }
    });

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Error deleting task' });
  }
};

const assignTask = async (req, res) => {
  try {
    const { projectId, taskId } = req.params;
    const { assignedToId } = req.body;

    // Verify assignedToId is a member of the project
    const assignedMember = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId: parseInt(projectId),
          userId: assignedToId
        }
      }
    });

    if (!assignedMember) {
      return res.status(400).json({ message: 'Assigned user is not a member of this project' });
    }

    const task = await prisma.task.update({
      where: { id: parseInt(taskId) },
      data: { assignedToId },
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } }
      }
    });

    res.json({
      message: 'Task assigned successfully',
      task
    });
  } catch (error) {
    console.error('Assign task error:', error);
    res.status(500).json({ message: 'Error assigning task' });
  }
};

const updateTaskStatus = async (req, res) => {
  try {
    const { projectId, taskId } = req.params;
    const { status } = req.body;

    const validStatuses = ['TODO', 'IN_PROGRESS', 'DONE'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const task = await prisma.task.update({
      where: { id: parseInt(taskId) },
      data: { status },
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } }
      }
    });

    res.json({
      message: 'Task status updated successfully',
      task
    });
  } catch (error) {
    console.error('Update task status error:', error);
    res.status(500).json({ message: 'Error updating task status' });
  }
};

module.exports = {
  createTask,
  getProjectTasks,
  getTaskById,
  updateTask,
  deleteTask,
  assignTask,
  updateTaskStatus
};
