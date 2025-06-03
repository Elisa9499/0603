let video;
let poseNet;
let poses = [];
let currentQuestion = 0;
let questions = [
  { text: "教育科技學系主要是訓練學生成為學校教師，因此課程以教學法與教育心理為主。", answer: false },
  { text: "教育科技學系的學生需要學習如何使用多媒體工具，例如影像剪輯、簡報設計與網頁製作。", answer: true },
  { text: "教育科技學系的學生畢業後大多進入學校當老師，極少進入企業或數位內容產業。", answer: false },
  { text: "虛擬實境（VR）與人工智慧（AI）是教育科技學系可能涉及的教學科技應用領域之一。", answer: true },
  { text: "教育科技學系的課程不需要任何技術操作能力，只要理解教育理論即可。", answer: false }
];

function setup() {
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO);
  video.size(windowWidth, windowHeight);
  video.hide();

  poseNet = ml5.poseNet(video, modelReady);
  poseNet.on('pose', function(results) {
    poses = results;
  });
}

function modelReady() {
  console.log("PoseNet model loaded");
}

function draw() {
  background('#bde0fe');
  image(video, 0, 0, width, height);

  drawKeypoints();
  displayQuestion();
}

function drawKeypoints() {
  if (poses.length > 0) {
    let pose = poses[0].pose;
    let rightWrist = pose.keypoints.find(k => k.part === "rightWrist");
    let leftWrist = pose.keypoints.find(k => k.part === "leftWrist");

    if (rightWrist && rightWrist.score > 0.5) {
      fill(255, 0, 0);
      ellipse(rightWrist.position.x, rightWrist.position.y, 20, 20);

      // Check for right movement
      if (rightWrist.position.x > width * 0.75) {
        checkAnswer(true);
      } else if (rightWrist.position.x < width * 0.25) {
        checkAnswer(false);
      }
    }
  }
}

function displayQuestion() {
  textSize(24);
  fill(0);
  textAlign(CENTER, CENTER);
  text(questions[currentQuestion].text, width / 2, height / 2);
}

function checkAnswer(isRight) {
  let correct = questions[currentQuestion].answer === isRight;
  if (correct) {
    alert("答對了！");
  } else {
    alert("答錯了！");
  }
  currentQuestion = (currentQuestion + 1) % questions.length;
}
