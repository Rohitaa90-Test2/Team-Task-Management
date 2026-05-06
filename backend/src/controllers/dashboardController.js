const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getProjectDashboard = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Total tasks
    const totalTasks = await prisma.task.count({
      where: { projectId: parseInt(projectId) }
    });

    // Tasks by status
    const tasksByStatus = await prisma.task.groupBy({
      by: ['status'],
      where: { projectId: parseInt(projectId) },
      _count: {
        id: true
      }
    });

    // Tasks per user - single query with user details
    const tasksPerUserWithDetails = await prisma.task.groupBy({
      by: ['assignedToId'],
      where: {
        projectId: parseInt(projectId),
        assignedToId: { not: null }
      },
      _count: { id: true }
    }).then(async (groups) => {
      const users = await prisma.user.findMany({
        where: { id: { in: groups.map(g => g.assignedToId) } },
        select: { id: true, name: true, email: true }
      });
      const userMap = Object.fromEntries(users.map(u => [u.id, u]));
      return groups.map(g => ({ user: userMap[g.assignedToId], taskCount: g._count.id }));
    });

    // Overdue tasks
    const overdueTasks = await prisma.task.findMany({
      where: {
        projectId: parseInt(projectId),
        status: { not: 'DONE' },
        dueDate: {
          lt: new Date()
        }
      },
      include: {
        assignedTo: { select: { id: true, name: true, email: true } },
        createdBy: { select: { id: true, name: true, email: true } }
      }
    });

    res.json({
      message: 'Dashboard data retrieved successfully',
      dashboard: {
        totalTasks,
        tasksByStatus: tasksByStatus.map(item => ({
          status: item.status,
          count: item._count.id
        })),
        tasksPerUser: tasksPerUserWithDetails,
        overdueTasksCount: overdueTasks.length,
        overdueTasks
      }
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({ message: 'Error fetching dashboard data' });
  }
};

const getUserDashboard = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get all projects for user
    const userProjects = await prisma.projectMember.findMany({
      where: { userId },
      include: {
        project: true
      }
    });

    const projectIds = userProjects.map(pm => pm.project.id);

    // Total tasks in user's projects
    const totalAssignedTasks = await prisma.task.count({
      where: {
        projectId: { in: projectIds }
      }
    });

    // Tasks by status in user's projects
    const assignedTasksByStatus = await prisma.task.groupBy({
      by: ['status'],
      where: {
        projectId: { in: projectIds }
      },
      _count: {
        id: true
      }
    });

    // Overdue assigned tasks
    const overdueAssignedTasks = await prisma.task.findMany({
      where: {
        assignedToId: userId,
        projectId: { in: projectIds },
        status: { not: 'DONE' },
        dueDate: {
          lt: new Date()
        }
      },
      include: {
        project: { select: { id: true, name: true } },
        createdBy: { select: { id: true, name: true, email: true } }
      }
    });

    // Tasks created by user
    const tasksCreatedByUser = await prisma.task.count({
      where: {
        createdById: userId,
        projectId: { in: projectIds }
      }
    });

    // User's projects summary - single query with task counts
    const projectsWithTasks = await prisma.project.findMany({
      where: { id: { in: projectIds } },
      include: {
        _count: { select: { tasks: true } },
        tasks: { where: { status: 'DONE' }, select: { id: true } },
        members: { where: { userId }, select: { role: true } }
      }
    });

    const projectsSummary = projectsWithTasks.map((p) => ({
      projectId: p.id,
      projectName: p.name,
      role: p.members[0]?.role,
      taskCount: p._count.tasks,
      completedTasks: p.tasks.length,
      pendingTasks: p._count.tasks - p.tasks.length
    }));

    res.json({
      message: 'User dashboard retrieved successfully',
      dashboard: {
        totalAssignedTasks,
        tasksCreatedByUser,
        assignedTasksByStatus: assignedTasksByStatus.map(item => ({
          status: item.status,
          count: item._count.id
        })),
        overdueTasksCount: overdueAssignedTasks.length,
        overdueTasks: overdueAssignedTasks,
        projectsSummary
      }
    });
  } catch (error) {
    console.error('Get user dashboard error:', error);
    res.status(500).json({ message: 'Error fetching user dashboard' });
  }
};

const getProjectStatistics = async (req, res) => {
  try {
    const { projectId } = req.params;
    const projectIdNum = parseInt(projectId);

    // Project members count
    const membersCount = await prisma.projectMember.count({
      where: { projectId: projectIdNum }
    });

    // Task completion rate
    const totalTasks = await prisma.task.count({
      where: { projectId: projectIdNum }
    });

    const completedTasks = await prisma.task.count({
      where: {
        projectId: projectIdNum,
        status: 'DONE'
      }
    });

    const completionRate = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(2) : 0;

    // Most active members - single batch query
    const mostActiveMembers = await prisma.task.groupBy({
      by: ['createdById'],
      where: { projectId: projectIdNum },
      _count: { id: true }
    });

    const topMembers = mostActiveMembers.slice(0, 5);
    const activeUsers = await prisma.user.findMany({
      where: { id: { in: topMembers.map(m => m.createdById) } },
      select: { id: true, name: true, email: true }
    });
    const activeUserMap = Object.fromEntries(activeUsers.map(u => [u.id, u]));
    const mostActiveMembersWithDetails = topMembers.map(m => ({
      user: activeUserMap[m.createdById],
      taskCount: m._count.id
    }));

    // Tasks created in last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const tasksCreatedLastWeek = await prisma.task.count({
      where: {
        projectId: projectIdNum,
        createdAt: { gte: sevenDaysAgo }
      }
    });

    res.json({
      message: 'Project statistics retrieved successfully',
      statistics: {
        membersCount,
        totalTasks,
        completedTasks,
        completionRate: `${completionRate}%`,
        pendingTasks: totalTasks - completedTasks,
        mostActiveMembers: mostActiveMembersWithDetails,
        tasksCreatedLastWeek
      }
    });
  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({ message: 'Error fetching statistics' });
  }
};

module.exports = {
  getProjectDashboard,
  getUserDashboard,
  getProjectStatistics
};
