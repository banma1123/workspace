// 常量定义
const boardWidth = 10; // 游戏板宽度
const boardHeight = 20; // 游戏板高度
const blockWidth = 20; // 方块宽度
const blockHeight = 20; // 方块高度
const shapes = [ // 方块形状
  [[1, 1, 1], [0, 1, 0]], // T型
  [[0, 2, 2], [2, 2, 0]], // 7型
  [[3, 3, 0], [0, 3, 3]], // 反7型
  [[4, 0, 0], [4, 4, 4]], // 条型
  [[0, 0, 5], [5, 5, 5]], // L型
  [[6, 6], [6, 6]] // 方块型
];
const colors = [ // 方块颜色
  '#f44336',
  '#e91e63',
  '#9c27b0',
  '#673ab7',
  '#3f51b5',
  '#2196f3',
  '#00bcd4'
];

// 变量定义
let board = []; // 游戏板
let currentShape = null; // 当前方块
let nextShape = null; // 下一个方块
let currentPosition = {x: 0, y: 0}; // 当前方块位置
let score = 0; // 分数
let isGameOver = false; // 游戏是否结束
let gameInterval = null; // 游戏间隔

// 初始化游戏板
function initBoard() {
  for (let i = 0; i < boardHeight; i++) {
    board[i] = [];
    for (let j = 0; j < boardWidth; j++) {
      board[i][j] = 0;
    }
  }
}

// 在游戏板上绘制方块
function drawBlock(shape, position) {
  const startX = position.x;
  const startY = position.y;
  for (let i = 0; i < shape.length; i++) {
    for (let j = 0; j < shape[i].length; j++) {
      if (shape[i][j]) {
        const x = startX + j;
        const y = startY + i;
        if (x < 0 || x >= boardWidth || y >= boardHeight) {
          // 方块超出游戏板范围，游戏结束
          isGameOver = true;
          return;
        }
        board[y][x] = shape[i][j];
      }
    }
  }
}

// 在游戏板上清除方块 
function clearBlock(shape, position) { 
	const startX = position.x; 
	const startY = position.y; 
	for (let i = 0; i < shape.length; i++) { 
		for (let j = 0; j < shape[i].length; j++) { 
			if (shape[i][j]) { 
				const x = startX + j; const y = startY + i; if (x >= 0 && x < boardWidth && y >= 0 && y < boardHeight) { board[y][x] = 0; } } } } }

// 检查方块是否可以移动 
function canMove(shape, position, direction) { 
	const newX = position.x + direction; 
	const newY = position.y; 
	for (let i = 0; i < shape.length; i++) { 
		for (let j = 0; j < shape[i].length; j++) { 
			if (shape[i][j]) { 
				const x = newX + j; const y = newY + i; if (x < 0 || x >= boardWidth || y >= boardHeight) { 
					// 方块超出游戏板范围，无法移动 
					return false; 
					} if (y >= 0 && board[y][x]) {
						// 方块与已有的方块重叠，无法移动 
						return false; } } } } return true; }

// 移动方块 
function moveBlock(direction) { 
	if (!isGameOver && canMove(currentShape, currentPosition, direction)) { 
		clearBlock(currentShape, currentPosition); currentPosition.x += direction; 
		drawBlock(currentShape, currentPosition); } }

// 旋转方块 
function rotateBlock() { 
	if (!isGameOver) { const rotatedShape = []; 
	for (let i = 0; i < currentShape[0].length; i++) { 
		rotatedShape[i] = []; for (let j = currentShape.length - 1; j >= 0; j--) { 
			rotatedShape[i][currentShape.length - 1 - j] = currentShape[j][i]; } } if (
			canMove(rotatedShape, currentPosition, 0)) { 
				clearBlock(currentShape, currentPosition); 
				currentShape = rotatedShape; drawBlock(currentShape, currentPosition); } } }

// 下落方块 
function dropBlock() { 
	if (!isGameOver) { 
		if (canMove(currentShape, currentPosition, 0)) { 
			clearBlock(currentShape, currentPosition); 
			currentPosition.y++; drawBlock(currentShape, currentPosition); 
			} else { 
				// 方块无法下落，固定在游戏板上 
				for (let i = 0; i < currentShape.length; i++) { 
					for (let j = 0; j < currentShape[i].length; j++) {
						if (currentShape[i][j]) { 
							const x = currentPosition.x + j; 
							const y = currentPosition.y + i; 
							board[y][x] = currentShape[i][j];
							 } 
							 } 
							 }

  // 消除已满行
  let rowsCleared = 0;
  for (let i = boardHeight - 1; i >= 0; i--) {
    if (board[i].every(block => block)) {
      board.splice(i, 1);
      board.unshift(Array(boardWidth).fill(0));
      rowsCleared++;
      i++; // 必须重新检查当前行，因为它已经被替换成了新的空行
    }
  }
  // 计算得分
  if (rowsCleared > 0) {
    score += Math.pow(2, rowsCleared - 1) * 100;
    updateScore();
  }
  // 生成新的方块
  currentShape = nextShape || shapes[Math.floor(Math.random() * shapes.length)];
  nextShape = shapes[Math.floor(Math.random() * shapes.length)];
  currentPosition = {x: Math.floor((boardWidth - currentShape[0].length) / 2), y: 0};

  // 检查游戏是否结束
    // 检查游戏是否结束
        if (!canMove(currentShape, currentPosition, 0)) {
          isGameOver = true;
          clearInterval(gameInterval);
          const context = canvas.getContext('2d');
          context.fillStyle = 'rgba(0, 0, 0, 0.5)';
          context.fillRect(0, 0, canvas.width, canvas.height);
          context.fillStyle = '#fff';
          context.font = '36px Arial';
          context.textAlign = 'center';
          context.fillText('Game Over', canvas.width / 2, canvas.height / 2);
        }
      }
    }
  }
  
  // 更新分数
  function updateScore() {
    document.querySelector('.score').textContent = score;
  }
  
  // 在 HTML 页面中绘制下一个方块
  function drawNextShape() {
    const canvas = document.createElement('canvas');
    canvas.width = 6 * blockWidth;
    canvas.height = 6 * blockHeight;
    const context = canvas.getContext('2d');
    context.fillStyle = '#fff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    const nextShapeWidth = nextShape[0].length * blockWidth;
    const nextShapeHeight = nextShape.length * blockHeight;
    const startX = (canvas.width - nextShapeWidth) / 2;
    const startY = (canvas.height - nextShapeHeight) / 2;
    drawBlock(nextShape, {x: startX, y: startY}, blockWidth, blockHeight, context);
    document.querySelector('.next-shape').appendChild(canvas);
  }
  
  // 在 HTML 页面中绘制游戏板
  function drawBoard() {
    const canvas = document.createElement('canvas');
    canvas.width = boardWidth * blockWidth;
    canvas.height = boardHeight * blockHeight;
    const context = canvas.getContext('2d');
    context.fillStyle = '#fff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < boardHeight; i++) {
      for (let j = 0; j < boardWidth; j++) {
        if (board[i][j]) {
          context.fillStyle = colors[board[i][j] - 1];
          context.fillRect(j * blockWidth, i * blockHeight, blockWidth, blockHeight);
        }
      }
    }
    document.querySelector('.game-board').appendChild(canvas);
  }
  
  // 初始化游戏
  function initGame() {
    drawBoard();
  }
  
  // 等待 HTML 页面加载完成后初始化游戏
  window.addEventListener('load', initGame);