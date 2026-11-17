import { generateGrowKazVideo } from '../ai/growkazGenerator';

async function testGrowKaz() {
  console.log('Testing Autonomous GrowKaz Stickman Video Generator...');
  const result = await generateGrowKazVideo({
    title: 'MrBeast Viral Formula',
    script: 'MrBeast ka secret formula kya hai? Pehle wo ek shocking hook deta hai aur viewer ka attention capture karta hai. Phir retention barqarar rakhne ke liye har teen second me naya camera move aur sound effect lagata hai!',
    aspect: '9:16',
    resolution: '720p',
    style: 'emerald',
    onProgress: (pct, msg) => {
      console.log(`[${pct}%] ${msg}`);
    },
  });

  console.log('SUCCESS! Video generated at:', result.videoPath);
  console.log('Duration:', result.durationSeconds, 'seconds');
  console.log('Shots:', result.shotsCount);
}

testGrowKaz().catch((err) => {
  console.error('Test Failed:', err);
  process.exit(1);
});
