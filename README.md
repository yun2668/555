# PEAS 環境觀測站｜Q版圖片不跑版修正版

這一版專門修正 Q 版圖片被裁切、變形、超出卡片或手機版跑位的問題。

## 原因
原本 style.css 對圖片有：
- `object-fit: cover`
- 固定 / 最低高度

這些設定適合寫實照片，但會裁掉 Q 版插畫。

## 這一版修正
- 首頁 Q 版圖改為 `object-fit: contain`
- 測站介紹圖取消固定高度裁切
- 手機版圖片自動等比例縮放
- Grid / Flex 子元素加入 `min-width: 0`，避免圖片把版面撐寬
- 修正 CSS 已直接寫進 index.html

## GitHub 使用
只要把 Repository `555` 裡的 `index.html` 完整換成這一份即可。
原本的 style.css 與 Script.js 不需要修改。

更新後建議按 Ctrl + F5 強制重新整理。
