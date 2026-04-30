require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Project = require('./models/Project');
const Task = require('./models/Task');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Project.deleteMany({});
    await Task.deleteMany({});

    console.log('Cleared existing data.');

    // Create Users
    const admin = await User.create({
      name: 'Sarah Chen',
      email: 'admin@demo.com',
      password: '123456',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'
    });

    const leadDev = await User.create({
      name: 'James Wilson',
      email: 'james@demo.com',
      password: '123456',
      role: 'member',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
    });

    const designer = await User.create({
      name: 'Elena Rodriguez',
      email: 'user@demo.com',
      password: '123456',
      role: 'member',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop'
    });

    const qa = await User.create({
      name: 'David Kim',
      email: 'david@demo.com',
      password: '123456',
      role: 'member',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop'
    });

    console.log('Created professional team.');

    // Create Projects
    const project1 = await Project.create({
      name: 'Ethara AI Dashboard',
      description: 'Building the next-gen AI analytics platform with real-time visualization.',
      owner: admin._id,
      members: [leadDev._id, designer._id, qa._id],
      color: '#6366f1',
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      tags: ['AI', 'Analytics', 'Enterprise']
    });

    const project2 = await Project.create({
      name: 'Mobile Health Tracker',
      description: 'Cross-platform mobile app for tracking daily health metrics and fitness.',
      owner: admin._id,
      members: [leadDev._id, designer._id],
      color: '#10b981',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      tags: ['Mobile', 'Health', 'V2']
    });

    const project3 = await Project.create({
      name: 'Cloud Infrastructure Migration',
      description: 'Transitioning our legacy servers to a serverless AWS architecture.',
      owner: admin._id,
      members: [leadDev._id, qa._id],
      color: '#f59e0b',
      deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      tags: ['DevOps', 'AWS', 'Security']
    });

    console.log('Created strategic projects.');

    // Create Tasks
    await Task.create([
      // Project 1 Tasks
      {
        title: 'Design System Implementation',
        description: 'Create a reusable component library based on the new brand guidelines.',
        project: project1._id,
        assignedTo: designer._id,
        createdBy: admin._id,
        status: 'completed',
        priority: 'high',
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        tags: ['Design', 'UI'],
        activity: [{ user: admin._id, action: 'created', details: 'Initial planning' }]
      },
      {
        title: 'Integrate OpenAI API',
        description: 'Connect the backend to GPT-4 for automated summary generation.',
        project: project1._id,
        assignedTo: leadDev._id,
        createdBy: admin._id,
        status: 'in-progress',
        priority: 'high',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        tags: ['Backend', 'AI'],
        activity: [{ user: admin._id, action: 'created', details: 'Complex integration' }]
      },
      {
        title: 'User Feedback Survey',
        description: 'Gather feedback from beta testers on the new dashboard layout.',
        project: project1._id,
        assignedTo: admin._id,
        createdBy: admin._id,
        status: 'todo',
        priority: 'medium',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        tags: ['UX', 'Research']
      },
      // Project 2 Tasks
      {
        title: 'Flutter Environment Setup',
        description: 'Set up the development environment for the mobile team.',
        project: project2._id,
        assignedTo: leadDev._id,
        createdBy: admin._id,
        status: 'completed',
        priority: 'medium',
        dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        completedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        tags: ['Mobile', 'Dev']
      },
      {
        title: 'Dark Mode Support',
        description: 'Implement dark theme throughout the mobile application.',
        project: project2._id,
        assignedTo: designer._id,
        createdBy: admin._id,
        status: 'review',
        priority: 'low',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        tags: ['UI', 'Styling']
      },
      // Project 3 Tasks
      {
        title: 'Security Audit',
        description: 'Perform a comprehensive security scan of all cloud endpoints.',
        project: project3._id,
        assignedTo: qa._id,
        createdBy: admin._id,
        status: 'todo',
        priority: 'high',
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        tags: ['Security', 'Cloud']
      },
      {
        title: 'Terraform Scripts',
        description: 'Write IaC scripts for automated infrastructure deployment.',
        project: project3._id,
        assignedTo: leadDev._id,
        createdBy: admin._id,
        status: 'in-progress',
        priority: 'high',
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        tags: ['DevOps', 'AWS']
      }
    ]);

    console.log('Created 7 professional tasks.');
    console.log('✅ Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
