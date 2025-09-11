/**
 * 2048 Game - Modern Implementation
 * Inspired by RZI Chennai 2026 Design System
 */

class Game2048 {
  constructor() {
    this.board = [];
    this.score = 0;
    this.bestScore = this.getBestScore();
    this.moveCount = 0;
    this.gameWon = false;
    this.gameOver = false;
    this.history = [];
    this.hintMode = false;
    
    this.initializeElements();
    this.initializeBoard();
    this.bindEvents();
    this.updateDisplay();
    this.addRandomTile();
    this.addRandomTile();
    this.render();
  }

  initializeElements() {
    this.gameBoard = document.getElementById('gameBoard');
    this.currentScoreEl = document.getElementById('currentScore');
    this.bestScoreEl = document.getElementById('bestScore');
    this.moveCountEl = document.getElementById('moveCount');
    this.newGameBtn = document.getElementById('newGameBtn');
    this.undoBtn = document.getElementById('undoBtn');
    this.hintBtn = document.getElementById('hintBtn');
    this.gameOverlay = document.getElementById('gameOverlay');
    this.overlayTitle = document.getElementById('overlayTitle');
    this.overlayMessage = document.getElementById('overlayMessage');
    this.restartBtn = document.getElementById('restartBtn');
    this.continueBtn = document.getElementById('continueBtn');
    this.toastContainer = document.getElementById('toastContainer');
  }

  initializeBoard() {
    this.board = Array(4).fill().map(() => Array(4).fill(0));
  }

  bindEvents() {
    // Button events
    this.newGameBtn.addEventListener('click', () => this.newGame());
    this.undoBtn.addEventListener('click', () => this.undo());
    this.hintBtn.addEventListener('click', () => this.toggleHint());
    this.restartBtn.addEventListener('click', () => this.newGame());
    this.continueBtn.addEventListener('click', () => this.continueGame());

    // Keyboard events
    document.addEventListener('keydown', (e) => this.handleKeyPress(e));

    // Touch events for mobile
    this.bindTouchEvents();

    // Prevent context menu on long press
    this.gameBoard.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  bindTouchEvents() {
    let startX, startY, endX, endY;
    const minSwipeDistance = 50;

    this.gameBoard.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
    }, { passive: true });

    this.gameBoard.addEventListener('touchend', (e) => {
      if (!startX || !startY) return;
      
      const touch = e.changedTouches[0];
      endX = touch.clientX;
      endY = touch.clientY;

      const deltaX = endX - startX;
      const deltaY = endY - startY;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (Math.abs(deltaX) > minSwipeDistance) {
          if (deltaX > 0) {
            this.move('right');
          } else {
            this.move('left');
          }
        }
      } else {
        // Vertical swipe
        if (Math.abs(deltaY) > minSwipeDistance) {
          if (deltaY > 0) {
            this.move('down');
          } else {
            this.move('up');
          }
        }
      }

      startX = startY = endX = endY = null;
    }, { passive: true });
  }

  handleKeyPress(e) {
    if (this.gameOver && !this.gameWon) return;

    const keyMap = {
      'ArrowUp': 'up',
      'ArrowDown': 'down',
      'ArrowLeft': 'left',
      'ArrowRight': 'right',
      'KeyW': 'up',
      'KeyS': 'down',
      'KeyA': 'left',
      'KeyD': 'right'
    };

    const direction = keyMap[e.code];
    if (direction) {
      e.preventDefault();
      this.move(direction);
    }
  }

  move(direction) {
    if (this.gameOver && !this.gameWon) return;

    const previousBoard = this.board.map(row => [...row]);
    const previousScore = this.score;
    const previousMoveCount = this.moveCount;

    let moved = false;

    switch (direction) {
      case 'up':
        moved = this.moveUp();
        break;
      case 'down':
        moved = this.moveDown();
        break;
      case 'left':
        moved = this.moveLeft();
        break;
      case 'right':
        moved = this.moveRight();
        break;
    }

    if (moved) {
      this.saveState(previousBoard, previousScore, previousMoveCount);
      this.moveCount++;
      this.addRandomTile();
      this.updateDisplay();
      this.render();
      this.checkGameState();
    }
  }

  moveUp() {
    let moved = false;
    for (let col = 0; col < 4; col++) {
      const column = [this.board[0][col], this.board[1][col], this.board[2][col], this.board[3][col]];
      const result = this.slideAndMerge(column);
      if (result.moved) {
        moved = true;
        for (let row = 0; row < 4; row++) {
          this.board[row][col] = result.array[row];
        }
        this.score += result.score;
      }
    }
    return moved;
  }

  moveDown() {
    let moved = false;
    for (let col = 0; col < 4; col++) {
      const column = [this.board[3][col], this.board[2][col], this.board[1][col], this.board[0][col]];
      const result = this.slideAndMerge(column);
      if (result.moved) {
        moved = true;
        for (let row = 0; row < 4; row++) {
          this.board[3 - row][col] = result.array[row];
        }
        this.score += result.score;
      }
    }
    return moved;
  }

  moveLeft() {
    let moved = false;
    for (let row = 0; row < 4; row++) {
      const result = this.slideAndMerge([...this.board[row]]);
      if (result.moved) {
        moved = true;
        this.board[row] = result.array;
        this.score += result.score;
      }
    }
    return moved;
  }

  moveRight() {
    let moved = false;
    for (let row = 0; row < 4; row++) {
      const result = this.slideAndMerge([...this.board[row]].reverse());
      if (result.moved) {
        moved = true;
        this.board[row] = result.array.reverse();
        this.score += result.score;
      }
    }
    return moved;
  }

  slideAndMerge(array) {
    const original = [...array];
    let score = 0;
    let moved = false;

    // Remove zeros
    const filtered = array.filter(val => val !== 0);
    
    // Merge adjacent equal numbers
    for (let i = 0; i < filtered.length - 1; i++) {
      if (filtered[i] === filtered[i + 1]) {
        filtered[i] *= 2;
        score += filtered[i];
        filtered.splice(i + 1, 1);
      }
    }

    // Pad with zeros
    while (filtered.length < 4) {
      filtered.push(0);
    }

    // Check if anything moved
    for (let i = 0; i < 4; i++) {
      if (original[i] !== filtered[i]) {
        moved = true;
        break;
      }
    }

    return { array: filtered, moved, score };
  }

  addRandomTile() {
    const emptyCells = [];
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length > 0) {
      const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      this.board[randomCell.row][randomCell.col] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  checkGameState() {
    // Check for win condition (2048 tile)
    if (!this.gameWon) {
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
          if (this.board[row][col] === 2048) {
            this.gameWon = true;
            this.showGameOverlay('You Win!', 'Congratulations! You reached 2048!', true);
            this.showToast('success', 'Victory!', 'You reached 2048!');
            return;
          }
        }
      }
    }

    // Check for game over
    if (this.isGameOver()) {
      this.gameOver = true;
      this.showGameOverlay('Game Over!', 'No more moves available. Try again!', false);
      this.showToast('error', 'Game Over', 'No more moves available!');
    }
  }

  isGameOver() {
    // Check for empty cells
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          return false;
        }
      }
    }

    // Check for possible merges
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const current = this.board[row][col];
        if (
          (row < 3 && this.board[row + 1][col] === current) ||
          (col < 3 && this.board[row][col + 1] === current)
        ) {
          return false;
        }
      }
    }

    return true;
  }

  render() {
    this.gameBoard.innerHTML = '';
    
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const tile = document.createElement('div');
        tile.className = 'game-tile';
        
        const value = this.board[row][col];
        if (value !== 0) {
          tile.textContent = value;
          tile.classList.add(`game-tile--${value}`);
          
          // Add animation classes for new tiles
          if (this.isNewTile(row, col)) {
            tile.classList.add('game-tile--new');
          }
        }
        
        this.gameBoard.appendChild(tile);
      }
    }
  }

  isNewTile(row, col) {
    // This is a simplified check - in a real implementation,
    // you'd track which tiles are new in the current move
    return false;
  }

  updateDisplay() {
    this.currentScoreEl.textContent = this.score.toLocaleString();
    this.bestScoreEl.textContent = this.bestScore.toLocaleString();
    this.moveCountEl.textContent = this.moveCount;
    
    // Update best score if current score is higher
    if (this.score > this.bestScore) {
      this.bestScore = this.score;
      this.saveBestScore(this.bestScore);
    }
    
    // Enable/disable undo button
    this.undoBtn.disabled = this.history.length === 0;
  }

  newGame() {
    this.board = Array(4).fill().map(() => Array(4).fill(0));
    this.score = 0;
    this.moveCount = 0;
    this.gameWon = false;
    this.gameOver = false;
    this.history = [];
    this.hintMode = false;
    
    this.hideGameOverlay();
    this.addRandomTile();
    this.addRandomTile();
    this.updateDisplay();
    this.render();
    this.showToast('info', 'New Game', 'Good luck!');
  }

  undo() {
    if (this.history.length === 0) return;
    
    const lastState = this.history.pop();
    this.board = lastState.board;
    this.score = lastState.score;
    this.moveCount = lastState.moveCount;
    
    this.updateDisplay();
    this.render();
    this.showToast('info', 'Undo', 'Move undone!');
  }

  toggleHint() {
    this.hintMode = !this.hintMode;
    this.hintBtn.classList.toggle('active', this.hintMode);
    
    if (this.hintMode) {
      this.showHint();
      this.showToast('info', 'Hint Mode', 'Best moves highlighted!');
    } else {
      this.hideHint();
    }
  }

  showHint() {
    // Simple hint system - highlight tiles that can be merged
    const tiles = this.gameBoard.querySelectorAll('.game-tile');
    tiles.forEach((tile, index) => {
      const row = Math.floor(index / 4);
      const col = index % 4;
      const value = this.board[row][col];
      
      if (value !== 0) {
        // Check if this tile can merge with adjacent tiles
        const canMerge = this.canTileMerge(row, col);
        if (canMerge) {
          tile.style.boxShadow = '0 0 20px rgba(249, 115, 22, 0.6)';
          tile.style.border = '2px solid var(--color-accent-orange)';
        }
      }
    });
  }

  hideHint() {
    const tiles = this.gameBoard.querySelectorAll('.game-tile');
    tiles.forEach(tile => {
      tile.style.boxShadow = '';
      tile.style.border = '';
    });
  }

  canTileMerge(row, col) {
    const value = this.board[row][col];
    if (value === 0) return false;
    
    return (
      (row > 0 && this.board[row - 1][col] === value) ||
      (row < 3 && this.board[row + 1][col] === value) ||
      (col > 0 && this.board[row][col - 1] === value) ||
      (col < 3 && this.board[row][col + 1] === value)
    );
  }

  continueGame() {
    this.hideGameOverlay();
    this.showToast('info', 'Continue', 'Keep playing to reach higher numbers!');
  }

  showGameOverlay(title, message, showContinue = false) {
    this.overlayTitle.textContent = title;
    this.overlayMessage.textContent = message;
    this.continueBtn.style.display = showContinue ? 'inline-flex' : 'none';
    this.gameOverlay.classList.remove('hidden');
  }

  hideGameOverlay() {
    this.gameOverlay.classList.add('hidden');
  }

  saveState(previousBoard, previousScore, previousMoveCount) {
    this.history.push({
      board: previousBoard.map(row => [...row]),
      score: previousScore,
      moveCount: previousMoveCount
    });
    
    // Limit history to prevent memory issues
    if (this.history.length > 10) {
      this.history.shift();
    }
  }

  getBestScore() {
    return parseInt(localStorage.getItem('game2048_bestScore') || '0');
  }

  saveBestScore(score) {
    localStorage.setItem('game2048_bestScore', score.toString());
  }

  showToast(type, title, message) {
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    
    const iconMap = {
      success: '<path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>',
      error: '<path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>',
      info: '<path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>'
    };
    
    toast.innerHTML = `
      <svg class="toast__icon toast__icon--${type}" viewBox="0 0 24 24" aria-hidden="true">
        ${iconMap[type]}
      </svg>
      <div class="toast__content">
        <div class="toast__title">${title}</div>
        <div class="toast__message">${message}</div>
      </div>
      <button class="toast__close" aria-label="Close notification">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>
      </button>
    `;
    
    // Add close functionality
    const closeBtn = toast.querySelector('.toast__close');
    closeBtn.addEventListener('click', () => {
      this.hideToast(toast);
    });
    
    this.toastContainer.appendChild(toast);
    
    // Show toast
    setTimeout(() => {
      toast.classList.add('toast--show');
    }, 100);
    
    // Auto-hide after 4 seconds
    setTimeout(() => {
      this.hideToast(toast);
    }, 4000);
  }

  hideToast(toast) {
    toast.classList.remove('toast--show');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new Game2048();
});

// Add some additional utility functions
window.Game2048 = Game2048;
