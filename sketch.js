let video;
let overlayGraphics;

function setup() {
  createCanvas(windowWidth, windowHeight); // 全螢幕畫布
  background('#bde0fe'); // 設定背景顏色

  video = createCapture(VIDEO); // 解取攝影機影像
  video.size(windowWidth * 0.8, windowHeight * 0.8); // 設定影像寬高為視窗大小的 80%
  video.hide(); // 隱藏原始影像元素

  // 建立與 video 尺寸相同的 overlayGraphics
  overlayGraphics = createGraphics(video.width, video.height);
  overlayGraphics.fill(255, 0, 0, 150); // 半透明紅色
  overlayGraphics.noStroke();
  overlayGraphics.ellipse(overlayGraphics.width / 2, overlayGraphics.height / 2, 100, 100); // 在中心繪製圓形
}

function draw() {
  background('#bde0fe'); // 確保背景顏色一致

  // 翻轉影像左右顯示
  push();
  translate(width / 2, height / 2); // 移動到畫布中心
  scale(-1, 1); // 左右翻轉
  image(video, -video.width / 2, -video.height / 2); // 顯示翻轉後的影像
  image(overlayGraphics, -video.width / 2, -video.height / 2); // 顯示 overlayGraphics 在視訊畫面上方
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight); // 當視窗大小改變時，調整畫布大小
  video.size(windowWidth * 0.8, windowHeight * 0.8); // 調整影像大小
  overlayGraphics.resizeCanvas(video.width, video.height); // 調整 overlayGraphics 大小
}
