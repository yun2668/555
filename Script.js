document.addEventListener("DOMContentLoaded", () => {

  // ==============================
  // 手機版選單
  // ==============================

  const menuBtn = document.getElementById("menuBtn");
  const mainNav = document.getElementById("mainNav");

  if (menuBtn && mainNav) {

    menuBtn.addEventListener("click", () => {

      const open = mainNav.classList.toggle("open");

      menuBtn.setAttribute(
        "aria-expanded",
        String(open)
      );

    });


    mainNav
      .querySelectorAll("a")
      .forEach(link => {

        link.addEventListener("click", () => {

          mainNav.classList.remove("open");

          menuBtn.setAttribute(
            "aria-expanded",
            "false"
          );

        });

      });

  }


  // ==============================
  // Canvas 自動調整大小
  // ==============================

  function fitCanvas(canvas) {

    const ratio =
      window.devicePixelRatio || 1;


    const cssWidth =
      canvas.clientWidth ||
      Number(
        canvas.getAttribute("width")
      ) ||
      600;


    let cssHeight;


    // AQI 趨勢圖

    if (
      canvas.id ===
      "aqiTrend"
    ) {

      cssHeight =
        Math.max(
          250,
          cssWidth * 0.34
        );

    }


    // 圓餅圖

    else {

      cssHeight =
        Math.min(
          260,
          cssWidth
        );

    }


    canvas.width =
      Math.round(
        cssWidth * ratio
      );


    canvas.height =
      Math.round(
        cssHeight * ratio
      );


    canvas.style.height =
      cssHeight + "px";


    const ctx =
      canvas.getContext("2d");


    ctx.setTransform(
      ratio,
      0,
      0,
      ratio,
      0,
      0
    );


    return {

      ctx,

      width:
        cssWidth,

      height:
        cssHeight

    };

  }


  // ==============================
  // AQI 近24小時趨勢圖
  // ==============================

  function drawTrend() {

    const canvas =
      document.getElementById(
        "aqiTrend"
      );


    if (!canvas) {
      return;
    }


    const {
      ctx,
      width,
      height
    } = fitCanvas(canvas);


    // ==============================
    // 示範 AQI 數據
    // 正式上線請改成 API 資料
    // ==============================

    const values = [

      44,
      42,
      41,
      39,
      38,
      40,

      45,
      52,
      58,
      61,
      65,
      67,

      63,
      60,
      59,
      57,
      55,
      56,

      60,
      64,
      68,
      66,
      64,
      62

    ];


    const labels = [

      "10",
      "11",
      "12",
      "13",
      "14",
      "15",

      "16",
      "17",
      "18",
      "19",
      "20",
      "21",

      "22",
      "23",
      "00",
      "01",
      "02",
      "03",

      "04",
      "05",
      "06",
      "07",
      "08",
      "09"

    ];


    const padding = {

      left:
        42,

      right:
        18,

      top:
        20,

      bottom:
        34

    };


    const max =
      100;


    const min =
      0;


    const plotWidth =

      width -

      padding.left -

      padding.right;


    const plotHeight =

      height -

      padding.top -

      padding.bottom;


    // 清除畫布

    ctx.clearRect(
      0,
      0,
      width,
      height
    );


    ctx.font =
      '12px "Microsoft JhengHei", sans-serif';


    // ==============================
    // Y 軸格線
    // ==============================

    [

      0,
      25,
      50,
      75,
      100

    ].forEach(value => {


      const y =

        padding.top +

        plotHeight -

        (
          (
            value -
            min
          )
          /
          (
            max -
            min
          )
        )
        *
        plotHeight;


      ctx.strokeStyle =
        "rgba(18,59,85,0.10)";


      ctx.lineWidth =
        1;


      ctx.beginPath();


      ctx.moveTo(
        padding.left,
        y
      );


      ctx.lineTo(
        width -
        padding.right,
        y
      );


      ctx.stroke();


      // Y軸數字

      ctx.fillStyle =
        "#71858d";


      ctx.textAlign =
        "left";


      ctx.fillText(
        String(value),
        7,
        y + 4
      );

    });


    // ==============================
    // X軸時間
    // ==============================

    labels.forEach(
      (label, index) => {


        // 每三小時顯示一次

        if (
          index % 3 !== 0 &&
          index !==
          labels.length - 1
        ) {

          return;

        }


        const x =

          padding.left +

          (
            index /
            (
              labels.length -
              1
            )
          )
          *
          plotWidth;


        ctx.fillStyle =
          "#71858d";


        ctx.textAlign =
          "center";


        ctx.fillText(

          label + "時",

          x,

          height - 10

        );

      }

    );


    // ==============================
    // 漸層填色
    // ==============================

    const gradient =
      ctx.createLinearGradient(

        0,
        padding.top,

        0,
        height -
        padding.bottom

      );


    gradient.addColorStop(

      0,

      "rgba(37,137,142,0.28)"

    );


    gradient.addColorStop(

      1,

      "rgba(37,137,142,0.02)"

    );


    // 建立區域

    ctx.beginPath();


    values.forEach(
      (value, index) => {


        const x =

          padding.left +

          (
            index /
            (
              values.length -
              1
            )
          )
          *
          plotWidth;


        const y =

          padding.top +

          plotHeight -

          (
            (
              value -
              min
            )
            /
            (
              max -
              min
            )
          )
          *
          plotHeight;


        if (
          index ===
          0
        ) {

          ctx.moveTo(
            x,
            y
          );

        }

        else {

          ctx.lineTo(
            x,
            y
          );

        }

      }

    );


    // 封閉區域

    ctx.lineTo(

      width -
      padding.right,

      height -
      padding.bottom

    );


    ctx.lineTo(

      padding.left,

      height -
      padding.bottom

    );


    ctx.closePath();


    ctx.fillStyle =
      gradient;


    ctx.fill();


    // ==============================
    // AQI 折線
    // ==============================

    ctx.beginPath();


    values.forEach(
      (value, index) => {


        const x =

          padding.left +

          (
            index /
            (
              values.length -
              1
            )
          )
          *
          plotWidth;


        const y =

          padding.top +

          plotHeight -

          (
            (
              value -
              min
            )
            /
            (
              max -
              min
            )
          )
          *
          plotHeight;


        if (
          index ===
          0
        ) {

          ctx.moveTo(
            x,
            y
          );

        }

        else {

          ctx.lineTo(
            x,
            y
          );

        }

      }

    );


    ctx.strokeStyle =
      "#25898e";


    ctx.lineWidth =
      3;


    ctx.lineJoin =
      "round";


    ctx.lineCap =
      "round";


    ctx.stroke();


    // ==============================
    // 最後一筆數值圓點
    // ==============================

    const lastValue =
      values[
        values.length -
        1
      ];


    const lastX =

      width -
      padding.right;


    const lastY =

      padding.top +

      plotHeight -

      (
        lastValue /
        max
      )
      *
      plotHeight;


    ctx.beginPath();


    ctx.arc(

      lastX,

      lastY,

      5,

      0,

      Math.PI * 2

    );


    ctx.fillStyle =
      "#ffffff";


    ctx.fill();


    ctx.strokeStyle =
      "#25898e";


    ctx.lineWidth =
      3;


    ctx.stroke();


  }


  // ==============================
  // 空氣品質圓餅圖
  // ==============================

  function drawPie() {

    const canvas =
      document.getElementById(
        "airPie"
      );


    if (!canvas) {
      return;
    }


    const {
      ctx,
      width,
      height
    } = fitCanvas(canvas);


    const centerX =
      width / 2;


    const centerY =
      height / 2;


    const radius =
      Math.min(
        width,
        height
      )
      *
      0.36;


    const innerRadius =
      radius *
      0.60;


    // ==============================
    // 示範資料
    //
    // 良好：8小時
    // 普通：14小時
    // 敏感族群：2小時
    // ==============================

    const data = [

      {

        value:
          8,

        color:
          "#45a56f"

      },

      {

        value:
          14,

        color:
          "#f3c54c"

      },

      {

        value:
          2,

        color:
          "#ee8e3d"

      }

    ];


    const total =

      data.reduce(

        (
          sum,
          item
        ) =>

          sum +
          item.value,

        0

      );


    let startAngle =
      -Math.PI / 2;


    ctx.clearRect(
      0,
      0,
      width,
      height
    );


    // ==============================
    // 畫圓餅圖
    // ==============================

    data.forEach(
      item => {


        const angle =

          (
            item.value /
            total
          )
          *
          Math.PI
          *
          2;


        ctx.beginPath();


        ctx.arc(

          centerX,

          centerY,

          radius,

          startAngle,

          startAngle +
          angle

        );


        ctx.arc(

          centerX,

          centerY,

          innerRadius,

          startAngle +
          angle,

          startAngle,

          true

        );


        ctx.closePath();


        ctx.fillStyle =
          item.color;


        ctx.fill();


        startAngle +=
          angle;

      }

    );


    // ==============================
    // 圓餅圖中央文字
    // ==============================

    ctx.textAlign =
      "center";


    ctx.fillStyle =
      "#123b55";


    ctx.font =
      '700 30px "Microsoft JhengHei", sans-serif';


    ctx.fillText(

      "24",

      centerX,

      centerY - 2

    );


    ctx.font =
      '13px "Microsoft JhengHei", sans-serif';


    ctx.fillStyle =
      "#6b8088";


    ctx.fillText(

      "小時",

      centerX,

      centerY + 20

    );

  }


  // ==============================
  // 執行全部圖表
  // ==============================

  function drawAllCharts() {

    drawTrend();

    drawPie();

  }


  drawAllCharts();


  // ==============================
  // 視窗大小變化時
  // 重新畫圖
  // ==============================

  let resizeTimer;


  window.addEventListener(
    "resize",
    () => {


      clearTimeout(
        resizeTimer
      );


      resizeTimer =
        setTimeout(
          () => {

            drawAllCharts();

          },
          150
        );

    }

  );


  // ==============================
  // 圖片載入失敗備援
  // ==============================

  document
    .querySelectorAll("img")
    .forEach(img => {


      img.addEventListener(
        "error",
        () => {


          // 隱藏原圖片

          img.style.display =
            "none";


          const parent =
            img.parentElement;


          if (!parent) {
            return;
          }


          // 防止重複建立

          if (
            parent.querySelector(
              ".image-fallback"
            )
          ) {

            return;

          }


          const fallback =
            document.createElement(
              "div"
            );


          fallback.className =
            "image-fallback";


          fallback.style.cssText = `

            min-height:300px;

            display:grid;

            place-items:center;

            text-align:center;

            padding:30px;

            background:
            linear-gradient(
              135deg,
              #e7f7f6,
              #eaf4f8
            );

            color:#123b55;

            font-weight:900;

            font-size:20px;

          `;


          fallback.innerHTML = `

            <div>

              <div
                style="
                  font-size:52px;
                  margin-bottom:8px;
                "
              >
                🌤️
              </div>

              PEAS 環境觀測站

            </div>

          `;


          parent.prepend(
            fallback
          );

        }

      );

    });


});
