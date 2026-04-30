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

    // Create Admin
    const admin = await User.create({
      name: 'Demo Admin',
      email: 'admin@demo.com',
      password: '123456',
      role: 'admin',
    });

    // Create Member
    const member = await User.create({
      name: 'Demo Member',
      email: 'user@demo.com',
      password: '123456',
      role: 'member',
    });

    console.log('Created users.');

    // Create Projects
    const project1 = await Project.create({
      name: 'Website Redesign',
      description: 'Major overhaul of our corporate website with a modern aesthetic.',
      owner: admin._id,
      members: [member._id],
      color: '#6366f1',
      deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    });

    const project2 = await Project.create({
      name: 'Mobile App V2',
      description: 'Developing the second version of our mobile application.',
      owner: admin._id,
      members: [member._id],
      color: '#10b981',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    console.log('Created projects.');

    // Create Tasks
    await Task.create([
      {
        title: 'Design Hero Section',
        description: 'Create a high-fidelity mockup for the landing page hero.',
        project: project1._id,
        assignedTo: member._id,
        createdBy: admin._id,
        status: 'in-progress',
        priority: 'high',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'API Documentation',
        description: 'Document all public endpoints for the mobile team.',
        project: project2._id,
        assignedTo: admin._id,
        createdBy: admin._id,
        status: 'todo',
        priority: 'medium',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Database Schema Design',
        description: 'Finalize the Mongoose models for the core entities.',
        project: project1._id,
        assignedTo: admin._id,
        createdBy: admin._id,
        status: 'completed',
        priority: 'high',
        completedAt: new Date(),
      }
    ]);

    console.log('Created tasks.');
    console.log('✅ Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
