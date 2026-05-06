const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createProject = async (req, res) => {
  try {
    console.log('🚀 Creating project with data:', req.body);
    const { name, description } = req.body;
    const ownerId = req.user.userId;
    
    console.log(`📌 Project: ${name}, Owner: ${ownerId}`);

    const project = await prisma.project.create({
      data: {
        name,
        description,
        ownerId,
        members: {
          create: {
            userId: ownerId,
            role: 'ADMIN'
          }
        }
      },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        members: {
          include: {
            user: { select: { id: true, name: true, email: true } }
          }
        }
      }
    });

    res.status(201).json({
      message: 'Project created successfully',
      project
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ message: 'Error creating project' });
  }
};

const getProjectById = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await prisma.project.findUnique({
      where: { id: parseInt(projectId) },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        members: {
          include: {
            user: { select: { id: true, name: true, email: true } }
          }
        },
        tasks: {
          select: {
            id: true,
            title: true,
            status: true,
            dueDate: true
          }
        }
      }
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({ project });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ message: 'Error fetching project' });
  }
};

const getUserProjects = async (req, res) => {
  try {
    const userId = req.user.userId;

    const projects = await prisma.project.findMany({
      where: {
        members: {
          some: {
            userId: userId
          }
        }
      },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        members: {
          include: {
            user: { select: { id: true, name: true, email: true } }
          }
        },
        _count: {
          select: { tasks: true }
        }
      }
    });

    res.json({
      message: 'Projects retrieved successfully',
      projects
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ message: 'Error fetching projects' });
  }
};

const updateProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { name, description } = req.body;

    const project = await prisma.project.update({
      where: { id: parseInt(projectId) },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description })
      },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        members: {
          include: {
            user: { select: { id: true, name: true, email: true } }
          }
        }
      }
    });

    res.json({
      message: 'Project updated successfully',
      project
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ message: 'Error updating project' });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    await prisma.project.delete({
      where: { id: parseInt(projectId) }
    });

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ message: 'Error deleting project' });
  }
};

const addProjectMember = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { email, role } = req.body;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user is already a member
    const existingMember = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId: parseInt(projectId),
          userId: user.id
        }
      }
    });

    if (existingMember) {
      return res.status(409).json({ message: 'User is already a member of this project' });
    }

    const member = await prisma.projectMember.create({
      data: {
        projectId: parseInt(projectId),
        userId: user.id,
        role
      },
      include: {
        user: { select: { id: true, name: true, email: true } }
      }
    });

    res.status(201).json({
      message: 'Member added successfully',
      member
    });
  } catch (error) {
    console.error('Add member error:', error);
    res.status(500).json({ message: 'Error adding member' });
  }
};

const updateProjectMemberRole = async (req, res) => {
  try {
    const { projectId, memberId } = req.params;
    const { role } = req.body;

    const member = await prisma.projectMember.update({
      where: {
        id: parseInt(memberId)
      },
      data: { role },
      include: {
        user: { select: { id: true, name: true, email: true } }
      }
    });

    res.json({
      message: 'Member role updated successfully',
      member
    });
  } catch (error) {
    console.error('Update member role error:', error);
    res.status(500).json({ message: 'Error updating member role' });
  }
};

const removeProjectMember = async (req, res) => {
  try {
    const { projectId, memberId } = req.params;

    await prisma.projectMember.delete({
      where: { id: parseInt(memberId) }
    });

    res.json({ message: 'Member removed successfully' });
  } catch (error) {
    console.error('Remove member error:', error);
    res.status(500).json({ message: 'Error removing member' });
  }
};

module.exports = {
  createProject,
  getProjectById,
  getUserProjects,
  updateProject,
  deleteProject,
  addProjectMember,
  updateProjectMemberRole,
  removeProjectMember
};
