// seed.js — Populate DB with sample data for development
// Run: node seed.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const Video = require('./models/Video');
const Comment = require('./models/Comment');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/yewtoob';

// Sample videos using public domain / freely accessible sources
const SAMPLE_VIDEOS = [
  {
    title: 'Big Buck Bunny — Open Source Animation',
    description: 'A large and lovable rabbit deals with bullying by doing what any rabbit would do: Get revenge. Big Buck Bunny is a short computer-animated comedy film.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnailUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
    tags: ['animation', 'open source', 'bunny', 'comedy'],
    category: 'Entertainment',
    views: 124500,
    likes: 8920,
  },
  {
    title: 'Elephant Dream — Blender Foundation',
    description: 'Elephant Dream is the story of two strange characters exploring a caotic mechanical world.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnailUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg',
    tags: ['animation', 'blender', 'dream', 'short film'],
    category: 'Film',
    views: 89300,
    likes: 6210,
  },
  {
    title: 'For Bigger Blazes — Chromecast Ad',
    description: 'HBO GO now works with Chromecast -- the easiest way to enjoy online video on your TV.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg',
    tags: ['chromecast', 'hbo', 'streaming'],
    category: 'Technology',
    views: 45200,
    likes: 3100,
  },
  {
    title: 'For Bigger Escapes',
    description: 'Introducing Chromecast. The easiest way to enjoy online video and music on your TV—for when it is time to get away.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnailUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerEscapes.jpg',
    tags: ['chromecast', 'escape', 'travel'],
    category: 'Travel',
    views: 32100,
    likes: 2800,
  },
  {
    title: 'Subaru Outback — Joyride',
    description: 'Joyride with the Subaru Outback on an open road adventure.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
    thumbnailUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/SubaruOutbackOnStreetAndDirt.jpg',
    tags: ['cars', 'subaru', 'driving', 'adventure'],
    category: 'Autos',
    views: 210000,
    likes: 15400,
  },
  {
    title: 'Tears of Steel — Open Movie',
    description: 'Tears of Steel is a short science-fiction film made with Blender 3D animation software.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    thumbnailUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/TearsOfSteel.jpg',
    tags: ['sci-fi', 'blender', 'short film', 'vfx'],
    category: 'Film',
    views: 560000,
    likes: 42100,
  },
  {
    title: 'Volkswagen GTI — Review',
    description: 'A detailed look at the Volkswagen GTI performance and handling characteristics.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
    thumbnailUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/VolkswagenGTIReview.jpg',
    tags: ['volkswagen', 'gti', 'review', 'cars'],
    category: 'Autos',
    views: 98000,
    likes: 7300,
  },
  {
    title: 'We Are Going On Bullrun',
    description: 'Join us as we embark on the legendary Bullrun rally across the United States.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    thumbnailUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/WeAreGoingOnBullrun.jpg',
    tags: ['rally', 'cars', 'road trip', 'bullrun'],
    category: 'Autos',
    views: 175000,
    likes: 11200,
  },
];

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('✅  Connected to MongoDB');

  // Clear existing
  await Promise.all([User.deleteMany(), Video.deleteMany(), Comment.deleteMany()]);
  console.log('🗑️   Cleared existing data');

  // Create demo user
  const user = await User.create({
    username: 'YewToobAdmin',
    email: 'admin@yewtoob.com',
    password: 'password123',
  });
  console.log('👤  Created demo user: admin@yewtoob.com / password123');

  // Create videos
  const videos = await Video.insertMany(
    SAMPLE_VIDEOS.map((v) => ({
      ...v,
      uploader: user._id,
      uploaderName: user.username,
    }))
  );
  console.log(`🎬  Created ${videos.length} sample videos`);

  // Add sample comments
  const commentTexts = [
    'This is absolutely incredible! 🔥',
    'Thanks for sharing, I learned so much from this.',
    'Great content as always, keep it up!',
    'Wow, the production quality here is amazing.',
    'First time watching and I am already hooked!',
  ];

  const comments = [];
  for (const video of videos.slice(0, 4)) {
    for (let i = 0; i < 3; i++) {
      comments.push({
        video: video._id,
        author: user._id,
        authorName: user.username,
        text: commentTexts[i % commentTexts.length],
        likes: Math.floor(Math.random() * 50),
      });
    }
  }
  await Comment.insertMany(comments);
  console.log(`💬  Created ${comments.length} sample comments`);

  console.log('\n🚀  Seed complete! Start the server with: npm run dev');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
