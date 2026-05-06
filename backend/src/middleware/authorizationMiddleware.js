const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const checkProjectMembership = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.userId;

    const member = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId: parseInt(projectId),
          userId: userId
        }
      }
    });

    if (!member) {
      return res.status(403).json({ message: 'You are not a member of this project' });
    }

    req.projectRole = member.role;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Authorization check failed' });
  }
};

const checkAdminRole = (req, res, next) => {
  if (req.projectRole !== 'ADMIN') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

const checkProjectOwner = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.userId;

    const project = await prisma.project.findUnique({
      where: { id: parseInt(projectId) }
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.ownerId !== userId) {
      return res.status(403).json({ message: 'Only project owner can perform this action' });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Authorization check failed' });
  }
};

module.exports = {
  checkProjectMembership,
  checkAdminRole,
  checkProjectOwner
};
