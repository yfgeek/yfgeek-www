class FarmGame {
    constructor() {
        this.grid = document.querySelector('.game-grid');
        this.hintBtn = document.querySelector('.hint-btn');
        this.shuffleBtn = document.querySelector('.shuffle-btn');
        this.selectedItems = [];
        
        // 使用确定存在的图标，并为每个图标指定颜色
        this.icons = [
            { icon: '<i class="fas fa-heart"></i>', color: '#F44336' },         // 红心
            { icon: '<i class="fas fa-star"></i>', color: '#E91E63' },          // 星星-粉色
            { icon: '<i class="fas fa-moon"></i>', color: '#5C6BC0' },          // 月亮-靛蓝
            { icon: '<i class="fas fa-cloud"></i>', color: '#90A4AE' },         // 云朵-灰蓝
            { icon: '<i class="fas fa-sun"></i>', color: '#FF9800' },           // 太阳-橙色
            { icon: '<i class="fas fa-tree"></i>', color: '#2E7D32' },          // 树-深绿
            { icon: '<i class="fas fa-gift"></i>', color: '#9C27B0' },          // 礼物-紫色
            { icon: '<i class="fas fa-bell"></i>', color: '#7E57C2' },          // 铃铛-紫色
            { icon: '<i class="fas fa-snowflake"></i>', color: '#03A9F4' },     // 雪花-蓝色
            { icon: '<i class="fas fa-crown"></i>', color: '#FF5722' },         // 皇冠-橙红
            { icon: '<i class="fas fa-gem"></i>', color: '#E91E63' },           // 宝石-粉色
            { icon: '<i class="fas fa-music"></i>', color: '#4CAF50' },         // 音符-绿色
            { icon: '<i class="fas fa-fire"></i>', color: '#FF5722' },          // 火焰-橙色
            { icon: '<i class="fas fa-bolt"></i>', color: '#7B1FA2' },          // 闪电-紫色
            { icon: '<i class="fas fa-bomb"></i>', color: '#455A64' },          // 炸弹-深灰
            { icon: '<i class="fas fa-ghost"></i>', color: '#5E35B1' },         // 幽灵-紫色
            { icon: '<i class="fas fa-rocket"></i>', color: '#D32F2F' },        // 火箭-红色
            { icon: '<i class="fas fa-dice"></i>', color: '#00897B' },          // 骰子-青色
            { icon: '<i class="fas fa-puzzle-piece"></i>', color: '#3949AB' },  // 拼图-蓝色
            { icon: '<i class="fas fa-compass"></i>', color: '#00ACC1' },       // 指南针-青色
            { icon: '<i class="fas fa-palette"></i>', color: '#8E24AA' },       // 调色板-紫色
            { icon: '<i class="fas fa-magic"></i>', color: '#6D4C41' },         // 魔杖-棕色
            { icon: '<i class="fas fa-key"></i>', color: '#F4511E' },           // 钥匙-橙色
            { icon: '<i class="fas fa-shield-alt"></i>', color: '#0288D1' }     // 盾牌-蓝色
        ];
        
        this.gameIcons = this.generatePairs();
        
        // 添加音乐控制
        this.bgMusic = document.getElementById('bgMusic');
        this.musicBtn = document.querySelector('.music-btn');
        this.isMuted = false;
        
        // 初始化音乐
        this.initMusic();
        
        // 添加按钮使用次数计数器
        this.hintCount = 3;
        this.shuffleCount = 3;
        
        // 添加按钮次数显示
        this.updateButtonCounts();
        
        // 添加提示状态标记
        this.isHinting = false;
        
        this.init();
    }

    generatePairs() {
        // 创建配对数组（每个图标出现4次，总共66个格子）
        let pairs = [];
        this.icons.forEach(icon => {
            for (let i = 0; i < 4; i++) {  // 每个图标出现4次，确保能填满6x11的网格
                pairs.push(icon);
            }
        });
        // 随机打乱数组
        return this.shuffleArray(pairs);
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    init() {
        this.createGrid();
        this.bindEvents();
    }

    createGrid() {
        this.grid.innerHTML = '';
        
        for (let i = 0; i < 66; i++) {  // 6x11=66个格子
            const item = document.createElement('div');
            item.className = 'grid-item';
            const iconObj = this.gameIcons[i];
            item.innerHTML = iconObj.icon;
            item.querySelector('i').style.color = iconObj.color;
            // 存储图标数据到元素上，用于后续匹配判断
            item.dataset.iconIndex = i;
            this.grid.appendChild(item);
        }
    }

    bindEvents() {
        this.grid.addEventListener('click', (e) => {
            const item = e.target.closest('.grid-item');
            if (!item || item.classList.contains('matched')) return;
            
            this.handleItemClick(item);
        });

        this.hintBtn.addEventListener('click', () => {
            this.showHint();
        });

        this.shuffleBtn.addEventListener('click', () => {
            this.shuffleGrid();
        });
    }

    handleItemClick(item) {
        if (this.selectedItems.includes(item)) return;
        
        item.classList.add('selected');
        this.selectedItems.push(item);

        if (this.selectedItems.length === 2) {
            if (this.checkMatch()) {
                this.removeItems();
            } else {
                this.resetSelection();
            }
        }
    }

    checkMatch() {
        const [item1, item2] = this.selectedItems;
        
        // 获取图标索引
        const index1 = parseInt(item1.dataset.iconIndex);
        const index2 = parseInt(item2.dataset.iconIndex);
        
        // 检查是否是相同的图标（包括颜色）
        if (!this.isSameIcon(this.gameIcons[index1], this.gameIcons[index2])) {
            return false;
        }

        // 获取两个元素的位置信息
        const pos1 = this.getItemPosition(item1);
        const pos2 = this.getItemPosition(item2);

        // 检查是否可以连接
        return this.canConnect(pos1, pos2);
    }

    // 添加新方法：检查两个图标是否完全相同
    isSameIcon(icon1, icon2) {
        return icon1.icon === icon2.icon && icon1.color === icon2.color;
    }

    // 获取元素在网格中的位置
    getItemPosition(item) {
        const items = Array.from(this.grid.children);
        const index = items.indexOf(item);
        return {
            row: Math.floor(index / 6),  // 6列
            col: index % 6,
            index: index
        };
    }

    // 检查两点是否可以连接
    canConnect(pos1, pos2) {
        // 检查直线连接
        if (this.checkStraightLine(pos1, pos2)) {
            return true;
        }

        // 检查一个拐角连接
        if (this.checkOneCorner(pos1, pos2)) {
            return true;
        }

        // 检查两个拐角的连接
        return this.checkTwoCorners(pos1, pos2);
    }

    // 检查直线连接
    checkStraightLine(pos1, pos2) {
        // 水平直线
        if (pos1.row === pos2.row) {
            const minCol = Math.min(pos1.col, pos2.col);
            const maxCol = Math.max(pos1.col, pos2.col);
            
            // 检查中间是否有其他方块
            for (let col = minCol + 1; col < maxCol; col++) {
                if (!this.isEmptyCell(pos1.row, col)) {
                    return false;
                }
            }
            return true;
        }

        // 垂直直线
        if (pos1.col === pos2.col) {
            const minRow = Math.min(pos1.row, pos2.row);
            const maxRow = Math.max(pos1.row, pos2.row);
            
            // 检查中间是否有其他方块
            for (let row = minRow + 1; row < maxRow; row++) {
                if (!this.isEmptyCell(row, pos1.col)) {
                    return false;
                }
            }
            return true;
        }

        return false;
    }

    // 检查一个拐角的连接
    checkOneCorner(pos1, pos2) {
        // 检查两个可能的拐角点
        const corner1 = { row: pos1.row, col: pos2.col };
        const corner2 = { row: pos2.row, col: pos1.col };

        if (this.isEmptyCell(corner1.row, corner1.col) &&
            this.checkStraightLine(pos1, corner1) &&
            this.checkStraightLine(corner1, pos2)) {
            return true;
        }

        if (this.isEmptyCell(corner2.row, corner2.col) &&
            this.checkStraightLine(pos1, corner2) &&
            this.checkStraightLine(corner2, pos2)) {
            return true;
        }

        return false;
    }

    // 检查两个拐角的连接
    checkTwoCorners(pos1, pos2) {
        // 只检查游戏区域内的点
        for (let row = 0; row < 12; row++) {
            for (let col = 0; col < 6; col++) {
                const corner = { row, col };
                if (this.isValidCorner(corner) &&
                    this.checkOneCorner(pos1, corner) &&
                    this.checkOneCorner(corner, pos2)) {
                    return true;
                }
            }
        }
        return false;
    }

    // 检查位置是否为空（���括超出边界的情况）
    isEmptyCell(row, col) {
        // 边界外的格子视为墙，不可通过
        if (row < 0 || row >= 12 || col < 0 || col >= 6) {
            return false; // 改为 false，表示界不可通过
        }
        const index = row * 6 + col;
        const item = this.grid.children[index];
        return !item || item.classList.contains('matched');
    }

    // 检查拐角点是否有效
    isValidCorner(pos) {
        // 只有在游戏区域内的空格子才是有效的拐角点
        return pos.row >= 0 && pos.row < 12 && 
               pos.col >= 0 && pos.col < 6 && 
               this.isEmptyCell(pos.row, pos.col);
    }

    removeItems() {
        // 移除所有高亮效果
        const highlightedItems = this.grid.querySelectorAll('.hint-highlight');
        highlightedItems.forEach(item => {
            item.classList.remove('hint-highlight');
        });

        this.selectedItems.forEach(item => {
            item.classList.add('matched');
            item.classList.remove('selected');
        });
        this.selectedItems = [];
        
        // 任意一组被消除后，重置提示状态
        if (this.isHinting) {
            this.isHinting = false;
            // 如果还有提示次数，启用提示按钮
            if (this.hintCount > 0) {
                this.hintBtn.disabled = false;
            }
        }
    }

    resetSelection() {
        setTimeout(() => {
            this.selectedItems.forEach(item => {
                item.classList.remove('selected');
            });
            this.selectedItems = [];
        }, 500);
    }

    // 更新按钮上的次数显示
    updateButtonCounts() {
        const hintPlus = this.hintBtn.querySelector('.plus-icon');
        const shufflePlus = this.shuffleBtn.querySelector('.plus-icon');
        hintPlus.textContent = this.hintCount;
        shufflePlus.textContent = this.shuffleCount;
        
        // 当次数用完时禁用按钮
        this.hintBtn.disabled = this.hintCount <= 0;
        this.shuffleBtn.disabled = this.shuffleCount <= 0;
    }

    // 实现提示功能
    showHint() {
        if (this.hintCount <= 0 || this.isHinting) return;
        
        const matchingPair = this.findMatchingPair();
        if (matchingPair) {
            this.hintCount--;
            this.updateButtonCounts();
            this.isHinting = true;
            this.hintBtn.disabled = true;  // 禁用提示按钮
            
            this.highlightPair(matchingPair);
        }
    }

    // 寻找可以消除的一对方块
    findMatchingPair() {
        const items = Array.from(this.grid.children);
        for (let i = 0; i < items.length; i++) {
            for (let j = i + 1; j < items.length; j++) {
                const item1 = items[i];
                const item2 = items[j];
                
                // 跳过已经消除的方块
                if (item1.classList.contains('matched') || 
                    item2.classList.contains('matched')) {
                    continue;
                }
                
                // 检查是否可以匹配
                const pos1 = this.getItemPosition(item1);
                const pos2 = this.getItemPosition(item2);
                const index1 = parseInt(item1.dataset.iconIndex);
                const index2 = parseInt(item2.dataset.iconIndex);
                
                if (this.isSameIcon(this.gameIcons[index1], this.gameIcons[index2]) && 
                    this.canConnect(pos1, pos2)) {
                    return [item1, item2];
                }
            }
        }
        return null;
    }

    // 高亮显示可以消除的一对方块
    highlightPair(pair) {
        const [item1, item2] = pair;
        const highlightClass = 'hint-highlight';
        
        item1.classList.add(highlightClass);
        item2.classList.add(highlightClass);
        // 移除3秒后自动取消高亮的定时器
    }

    // 实现打乱功能
    shuffleGrid() {
        if (this.shuffleCount <= 0) return;
        
        this.shuffleCount--;
        this.updateButtonCounts();
        
        // 获取所有未消除的方���
        const activeItems = Array.from(this.grid.children)
            .filter(item => !item.classList.contains('matched'));
        
        // 获取这些方块的图标索引
        const activeIndices = activeItems.map(item => 
            parseInt(item.dataset.iconIndex));
        
        // 打乱索引
        const shuffledIndices = this.shuffleArray([...activeIndices]);
        
        // 重新分配图标
        activeItems.forEach((item, i) => {
            const newIndex = shuffledIndices[i];
            const iconObj = this.gameIcons[newIndex];
            item.innerHTML = iconObj.icon;
            item.querySelector('i').style.color = iconObj.color;
            item.dataset.iconIndex = newIndex;
        });
    }

    initMusic() {
        // 设置音量
        this.bgMusic.volume = 0.3;

        // 添加音乐控制事件
        this.musicBtn.addEventListener('click', () => {
            if (this.isMuted) {
                this.bgMusic.play();
                this.musicBtn.classList.remove('muted');
            } else {
                this.bgMusic.pause();
                this.musicBtn.classList.add('muted');
            }
            this.isMuted = !this.isMuted;
        });

        // 监听页面可见性变化
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.bgMusic.pause();
            } else if (!this.isMuted) {
                this.bgMusic.play();
            }
        });

        // 用户首次交互时开始播放音乐
        const startMusic = () => {
            if (!this.isMuted) {
                this.bgMusic.play();
                document.removeEventListener('click', startMusic);
            }
        };
        document.addEventListener('click', startMusic);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new FarmGame();
}); 