# PEAS 環境觀測站｜Q版圖片＋圖表皆正常版

## 找到的真正原因
GitHub Repository `555` 裡的 JavaScript 檔名是：

`Script.js`

但是原本 `index.html` 寫的是：

`script.js`

GitHub Pages 會區分英文大小寫，因此整支 JavaScript 沒載入，造成：
- AQI 趨勢圖空白
- 空品等級分布圓環圖空白
- 手機選單等 JavaScript 功能也可能失效

## 這份修正版
已將 index.html 改為：

`<script src="Script.js"></script>`

另外附上一份重新整理過的 `Script.js`，
可直接畫出：
- AQI 近24小時趨勢圖
- 今日空品等級分布圓環圖
- 手機版選單
- 響應式自動調整

## 建議 GitHub 上傳
這次請同時覆蓋：
1. `index.html`
2. `Script.js`

原本 `style.css` 保留即可。

請特別注意：檔名一定要是大寫 S 的 `Script.js`。

上傳後等 GitHub Pages 部署完成，再按 Ctrl + F5。
