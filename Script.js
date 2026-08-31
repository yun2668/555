document.addEventListener("DOMContentLoaded", () => {
  // Mobile menu
  const menuBtn = document.getElementById("menuBtn");
  const mainNav = document.getElementById("mainNav");

  if (menuBtn && mainNav) {
    menuBtn.addEventListener("click", () => {
      const open = mainNav.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", String(open));
    });
    mainNav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        mainNav.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  function prepareCanvas(canvas, cssHeight) {
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(280, Math.floor(rect.width || canvas.parentElement?.clientWidth || 600));
    const height = cssHeight;
    const dpr = Math.max(1, window.devicePixelRatio || 1);

    canvas.style.width = "100%";
    canvas.style.height = height + "px";
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);

    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx, width, height };
  }

  function drawAQITrend() {
    const canvas = document.getElementById("aqiTrend");
    const p = prepareCanvas(canvas, window.innerWidth < 700 ? 260 : 320);
    if (!p) return;
    const { ctx, width, height } = p;

    const values = [47, 44, 42, 45, 49, 54, 57, 61, 65, 68, 70, 67, 63, 60, 58, 56, 59, 62, 66, 69, 67, 64, 62, 62];
    const labels = ["00","01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23"];
    const pad = { l: 48, r: 20, t: 24, b: 42 };
    const cw = width - pad.l - pad.r;
    const ch = height - pad.t - pad.b;
    const minY = 0, maxY = 100;

    ctx.clearRect(0,0,width,height);

    // background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0,0,width,height);

    // grid
    ctx.strokeStyle = "#dce9e6";
    ctx.lineWidth = 1;
    ctx.font = "12px Microsoft JhengHei, Arial";
    ctx.fillStyle = "#71868b";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";

    [0,25,50,75,100].forEach(v => {
      const y = pad.t + ch - ((v-minY)/(maxY-minY))*ch;
      ctx.beginPath();
      ctx.moveTo(pad.l,y);
      ctx.lineTo(width-pad.r,y);
      ctx.stroke();
      ctx.fillText(String(v), pad.l-8, y);
    });

    // x labels
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    labels.forEach((lab, i) => {
      if (i % (window.innerWidth < 700 ? 4 : 3) !== 0 && i !== labels.length-1) return;
      const x = pad.l + (i/(labels.length-1))*cw;
      ctx.fillText(lab, x, height-pad.b+12);
    });

    // moderate zone highlight
    const y100 = pad.t;
    const y51 = pad.t + ch - (51/100)*ch;
    ctx.fillStyle = "rgba(245, 200, 65, .10)";
    ctx.fillRect(pad.l, y100, cw, y51-y100);

    // area fill
    const pts = values.map((v,i)=>({
      x: pad.l + (i/(values.length-1))*cw,
      y: pad.t + ch - (v/100)*ch
    }));
    const grad = ctx.createLinearGradient(0,pad.t,0,pad.t+ch);
    grad.addColorStop(0,"rgba(20,139,120,.24)");
    grad.addColorStop(1,"rgba(20,139,120,0)");
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pad.t+ch);
    pts.forEach(pt=>ctx.lineTo(pt.x,pt.y));
    ctx.lineTo(pts[pts.length-1].x,pad.t+ch);
    ctx.closePath();
    ctx.fillStyle=grad;
    ctx.fill();

    // line
    ctx.beginPath();
    pts.forEach((pt,i)=> i===0 ? ctx.moveTo(pt.x,pt.y) : ctx.lineTo(pt.x,pt.y));
    ctx.strokeStyle="#168b78";
    ctx.lineWidth=4;
    ctx.lineJoin="round";
    ctx.lineCap="round";
    ctx.stroke();

    // dots
    pts.forEach((pt,i)=>{
      if(i%3===0 || i===pts.length-1){
        ctx.beginPath();
        ctx.arc(pt.x,pt.y,4,0,Math.PI*2);
        ctx.fillStyle="#fff";
        ctx.fill();
        ctx.strokeStyle="#168b78";
        ctx.lineWidth=3;
        ctx.stroke();
      }
    });

    // latest label
    const last = pts[pts.length-1];
    ctx.font="bold 13px Microsoft JhengHei, Arial";
    ctx.textAlign="left";
    ctx.textBaseline="bottom";
    ctx.fillStyle="#173e4a";
    ctx.fillText("最新 AQI 62", Math.min(last.x+10,width-105), last.y-8);

    canvas.dataset.chartReady="1";
  }

  function drawAirPie() {
    const canvas = document.getElementById("airPie");
    if (!canvas) return;
    const size = window.innerWidth < 700 ? 220 : 260;
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    canvas.style.width = size + "px";
    canvas.style.height = size + "px";
    canvas.width = size*dpr;
    canvas.height = size*dpr;
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr,0,0,dpr,0,0);
    ctx.clearRect(0,0,size,size);

    const data = [
      {v:8, c:"#56b879"},
      {v:14,c:"#f0c94b"},
      {v:2, c:"#ef9b37"}
    ];
    const total = data.reduce((s,d)=>s+d.v,0);
    const cx=size/2, cy=size/2, radius=size*.39, inner=size*.24;
    let a=-Math.PI/2;

    data.forEach(d=>{
      const next=a+(d.v/total)*Math.PI*2;
      ctx.beginPath();
      ctx.arc(cx,cy,radius,a,next);
      ctx.arc(cx,cy,inner,next,a,true);
      ctx.closePath();
      ctx.fillStyle=d.c;
      ctx.fill();
      a=next;
    });

    ctx.textAlign="center";
    ctx.textBaseline="middle";
    ctx.fillStyle="#173e4a";
    ctx.font="bold 32px Microsoft JhengHei, Arial";
    ctx.fillText("24",cx,cy-8);
    ctx.fillStyle="#70858a";
    ctx.font="13px Microsoft JhengHei, Arial";
    ctx.fillText("小時",cx,cy+23);
    canvas.dataset.chartReady="1";
  }

  function redrawCharts(){
    drawAQITrend();
    drawAirPie();
  }

  redrawCharts();

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(redrawCharts, 150);
  });
});
