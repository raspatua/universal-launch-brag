<!DOCTYPE html>
<html>
<head>
  <script src="https://tailwindcss.com"></script>
  <style>
    body { background-color: #020617; color: white; font-family: system-ui, sans-serif; overflow: hidden; }
    .scanlines {
      background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.4) 50%), 
                  linear-gradient(90deg, rgba(255, 255, 255, 0.02), rgba(0, 0, 0, 0.2));
      background-size: 100% 4px, 6px 100%;
    }
    .phone-stage { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
  </style>
</head>
<body class="w-[1080px] h-[1920px] flex justify-center items-center text-center p-16 relative scanlines select-none">
  
  <div id="grid-backdrop" class="absolute inset-0 opacity-15" style="background-image: linear-gradient(to right, #334155 1px, transparent 1px), linear-gradient(to bottom, #334155 1px, transparent 1px); background-size: 60px 60px;"></div>
  <div id="glow-mesh" class="absolute w-[1000px] h-[1000px] rounded-full filter blur-[160px] top-[20%] left-[-10%] opacity-20"></div>
  
  <!-- SCENE 1: HOOK REVEAL -->
  <div id="scene-hook" class="absolute opacity-0 flex flex-col items-center">
    <h1 id="logo" class="text-9xl font-black bg-clip-text text-transparent tracking-tighter leading-none py-4"></h1>
    <p id="tagline" class="text-slate-400 text-4xl mt-8 font-light tracking-wide"></p>
  </div>

  <!-- PREMIUM SCENE 2 & 3: DEVICE FRAMES MOCKUP -->
  <div id="phone-container" class="phone-stage absolute opacity-0 translate-y-[100px] w-[540px] h-[1100px] bg-black border-[12px] border-slate-800 rounded-[60px] shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col relative">
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[180px] h-[30px] bg-slate-800 rounded-b-2xl z-50"></div>
    <div id="phone-content" class="w-full h-full flex flex-col justify-center items-center p-8 bg-slate-950 relative">
      
      <!-- Mock Notification Alert -->
      <div id="mock-alert" class="w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-6 text-center shadow-xl opacity-0 scale-90 transition-all duration-300">
        <h4 id="alert-title" class="text-white text-2xl font-bold">System Status</h4>
        <p id="alert-body" class="text-slate-400 text-lg mt-2"></p>
        <div class="mt-6 pt-4 border-t border-slate-800 grid grid-cols-2 gap-4 text-xl font-semibold">
          <div class="text-slate-500">Close</div>
          <div class="text-blue-500">Fix Now</div>
        </div>
      </div>

      <!-- Feature Visual Dashboard Area -->
      <div id="mock-dashboard" class="w-full flex flex-col gap-6 opacity-0 transition-all duration-300 absolute px-8">
        <div class="w-full bg-slate-900 border border-slate-800 rounded-2xl p-5 text-left">
          <div class="flex justify-between items-center">
            <span id="feat-title-1" class="text-xl font-bold text-white"></span>
            <span class="text-sm font-mono bg-blue-500/20 text-blue-400 px-2 py-1 rounded">Active</span>
          </div>
          <p id="feat-desc-1" class="text-slate-400 text-sm mt-2"></p>
        </div>
        <div id="progress-card" class="w-full bg-slate-900 border border-slate-800 rounded-2xl p-5 text-left">
          <div class="flex justify-between text-sm font-mono text-slate-400 mb-2">
            <span>Optimizing parameters...</span>
            <span id="progress-text">0%</span>
          </div>
          <div class="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
            <div id="progress-bar" class="h-full bg-gradient-to-r from-blue-500 to-purple-500 w-[0%]"></div>
          </div>
        </div>
      </div>

    </div>
  </div>

  <!-- SCENE 4: CTA OUTRO -->
  <div id="scene-cta" class="absolute opacity-0 flex flex-col items-center">
    <h2 id="cta-head" class="text-7xl font-black text-white mb-16 tracking-tight"></h2>
    <div id="cta-pill" class="px-20 py-10 rounded-full flex items-center justify-center shadow-2xl">
      <span id="cta-url" class="text-4xl font-mono font-black tracking-widest text-white"></span>
    </div>
  </div>

  <script>
    window.loadProjectData = (data) => {
      const primaryGrad = data.colors?.primary || "linear-gradient(90deg, #3b82f6, #8b5cf6)";
      const bgHex = data.colors?.bg || "#020617";
      document.body.style.backgroundColor = bgHex;
      
      document.getElementById('logo').style.backgroundImage = primaryGrad;
      document.getElementById('logo').innerText = data.name;
      document.getElementById('tagline').innerText = data.tagline;
      document.getElementById('cta-head').innerText = data.tagline;
      document.getElementById('cta-url').innerText = data.url;
      document.getElementById('cta-pill').style.background = primaryGrad;
      document.getElementById('glow-mesh').style.background = primaryGrad;

      document.getElementById('alert-title').innerText = data.name;
      document.getElementById('alert-body').innerText = data.problemLines?.[0] || "Action required";
      document.getElementById('feat-title-1').innerText = data.features?.[0]?.title || "Core Feature";
      document.getElementById('feat-desc-1').innerText = data.features?.[0]?.desc || "Active framework update status";
    };

    window.seekToFrame = (frameIndex, fps) => {
      const time = frameIndex / fps;
      
      document.getElementById("scene-hook").style.opacity = 0;
      document.getElementById("phone-container").style.opacity = 0;
      document.getElementById("mock-alert").style.opacity = 0;
      document.getElementById("mock-dashboard").style.opacity = 0;
      document.getElementById("scene-cta").style.opacity = 0;

      if (time >= 0 && time < 3) {
        const hook = document.getElementById("scene-hook");
        hook.style.opacity = 1;
        hook.style.transform = `scale(${0.9 + (time/3) * 0.1})`;
      }
      else if (time >= 3 && time < 7) {
        document.getElementById("phone-container").style.opacity = 1;
        document.getElementById("phone-container").style.transform = "translateY(0px) scale(1)";
        document.getElementById("mock-alert").style.opacity = 1;
        document.getElementById("mock-alert").style.transform = "scale(1)";
      }
      else if (time >= 7 && time < 15) {
        document.getElementById("phone-container").style.opacity = 1;
        document.getElementById("phone-container").style.transform = "translateY(0px) scale(1.05)";
        document.getElementById("mock-dashboard").style.opacity = 1;
        
        const scanProgress = Math.min(100, Math.floor(((time - 7) / 8) * 100));
        document.getElementById("progress-text").innerText = `${scanProgress}%`;
        document.getElementById("progress-bar").style.width = `${scanProgress}%`;
      }
      else if (time >= 15) {
        document.getElementById("scene-cta").style.opacity = 1;
        const pulse = 1 + Math.sin(time * 6) * 0.02;
        document.getElementById("cta-pill").style.transform = `scale(${pulse})`;
      }
    };
  </script>
</body>
</html>
