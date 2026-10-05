import { chromium } from 'playwright';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';

let projectData = {
  name: "Claude Code",
  tagline: "Agentic Terminal Velocity.",
  url: "anthropic.com",
  colors: { bg: "#0b0f19", primary: "linear-gradient(90deg, #ea580c, #f43f5e)" },
  problemLines: ["Tired of context boundaries?", "Manual terminal orchestration?", "Slow debugging pipelines?"],
  features: [
    { title: "Deep Repo Scans", desc: "Consumes up to 678k context tokens natively" },
    { title: "Direct Execution", desc: "Runs code checks and processes PRs directly" },
    { title: "Universal Plugin Support", desc: "Integrates with custom agent utilities instantly" }
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
  console.log(`\n🎬 Initiating high-fidelity render engine for: ${projectData.name}...`);
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: WIDTH, height: HEIGHT });

  const absolutePath = path.resolve('template.html').replace(/\\/g, '/');
  const fileUrl = `file:///${absolutePath}`;
  
  await page.goto(fileUrl, { waitUntil: 'load' });
  await page.evaluate((data) => window.loadProjectData(data), projectData);

  // Link to the self-contained package path
  const ffmpegPath = ffmpegInstaller.path;
  console.log(`🎥 Routing video stream via local compiler bundle: ${ffmpegPath}`);

  const ffmpegArgs = [
    '-y', '-f', 'image2pipe', '-vcodec', 'png', '-r', `${FPS}`, '-i', '-', 
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '17', OUTPUT_FILE
  ];
  
  const ffmpeg = spawn(ffmpegPath, ffmpegArgs);

  ffmpeg.on('error', (err) => {
    console.error('Failed to start local FFmpeg process loop:', err);
  });

  for (let i = 0; i < TOTAL_FRAMES; i++) {
    await page.evaluate(({ frame, fps }) => window.seekToFrame(frame, fps), { frame: i, fps: FPS });
    const screenshot = await page.screenshot({ type: 'png' });
    ffmpeg.stdin.write(screenshot);
    
    if (i % 60 === 0) {
      console.log(`Processing media pipeline buffers... [Frame ${i}/${TOTAL_FRAMES}]`);
    }
  }

  ffmpeg.stdin.end();
  await new Promise((resolve) => ffmpeg.on('close', resolve));
  await browser.close();
  console.log(`\n🎉 Success! Standalone launch file compiled -> ./${OUTPUT_FILE}\n`);
}

buildVideo().catch(console.error);
