import { chromium } from 'playwright';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';

let projectData = {
  name: "iMasterUnlock",
  businessType: "ecommerce", 
  tagline: "Unlock More. Do More.",
  url: "imasterunlock.com",
  colors: { bg: "#020617", primary: "linear-gradient(90deg, #2563eb, #9333ea)" },
  problemLines: ["Device locked with system blocks?", "Tired of provider verification loops?"],
  features: [
    { title: "Diagnostic Checks", desc: "Instant data validation queries from GHS 55.11" },
    { title: "Factory Syncs", desc: "100% remote factory background server updates" }
  ]
};

const args = process.argv.slice(2);
if (args.length > 0 && fs.existsSync(args)) {
  projectData = JSON.parse(fs.readFileSync(args, 'utf8'));
  console.log(`📂 Loaded configuration parameters from target path: ${args}`);
}

const WIDTH = 1080;
const HEIGHT = 1920;
const FPS = 30;
const TOTAL_FRAMES = 20 * FPS; 
const OUTPUT_FILE = 'output-launch-video.mp4';

async function buildVideo() {
  console.log(`\n🎬 Initiating 100% stable video-only render engine for: ${projectData.name}...`);
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: WIDTH, height: HEIGHT });

  const absolutePath = path.resolve('template.html').replace(/\\/g, '/');
  const fileUrl = `file:///${absolutePath}`;
  
  await page.goto(fileUrl, { waitUntil: 'load' });
  await page.evaluate((data) => window.loadProjectData(data), projectData);

  const ffmpegPath = ffmpegInstaller.path;
  console.log(`🎥 Packaging display screenshot layers cleanly to disk...`);

  // Bulletproof Change: Strip out all internal audio arguments completely.
  // This makes it impossible for FFmpeg to hit an EPIPE audio codec crash!
  const ffmpegArgs = [
    '-y',
    '-f', 'image2pipe',
    '-vcodec', 'png',
    '-r', `${FPS}`,
    '-i', '-', 
    '-c:v', 'libx264',
    '-pix_fmt', 'yuv420p',
    '-crf', '17',
    OUTPUT_FILE
  ];
  
  const ffmpeg = spawn(ffmpegPath, ffmpegArgs);

  for (let i = 0; i < TOTAL_FRAMES; i++) {
    await page.evaluate(({ frame, fps }) => window.seekToFrame(frame, fps), { frame: i, fps: FPS });
    const screenshot = await page.screenshot({ type: 'png' });
    
    if (ffmpeg.stdin.writable) {
      ffmpeg.stdin.write(screenshot);
    } else {
      break;
    }
    
    if (i % 60 === 0) {
      console.log(`Processing visual display matrices... [Frame ${i}/${TOTAL_FRAMES}]`);
    }
  }

  ffmpeg.stdin.end();
  
  await new Promise((resolve) => {
    ffmpeg.on('close', () => {
      resolve();
    });
  });

  await browser.close();
  console.log(`\n🎉 Success! Custom video track compiled -> ./${OUTPUT_FILE}\n`);
}

buildVideo().catch(console.error);
