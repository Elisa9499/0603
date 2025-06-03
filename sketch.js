let video;
let poseNet;
let poses = [];
let questions;
let currentQuestion = 0;
let answerGiven = false;
let resultText = "";
let handX = 0;
let score = 0;
let totalQuestions;

function setup() {
  let canvas = createCanvas(640, 480);
  canvas.parent("game-container");

  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  poseNet = ml5.poseNet(video, modelReady);
  poseNet.on("pose", function (results) {
    poses = results;
  });

  questions = [
    { text: "1. 教育科技學系主要是訓練學生成為學校教師，因此課程以教學法與教育心理為主。", answer: false },
    { text: "2. 教育科技學系的學生需要學習如何使用多媒體工具，例如影像剪輯、簡報設計與網頁製作。", answer: true },
    { text: "3. 教育科技學系的學生畢業後大多進入學校當老師，極少進入企業或數位內容產業。", answer: false },
    { text: "4. 虛擬實境（VR）與人工智慧（AI）是教育科技學系可能涉及的教學科技應用領域之一。", answer: true },
    { text: "5. 教育科技學系的課程不需要任何技術操作能力，只要理解教育理論即可。", answer: false }
  ];
  totalQuestions = questions.length;
}

function modelReady() {
  console.log("PoseNet is ready!");
}

function draw() {
  image(video, 0, 0, width, height);
  drawKeypoints();

  if (currentQuestion < totalQuestions) {
    displayQuestion();

    if (poses.length > 0 && !answerGiven) {
      let pose = poses[0].pose;
      let wrist = pose.rightWrist;

      fill(255, 0, 0);
      noStroke();
      ellipse(wrist.x, wrist.y, 20, 20);
      handX = wrist.x;

      if (handX < width / 4) {
        checkAnswer(false); // 左邊 ❌
      } else if (handX > (3 * width) / 4) {
        checkAnswer(true); // 右邊 ✅
      }
    }

    // 顯示回饋文字
    fill(resultText === "✅ 正確！" ? "green" : "red");
    textSize(32);
    textAlign(CENTER);
    text(resultText, width / 2, height - 40);
  } else {
    // 遊戲結束畫面
    background(240);
    fill(0);
    textSize(32);
    text("遊戲結束！", width / 2, height / 2 - 20);
    text("你的分數：" + score + " / " + totalQuestions, width / 2, height / 2 + 20);
  }
}

function displayQuestion() {
  fill(255);
  stroke(0);
  strokeWeight(2);
  rect(20, 20, width - 40, 100, 12);

  fill(0);
  noStroke();
  textSize(18);
  textAlign(LEFT, TOP);
  textWrap(WORD);
  text(questions[currentQuestion].text, 30, 30, width - 60);
}

function checkAnswer(userAnswer) {
  answerGiven = true;
  let correct = questions[currentQuestion].answer === userAnswer;

  if (correct) {
    resultText = "✅ 正確！";
    score++;
  } else {
    resultText = "❌ 錯誤！";
  }

  setTimeout(() => {
    answerGiven = false;
    resultText = "";
    currentQuestion++;
  }, 2000);
}

function drawKeypoints() {
  if (poses.length > 0) {
    let pose = poses[0].pose;
    let wrist = pose.rightWrist;

    fill(0, 255, 0);
    noStroke();
    ellipse(wrist.x, wrist.y, 20, 20);
  }
}
