import { connectDB, disconnectDB } from '../src/config/db.js';
import User from '../src/models/User.js';
import Blog from '../src/models/Blog.js';
import Comment from '../src/models/Comment.js';

const seedDB = async () => {
  try {
    await connectDB();

    const seedUserPassword = process.env.SEED_USER_PASSWORD;
    if (!seedUserPassword) {
      throw new Error('SEED_USER_PASSWORD is required to seed users securely');
    }

    // Clear existing data
    await User.deleteMany({});
    await Blog.deleteMany({});
    await Comment.deleteMany({});

    console.log('Cleared existing data');

    // Create test users
    const user1 = await User.create({
      name: 'Alice Johnson',
      email: 'alice@example.com',
      password: seedUserPassword,
      bio: 'Full-stack developer passionate about React and Node.js',
      profilePicture: 'https://via.placeholder.com/150/667eea/ffffff?text=Alice',
    });

    const user2 = await User.create({
      name: 'Bob Smith',
      email: 'bob@example.com',
      password: seedUserPassword,
      bio: 'Data scientist and AI enthusiast',
      profilePicture: 'https://via.placeholder.com/150/764ba2/ffffff?text=Bob',
    });

    const user3 = await User.create({
      name: 'Carol Davis',
      email: 'carol@example.com',
      password: seedUserPassword,
      bio: 'Design thinking and UX advocate',
      profilePicture: 'https://via.placeholder.com/150/f093fb/ffffff?text=Carol',
    });

    console.log('✓ Created 3 test users');

    // Create test blogs
    const blogs = await Blog.create([
      {
        title: 'Getting Started with React Hooks',
        content:
          'React Hooks are a powerful new feature in React 16.8+ that allows you to use state and other React features without writing a class component. This comprehensive guide will walk you through the basics of useState, useEffect, and custom hooks. We\'ll explore how hooks simplify component reuse and help organize component logic by what it concerns rather than lifecycle methods. Learn best practices, common patterns, and pitfalls to avoid when working with hooks in modern React applications.',
        tags: ['React', 'JavaScript', 'Hooks', 'Frontend'],
        imageUrl: 'https://via.placeholder.com/600x400/667eea/ffffff?text=React+Hooks',
        author: user1._id,
        likes: [user2._id, user3._id],
        viewCount: 234,
      },
      {
        title: 'Building Scalable Node.js Applications',
        content:
          'When building production Node.js applications, scalability is critical. This guide covers essential patterns for structuring your codebase, managing dependencies, and implementing proper error handling. We\'ll discuss the MVC architecture, service layers, middleware patterns, and database connection pooling. Learn how to leverage clustering, horizontal scaling with load balancers, and asynchronous patterns to build applications that can handle millions of requests. Real-world examples and performance optimization tips included.',
        tags: ['Node.js', 'Backend', 'Scalability', 'Architecture'],
        imageUrl: 'https://via.placeholder.com/600x400/764ba2/ffffff?text=Node.js',
        author: user2._id,
        likes: [user1._id],
        viewCount: 156,
      },
      {
        title: 'MongoDB Best Practices and Optimization',
        content:
          'MongoDB is a flexible NoSQL database, but with great flexibility comes the need for thoughtful schema design. This article covers indexing strategies, aggregation pipeline optimization, and sharding approaches for distributed systems. We\'ll explore how to structure your collections, avoid common pitfalls like unbounded arrays, and leverage MongoDB Atlas for cloud deployment. Learn monitoring techniques, query profiling, and performance benchmarking to ensure your MongoDB instances run smoothly at scale.',
        tags: ['MongoDB', 'Database', 'NoSQL', 'Optimization'],
        imageUrl: 'https://via.placeholder.com/600x400/f093fb/ffffff?text=MongoDB',
        author: user3._id,
        likes: [],
        viewCount: 89,
      },
      {
        title: 'JWT Authentication: Security Best Practices',
        content:
          'JSON Web Tokens (JWT) are a popular choice for implementing authentication in modern applications. However, proper implementation is critical for security. This guide covers token generation, expiration strategies, refresh token rotation, and secure storage practices. We\'ll discuss the differences between localStorage and httpOnly cookies, and when to use each. Learn about CORS, CSRF protection, and common vulnerabilities to avoid. Includes practical examples using jsonwebtoken library and Express middleware.',
        tags: ['Authentication', 'Security', 'JWT', 'Backend'],
        imageUrl: 'https://via.placeholder.com/600x400/4facfe/ffffff?text=JWT+Auth',
        author: user1._id,
        likes: [user2._id, user3._id],
        viewCount: 412,
      },
      {
        title: 'SCSS Styling Patterns and Organization',
        content:
          'Properly organizing your SCSS can significantly improve maintainability and performance. Explore the 7-1 pattern, SMACSS methodology, and CSS Grid layout techniques. We\'ll cover mixins, variables, nesting best practices, and how to avoid specificity issues. Learn about CSS variables and when to use them over SCSS variables. Includes patterns for responsive design, utility classes, and component-scoped styling. Examples include creating a design system that scales across large projects.',
        tags: ['SCSS', 'CSS', 'Frontend', 'Styling'],
        imageUrl: 'https://via.placeholder.com/600x400/00d4ff/ffffff?text=SCSS',
        author: user2._id,
        likes: [user1._id],
        viewCount: 267,
      },
    ]);

    console.log('✓ Created 5 test blogs');

    // Create test comments
    await Comment.create([
      {
        content: 'Great explanation of hooks! This really helped me understand the useEffect cleanup pattern.',
        author: user2._id,
        blog: blogs[0]._id,
      },
      {
        content: 'Excellent article on scalability. I\'ve implemented some of these patterns in my current project.',
        author: user3._id,
        blog: blogs[1]._id,
      },
      {
        content: 'The JWT section was particularly helpful. Security is often overlooked in tutorials.',
        author: user1._id,
        blog: blogs[3]._id,
      },
    ]);

    console.log('✓ Created 3 test comments');

    console.log('\n=== Database Seeded Successfully ===');
    console.log('\nTest Accounts:');
    console.log('User 1: alice@example.com / (password from SEED_USER_PASSWORD)');
    console.log('User 2: bob@example.com / (password from SEED_USER_PASSWORD)');
    console.log('User 3: carol@example.com / (password from SEED_USER_PASSWORD)');
    console.log('\nSample blogs created with comments and likes.\n');

    await disconnectDB();
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

await seedDB();
