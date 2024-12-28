class FarmGame {
    constructor() {
        this.grid = document.querySelector('.game-grid');
        this.hintBtn = document.querySelector('.hint-btn');
        this.shuffleBtn = document.querySelector('.shuffle-btn');
        this.selectedItems = [];
        
        // 修改消除动画的 CSS
        this.style = document.createElement('style');
        this.style.textContent = `
            .match-animation {
                animation: match-fade 0.25s ease-out forwards;
                transform-origin: center center;
                pointer-events: none;
                visibility: visible;
            }

            @keyframes match-fade {
                0% {
                    transform: scale(1);
                    opacity: 1;
                    visibility: visible;
                }
                30% {
                    transform: scale(0.9);
                    opacity: 0.8;
                    visibility: visible;
                }
                99% {
                    transform: scale(0.6);
                    opacity: 0;
                    visibility: visible;
                }
                100% {
                    transform: scale(0.6);
                    opacity: 0;
                    visibility: hidden;
                }
            }

            /* 确保图标始终保持居中且不会撑满方块 */
            .grid-item i {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 24px;
                height: 24px;
                margin: auto;
            }

            /* 消除时保持图标大小不变 */
            .match-animation i {
                width: 24px;
                height: 24px;
                margin: auto;
            }

            @keyframes shake {
                0%, 100% {
                    transform: translateX(0);
                    border-color: #333;
                }
                20%, 60% {
                    transform: translateX(-2px);
                    border-color: #D32F2F;
                }
                40%, 80% {
                    transform: translateX(2px);
                    border-color: #D32F2F;
                }
            }

            .shake-animation {
                animation: shake 0.4s ease-in-out;
                border: 2px solid #D32F2F;
            }
        `;
        document.head.appendChild(this.style);

        // 修改图标库
        this.cuteIcons = [
            // 自然元素
            { icon: '<i class="fas fa-snowflake"></i>', color: '#00B0FF' },     // 雪花-亮蓝色
            { icon: '<i class="fas fa-cloud"></i>', color: '#00B0FF' },         // 云-亮蓝色
            { icon: '<i class="fas fa-fire"></i>', color: '#FF3D00' },          // 火-亮橙红色
            { icon: '<i class="fas fa-bolt"></i>', color: '#FFB300' },          // 闪电-金黄色
            { icon: '<i class="fas fa-star"></i>', color: '#FFB300' },          // 星星-金黄色
            { icon: '<i class="fas fa-moon"></i>', color: '#FFB300' },          // 月亮-金黄色
            
            // 音乐元素
            { icon: '<i class="fas fa-music"></i>', color: '#2E7D32' },         // 音符-深绿色
            { icon: '<i class="fas fa-guitar"></i>', color: '#8B4513' },        // 吉他-棕色
            { icon: '<i class="fas fa-headphones"></i>', color: '#2979FF' },    // 耳机-亮蓝色
            { icon: '<i class="fas fa-drum"></i>', color: '#8B4513' },          // 鼓-棕色
            { icon: '<i class="fas fa-bell"></i>', color: '#FFB300' },          // 铃铛-金黄色
            
            // 物品
            { icon: '<i class="fas fa-gift"></i>', color: '#FF1744' },          // 礼物-鲜红色
            { icon: '<i class="fas fa-key"></i>', color: '#FFB300' },           // 钥匙-金黄色
            { icon: '<i class="fas fa-gem"></i>', color: '#2979FF' },           // 宝石-亮蓝色
            { icon: '<i class="fas fa-book"></i>', color: '#8B4513' },          // 书本-棕色
            { icon: '<i class="fas fa-palette"></i>', color: '#FF4081' },       // 调色板-亮粉色
            { icon: '<i class="fas fa-magic"></i>', color: '#651FFF' },         // 魔杖-深紫色
            { icon: '<i class="fas fa-feather"></i>', color: '#2979FF' },       // 羽毛-亮蓝色
            { icon: '<i class="fas fa-compass"></i>', color: '#8B4513' },       // 指南针-棕色
            { icon: '<i class="fas fa-pen"></i>', color: '#2979FF' }            // 钢笔-亮蓝色
        ];

        // 修改关卡配置
        this.levelConfig = {
            1: { 
                icons: this.cuteIcons,
                maxPairs: 2  // 每种图案最多2对（4个）
            },
            2: { 
                icons: this.cuteIcons,
                maxPairs: 2
            },
            3: { 
                icons: this.cuteIcons,
                maxPairs: 2
            },
            4: { 
                icons: this.cuteIcons,
                maxPairs: 2
            },
            5: { 
                icons: this.cuteIcons,
                maxPairs: 2
            }
        };

        // 初始化关卡
        this.level = 1;
        
        // 生成初始图标对
        this.gameIcons = this.generatePairs();
        
        // 初始化其他属性
        this.hintCount = 3;
        this.shuffleCount = 3;
        this.isHinting = false;
        
        // 初始化音乐和音效
        this.bgMusic = document.getElementById('bgMusic');
        this.matchSound = document.getElementById('matchSound');
        this.musicBtn = document.querySelector('.music-btn');
        this.isMuted = false;
        
        if (this.matchSound) {
            this.matchSound.volume = 0.5;
        }
        
        // 添加错误音效
        this.errorSound = document.getElementById('errorSound');
        if (this.errorSound) {
            this.errorSound.volume = 0.5;
        }
        
        // 添加按钮音效
        this.dingSound = document.getElementById('dingSound');
        if (this.dingSound) {
            this.dingSound.volume = 0.5;
        }
        
        // 初始化音乐
        this.initMusic();
        
        // 更新显示
        this.updateButtonCounts();
        this.updateLevelDisplay();
        
        // 移除多余的关卡显示
        const gameInfo = document.querySelector('.game-info');
        if (gameInfo) {
            gameInfo.remove();
        }

        // 添加积分相关属性
        this.score = 0;
        this.lastMatchTime = 0;
        this.scoreDisplay = document.querySelector('.score-value');

        // 添加游戏结束音效
        this.gameOverSound = document.getElementById('gameOverSound');
        if (this.gameOverSound) {
            this.gameOverSound.volume = 0.5;
        }

        // 添加加载动画
        this.initLoading();
    }

    generatePairs() {
        let pairs = [];
        const currentLevel = this.levelConfig[this.level];
        const totalSlots = 60; // 总格子数
        const maxPairsPerIcon = 2; // 每种图案最多2对（4个）
        let remainingSlots = totalSlots;
        
        // 随机打乱所有图标
        const shuffledIcons = this.shuffleArray([...currentLevel.icons]);
        // 随机选择需要的图标数量
        const neededIcons = Math.ceil(totalSlots / 4); // 每个图标最多4个，所以至少需要多少种图标
        const selectedIcons = shuffledIcons.slice(0, neededIcons);
        
        // 为每个选中的图标随机分配1-2对（2-4个）
        while (remainingSlots > 0 && selectedIcons.length > 0) {
            const currentIcon = selectedIcons.pop();
            const pairsToAdd = Math.min(
                1 + Math.floor(Math.random() * maxPairsPerIcon), // 随机1-2对
                Math.floor(remainingSlots / 2) // 确保不超过剩余空位
            );
            
            // 添加图案对
            for (let i = 0; i < pairsToAdd; i++) {
                pairs.push(currentIcon);
                pairs.push(currentIcon);
                remainingSlots -= 2;
            }
        }
        
        // 如果还有剩余空位，用随机图标填充（保持2N原则）
        while (remainingSlots > 0) {
            const randomIcon = shuffledIcons[Math.floor(Math.random() * shuffledIcons.length)];
            pairs.push(randomIcon);
            pairs.push(randomIcon);
            remainingSlots -= 2;
        }

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
        // 确保所有资源加载完成后再创建网格
        if (document.readyState === 'complete') {
            this.createGrid();
            this.bindEvents();
        } else {
            window.addEventListener('load', () => {
                this.createGrid();
                this.bindEvents();
            });
        }
    }

    createGrid() {
        this.grid.innerHTML = '';
        
        // 创建所有格子但初始不显示
        for (let i = 0; i < 60; i++) {
            const item = document.createElement('div');
            item.className = 'grid-item';
            const iconObj = this.gameIcons[i];
            item.innerHTML = iconObj.icon;
            item.querySelector('i').style.color = iconObj.color;
            item.dataset.iconIndex = i;
            this.grid.appendChild(item);
        }

        // 随机顺序显示格子
        const items = Array.from(this.grid.children);
        const shuffledItems = this.shuffleArray([...items]);
        
        // 使用更快的显示间隔
        const showItems = (startIndex) => {
            // 每次显示多个方块
            for (let i = 0; i < 4; i++) {
                const index = startIndex + i;
                if (index >= shuffledItems.length) return;
                shuffledItems[index].classList.add('show');
            }
            
            if (startIndex + 4 < shuffledItems.length) {
                setTimeout(() => {
                    showItems(startIndex + 4);
                }, 10); // 减少延迟时间到10ms
            }
        };

        // 等待木框滑入动画完成后开始显示方块
        setTimeout(() => {
            showItems(0);
        }, 500);
    }

    bindEvents() {
        // 使用 touchstart 事件代替 click 事件，提高响应速度
        this.grid.addEventListener('touchstart', (e) => {
            e.preventDefault(); // 阻止默认行为
            const item = e.target.closest('.grid-item');
            if (!item || item.classList.contains('matched')) return;
            
            this.handleItemClick(item);
        });

        // 保留 click 事件用于桌面端
        this.grid.addEventListener('click', (e) => {
            const item = e.target.closest('.grid-item');
            if (!item || item.classList.contains('matched')) return;
            
            this.handleItemClick(item);
        });

        // 同样优化按钮的点击事件
        this.hintBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (!this.hintBtn.disabled) {
                this.showHint();
            }
        });
        this.hintBtn.addEventListener('click', () => {
            if (!this.hintBtn.disabled) {
                this.showHint();
            }
        });

        this.shuffleBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (!this.shuffleBtn.disabled) {
                this.shuffleGrid();
            }
        });
        this.shuffleBtn.addEventListener('click', () => {
            if (!this.shuffleBtn.disabled) {
                this.shuffleGrid();
            }
        });
    }

    handleItemClick(item) {
        console.log('点击方块:', item.dataset.iconIndex);
        
        // 检查是否可以点击
        if (!this.canClickItem(item)) {
            return;
        }
        
        // 处理选中逻辑
        this.handleItemSelection(item);
    }

    canClickItem(item) {
        if (this.selectedItems.includes(item)) {
            console.log('方块已被选中');
            return false;
        }
        
        if (item.classList.contains('matched') || item.dataset.removing === 'true') {
            console.log('方块已被消除或正在消除');
            return false;
        }
        
        return true;
    }

    handleItemSelection(item) {
        item.classList.add('selected');
        this.selectedItems.push(item);
        console.log('选中方块数:', this.selectedItems.length);
        
        if (this.selectedItems.length === 2) {
            this.handlePairSelection();
        }
    }

    handlePairSelection() {
        if (this.checkMatch()) {
            console.log('匹配成功');
            setTimeout(() => {
                this.removeItems();
            }, 200);
        } else {
            console.log('匹配失败');
            this.resetSelection();
        }
    }

    checkMatch() {
        const [item1, item2] = this.selectedItems;
        
        // 获取图标索引
        const index1 = parseInt(item1.dataset.iconIndex);
        const index2 = parseInt(item2.dataset.iconIndex);
        
        // 检查是否是相同的图标
        const icon1 = this.gameIcons[index1];
        const icon2 = this.gameIcons[index2];
        
        // 严格检查图标和颜色是否完全相同
        if (!this.isSameIcon(icon1, icon2)) {
            return false;
        }

        // 获取位置信息
        const pos1 = this.getItemPosition(item1);
        const pos2 = this.getItemPosition(item2);

        // 检查是否可以连接
        return this.canConnect(pos1, pos2);
    }

    // 修改检查标是否相同的方法
    isSameIcon(icon1, icon2) {
        if (!icon1 || !icon2) return false;
        
        // 严格比较图标和颜色
        return icon1.icon === icon2.icon && 
               icon1.color === icon2.color &&
               JSON.stringify(icon1) === JSON.stringify(icon2);
    }

    // 修改获取位置的方法
    getItemPosition(item) {
        const items = Array.from(this.grid.children);
        const index = items.indexOf(item);
        return {
            row: Math.floor(index / 6),  // 6列
            col: index % 6,
            index: index
        };
    }

    // 修改连接检查方法
    canConnect(pos1, pos2) {
        // 如果是同一个位置，返回false
        if (pos1.index === pos2.index) return false;

        // 检查是否有一个方块在边界
        const isPos1OnBorder = pos1.row === 0 || pos1.row === 9 || pos1.col === 0 || pos1.col === 5;
        const isPos2OnBorder = pos2.row === 0 || pos2.row === 9 || pos2.col === 0 || pos2.col === 5;

        // 如果两个方块都在边界上，只允许直线连接或相邻
        if (isPos1OnBorder && isPos2OnBorder) {
            // 检查是否相邻
            if (Math.abs(pos1.row - pos2.row) + Math.abs(pos1.col - pos2.col) === 1) {
                return true;
            }
            // 检查是否在同一条边上且直线可达
            if ((pos1.row === pos2.row && pos1.row === 0) ||
                (pos1.row === pos2.row && pos1.row === 9) ||
                (pos1.col === pos2.col && pos1.col === 0) ||
                (pos1.col === pos2.col && pos1.col === 5)) {
                return this.checkStraightLine(pos1, pos2);
            }
            return false;
        }

        // 1. 直线连接（没有折线）
        if (this.checkStraightLine(pos1, pos2)) {
            return true;
        }

        // 2. 一次折线
        if (this.checkOneCorner(pos1, pos2)) {
            return true;
        }

        // 3. 两次折线
        return this.checkTwoCorners(pos1, pos2);
    }

    // 修改检查直线连接的方法
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

    // 检查一次折线连接
    checkOneCorner(pos1, pos2) {
        // 检查两个可能的拐角
        const corner1 = { row: pos1.row, col: pos2.col };
        const corner2 = { row: pos2.row, col: pos1.col };

        // 检查第一个拐角
        if (this.isEmptyCell(corner1.row, corner1.col)) {
            if (this.checkStraightLine(pos1, corner1) && 
                this.checkStraightLine(corner1, pos2)) {
                return true;
            }
        }

        // 检查第二个拐角
        if (this.isEmptyCell(corner2.row, corner2.col)) {
            if (this.checkStraightLine(pos1, corner2) && 
                this.checkStraightLine(corner2, pos2)) {
                return true;
            }
        }

        return false;
    }

    // 修改两次折线检查方法
    checkTwoCorners(pos1, pos2) {
        // 遍历有可能的拐点（包括边界外一格的位置）
        for (let row = -1; row <= 10; row++) {
            for (let col = -1; col <= 6; col++) {
                const corner = { row, col };
                
                // 检查拐点是否有效
                if (!this.isValidCorner(corner)) continue;
                
                // 检查从pos1到corner的路径
                const path1Valid = this.checkOneCorner(pos1, corner);
                if (!path1Valid) continue;
                
                // 检查从corner到pos2的路径
                const path2Valid = this.checkOneCorner(corner, pos2);
                if (!path2Valid) continue;

                // 计算跨过的方块数（不包括边界外的点）
                const crossedCount1 = this.countCrossedItems(pos1, corner);
                const crossedCount2 = this.countCrossedItems(corner, pos2);

                // 只要有一边跨过的方块数小于等于1就可以连接
                if (crossedCount1 <= 1 || crossedCount2 <= 1) {
                    return true;
                }
            }
        }
        return false;
    }

    // 修改计算跨过方块数的方法
    countCrossedItems(pos1, pos2) {
        let count = 0;
        
        if (pos1.row === pos2.row) {
            // 水平方向
            const minCol = Math.min(pos1.col, pos2.col);
            const maxCol = Math.max(pos1.col, pos2.col);
            for (let col = minCol + 1; col < maxCol; col++) {
                // 只计算游戏区域内的方块
                if (col >= 0 && col < 6 && pos1.row >= 0 && pos1.row < 10) {
                    if (!this.isEmptyCell(pos1.row, col)) {
                        count++;
                    }
                }
            }
        } else if (pos1.col === pos2.col) {
            // 垂直方向
            const minRow = Math.min(pos1.row, pos2.row);
            const maxRow = Math.max(pos1.row, pos2.row);
            for (let row = minRow + 1; row < maxRow; row++) {
                // 只计算游戏区域内的方块
                if (row >= 0 && row < 10 && pos1.col >= 0 && pos1.col < 6) {
                    if (!this.isEmptyCell(row, pos1.col)) {
                        count++;
                    }
                }
            }
        }
        
        return count;
    }

    // 修改检查位置是否有效的方法
    isValidCorner(pos) {
        // 允许边界外一格的位置
        return pos.row >= -1 && pos.row <= 10 && 
               pos.col >= -1 && pos.col <= 6;
    }

    // 修改检查位置是否为空的方法
    isEmptyCell(row, col) {
        // 边界外的视为
        if (row < 0 || row >= 10 || col < 0 || col >= 6) {
            return true;
        }
        const index = row * 6 + col;
        const item = this.grid.children[index];
        return !item || item.classList.contains('matched');
    }

    removeItems() {
        console.log('开始消除方块');
        const [item1, item2] = this.selectedItems;
        
        if (!this.validateItemsForRemoval(item1, item2)) {
            return;
        }
        
        // 播放音效和更新分数
        if (this.matchSound && !this.isMuted) {
            this.matchSound.currentTime = 0;
            this.matchSound.play().catch(() => {});
        }
        this.updateScore(10);
        
        // 标记为正在消除
        item1.dataset.removing = 'true';
        item2.dataset.removing = 'true';
        
        // 添加消除动画
        requestAnimationFrame(() => {
            item1.classList.add('match-animation');
            item2.classList.add('match-animation');
            
            let animationsCompleted = 0;
            const onAnimationEnd = (item) => {
                animationsCompleted++;
                console.log('动画完成:', animationsCompleted);
                
                if (animationsCompleted === 2) {
                    console.log('两个方块动画都完成');
                    // 更新状态
                    [item1, item2].forEach(item => {
                        item.classList.remove('match-animation', 'selected');
                        item.classList.add('matched');
                        item.style.visibility = 'hidden';
                        item.style.opacity = '0';
                        delete item.dataset.removing;
                    });
                    
                    // 清除选中状态
                    this.selectedItems = [];
                    
                    // 检查游戏状态
                    setTimeout(() => {
                        this.checkGameComplete();
                        if (!this.checkHasValidMoves()) {
                            this.showGameOver();
                        }
                    }, 100);
                }
            };
            
            // 监听每个方块的动画结束
            item1.addEventListener('animationend', () => onAnimationEnd(item1), { once: true });
            item2.addEventListener('animationend', () => onAnimationEnd(item2), { once: true });
        });
    }

    validateItemsForRemoval(item1, item2) {
        if (!item1 || !item2 || 
            item1.classList.contains('matched') || 
            item2.classList.contains('matched') ||
            item1.dataset.removing === 'true' || 
            item2.dataset.removing === 'true') {
            console.log('方块已被消除或正在消除');
            this.selectedItems = [];
            return false;
        }
        return true;
    }

    executeRemoveAnimation(item1, item2) {
        console.log('开始执行消除动画');
        
        // 标记为正在消除
        item1.dataset.removing = 'true';
        item2.dataset.removing = 'true';
        
        // 添加消除动画
        item1.classList.add('match-animation');
        item2.classList.add('match-animation');
        
        // 监听动画完成
        let animationsCompleted = 0;
        const onAnimationEnd = () => {
            animationsCompleted++;
            console.log('动画完成次数:', animationsCompleted);
            
            if (animationsCompleted === 2) {
                console.log('两个动画都完成了');
                // 移除动画类
                item1.classList.remove('match-animation', 'selected');
                item2.classList.remove('match-animation', 'selected');
                
                // 添加匹配状态
                item1.classList.add('matched');
                item2.classList.add('matched');
                
                // 隐藏方块
                item1.style.visibility = 'hidden';
                item2.style.visibility = 'hidden';
                
                // 移除正在消除的标记
                delete item1.dataset.removing;
                delete item2.dataset.removing;
                
                // 清除选中状态
                this.selectedItems = [];
                
                // 检查游戏状态
                this.checkGameComplete();
                if (!this.checkHasValidMoves()) {
                    this.showGameOver();
                }
            }
        };
        
        // 分别监听两个方块的动画结束
        item1.addEventListener('animationend', onAnimationEnd, { once: true });
        item2.addEventListener('animationend', onAnimationEnd, { once: true });
    }

    showScoreAnimation(points) {
        // 如果是负分，直接更新分数不显示动画
        if (points < 0) {
            this.updateScore(points);
            return;
        }

        const scorePopup = document.createElement('div');
        scorePopup.className = 'score-popup';
        scorePopup.textContent = `+${points}`;
        
        document.body.appendChild(scorePopup);
        
        // 获取分数显示框的位置
        const scoreDisplay = document.querySelector('.score-display');
        const scoreRect = scoreDisplay.getBoundingClientRect();
        
        // 计算动画终点位置（相对于视口中心的偏移
        const endX = scoreRect.left + (scoreRect.width / 2) - window.innerWidth / 2;
        const endY = scoreRect.top + (scoreRect.height / 2) - window.innerHeight / 2;
        
        // 设置CSS变量
        scorePopup.style.setProperty('--target-x', `${endX}px`);
        scorePopup.style.setProperty('--target-y', `${endY}px`);
        
        // 添加出现动画结束监听
        scorePopup.addEventListener('animationend', () => {
            // 添加飞行动画
            scorePopup.style.animation = 'score-fly-to-target 0.3s ease-in forwards';
            
            // 飞行动画结束后移除元素并更新分数
            scorePopup.addEventListener('animationend', () => {
                scorePopup.remove();
                this.updateScore(points);
            }, { once: true });
        }, { once: true });
    }

    resetSelection() {
        const [item1, item2] = this.selectedItems;
        
        // 播放错误音效
        if (this.errorSound && !this.isMuted) {
            try {
                this.errorSound.currentTime = 0;
                this.errorSound.play().catch(() => {});
            } catch (error) {
                console.log('错误音效播放失败:', error);
            }
        }
        
        // 添加摇晃动画
        item1.classList.add('shake-animation');
        item2.classList.add('shake-animation');
        
        // 动画结束后移除类名
        setTimeout(() => {
            item1.classList.remove('selected', 'shake-animation');
            item2.classList.remove('selected', 'shake-animation');
            this.selectedItems = [];
        }, 400);
    }

    // 更新按钮上次���显示
    updateButtonCounts() {
        const hintPlus = this.hintBtn.querySelector('.plus-icon');
        const shufflePlus = this.shuffleBtn.querySelector('.plus-icon');
        hintPlus.textContent = this.hintCount;
        shufflePlus.textContent = this.shuffleCount;
        
        // 只在提示次数为0时禁用提示按钮
        this.hintBtn.disabled = this.hintCount <= 0;
        // 当次数用完时禁用洗牌按钮
        this.shuffleBtn.disabled = this.shuffleCount <= 0;
    }

    // 实现提示功能
    showHint() {
        if (this.hintCount <= 0 || this.isHinting) return;
        
        const matchingPair = this.findMatchingPair();
        if (!matchingPair) {
            return;
        }
        
        // 播放按钮音效
        if (this.dingSound && !this.isMuted) {
            this.dingSound.currentTime = 0;
            this.dingSound.play().catch(() => {});
        }
        
        this.updateScore(-10);
        this.hintCount--;
        this.updateButtonCounts();
        this.isHinting = true;
        
        // 先移除所有现有的提示高亮
        document.querySelectorAll('.hint-highlight').forEach(item => {
            item.classList.remove('hint-highlight');
        });
        
        // 添加新的高亮
        matchingPair[0].classList.add('hint-highlight');
        matchingPair[1].classList.add('hint-highlight');
        
        // 3秒后自动取消高亮
        this.hintTimer = setTimeout(() => {
            document.querySelectorAll('.hint-highlight').forEach(item => {
                item.classList.remove('hint-highlight');
            });
            this.isHinting = false;
        }, 3000);
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

    // 亮显示可以消除的一对方块
    highlightPair(pair) {
        const [item1, item2] = pair;
        const highlightClass = 'hint-highlight';
        
        item1.classList.add(highlightClass);
        item2.classList.add(highlightClass);
        // 移除3秒后自动取消高亮定时器
    }

    // 实现打乱功能
    shuffleGrid() {
        console.log('开始打乱方块');
        if (this.shuffleCount <= 0) return;
        
        this.shuffleCount--;
        this.updateScore(-20);
        this.updateButtonCounts();
        
        // 重置所有状态
        this.clearAllStates();
        
        // 获取活跃方块
        const activeItems = this.getActiveItems();
        console.log('活跃方块数量:', activeItems.length);
        
        // 创建新的打乱数组
        const shuffledPairs = this.createShuffledPairs(activeItems);
        console.log('打乱后的配对:', shuffledPairs);
        
        // 应用打乱效果
        this.applyShuffleEffect(activeItems, shuffledPairs);
    }

    clearAllStates() {
        // 清除所有临时状态
        this.selectedItems.forEach(item => {
            item.classList.remove('selected', 'hint-highlight', 'shake-animation');
        });
        this.selectedItems = [];
        this.isHinting = false;
        if (this.hintTimer) {
            clearTimeout(this.hintTimer);
        }
    }

    getActiveItems() {
        return Array.from(this.grid.children)
            .filter(item => !item.classList.contains('matched'));
    }

    createShuffledPairs(activeItems) {
        // 创建配对数组
        const pairs = activeItems.map(item => ({
            icon: this.gameIcons[parseInt(item.dataset.iconIndex)],
            index: parseInt(item.dataset.iconIndex)
        }));
        return this.shuffleArray([...pairs]);
    }

    applyShuffleEffect(items, shuffledPairs) {
        items.forEach((item, i) => {
            // 添加翻转出动画
            item.style.animation = 'flip-out 0.15s ease-out';
            
            setTimeout(() => {
                // 更新内容
                const newPair = shuffledPairs[i];
                this.updateItemContent(item, newPair);
                
                // 添加翻转入动画
                item.style.animation = 'flip-in 0.15s ease-out';
            }, 150);
        });
    }

    updateItemContent(item, newPair) {
        // 更新图标和索引
        item.innerHTML = newPair.icon.icon;
        item.querySelector('i').style.color = newPair.icon.color;
        item.dataset.iconIndex = newPair.index.toString();
        
        // 重置样式
        item.className = 'grid-item show';
        item.style.backgroundColor = '#FFF9C4';
        item.style.border = '1px solid #DEB887';
        item.style.visibility = 'visible';
        item.style.opacity = '1';
        item.style.transform = 'none';
        
        console.log('更新方块:', {
            oldIndex: item.dataset.iconIndex,
            newIndex: newPair.index,
            icon: newPair.icon.icon
        });
    }

    initMusic() {
        if (!this.bgMusic || !this.musicBtn) return;

        this.bgMusic.volume = 0.3;
        
        // 在构造函数就尝试播放音乐
        const playMusic = () => {
            this.bgMusic.play().catch(() => {
                // 如果自动播放失败，添加一次性点击事件
                document.addEventListener('click', () => {
                    this.bgMusic.play();
                }, { once: true });
            });
        };

        // 如果文档经加载完成，直接播放
        if (document.readyState === 'complete') {
            playMusic();
        } else {
            // 否则等待档加载完成后播放
            window.addEventListener('load', playMusic);
        }

        // 音乐控制按钮��件
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
    }

    validateLayout() {
        const blocks = [...this.blocks];
        while (blocks.length > 0) {
            let found = false;
            for (let i = 0; i < blocks.length; i++) {
                for (let j = i + 1; j < blocks.length; j++) {
                    if (blocks[i].type === blocks[j].type && 
                        this.canConnect(blocks[i], blocks[j])) {
                        // 移除可以连接的方块对
                        blocks.splice(j, 1);
                        blocks.splice(i, 1);
                        found = true;
                        break;
                    }
                }
                if (found) break;
            }
            // 如果没有找到可以连接的方块对，说明布局无解
            if (!found && blocks.length > 0) {
                return false;
            }
        }
        return true;
    }

    // 修改初始化法，确保生成可解的布局
    initBlocks() {
        do {
            this.blocks = [];
            // 有的方块生成逻辑
            // ...
        } while (!this.validateLayout());
    }

    // 添加检查游戏是否结束的方法
    checkGameComplete() {
        const remainingItems = Array.from(this.grid.children).filter(
            item => !item.classList.contains('matched')
        );

        if (remainingItems.length === 0) {
            const nextLevel = this.level + 1;
            
            // 示烟动画
            this.showFireworks(() => {
                // 烟花动画结束后再显示五彩纸屑
                this.showConfetti(() => {
                    if (this.level === 5) {
                        this.level = 1;
                    } else {
                        this.level = nextLevel;
                    }
                    
                    this.updateLevelDisplay();
                    this.hintCount = 3;
                    this.shuffleCount = 3;
                    this.updateButtonCounts();
                    this.gameIcons = this.generatePairs();
                    
                    // 延迟创建新网格，保动画完成
                    setTimeout(() => {
                        this.createGrid();
                    }, 500);
                });
            });
        }
    }

    // 在消��方块的方法中加完成
    removeBlocks(block1, block2) {
        // 原有的消除逻辑
        // ...

        // 检查是否完成当前关卡
        this.checkGameComplete();
    }

    updateLevelDisplay() {
        const levelText = document.querySelector('.level-text');
        if (levelText) {
            levelText.textContent = `第 ${this.level} 关`;
        }
    }

    // 添加烟花动画方法
    showFireworks(callback) {
        // 创建烟花容器
        const fireworksContainer = document.createElement('div');
        fireworksContainer.className = 'fireworks-container';
        document.querySelector('.game-content').appendChild(fireworksContainer);

        // 创建多个烟
        const fireworkCount = 15; // 增加烟花数
        const duration = 2000; // 画持时间

        for (let i = 0; i < fireworkCount; i++) {
            setTimeout(() => {
                this.createFirework(fireworksContainer);
            }, i * 150); // 调整发间隔
        }

        // 动画结束后清理并执行回调
        setTimeout(() => {
            fireworksContainer.remove();
            if (callback) callback();
        }, duration);
    }

    // 修改单个烟花创建法
    createFirework(container) {
        const firework = document.createElement('div');
        firework.className = 'firework';
        
        // 随机位置（确保在游戏区内
        const x = 20 + Math.random() * 60; // 20% 到 80% 之间
        const y = 20 + Math.random() * 60; // 20% 到 80% 之间
        firework.style.left = `${x}%`;
        firework.style.top = `${y}%`;
        
        // 更丰富的颜色选择
        const colors = [
            '#FFD700', // 金色
            '#FF69B4', // 粉红
            '#4ECDC4', // 绿
            '#FF6B6B', // 珊瑚红
            '#A1E887', // 浅绿
            '#87CEEB', // 天蓝
            '#DDA0DD', // 梅红
            '#F0E68C'  // 卡其黄
        ];
        const color = colors[Math.floor(Math.random() * colors.length)];
        firework.style.setProperty('--firework-color', color);
        
        container.appendChild(firework);
        
        // 动画结束后移除
        firework.addEventListener('animationend', () => {
            firework.remove();
        });
    }

    // 修改五纸屑动画方法
    showConfetti(callback) {
        const container = document.createElement('div');
        container.className = 'confetti-container';
        document.querySelector('.game-content').appendChild(container);

        // 创建多个色粒子
        const colors = [
            '#FF69B4', // 红
            '#87CEEB', // 蓝
            '#90EE90', // 浅绿
            '#FFD700', // 金
            '#FF7F50', // 珊瑚色
            '#DDA0DD', // 梅红
            '#F0E68C', // 卡其黄
            '#00CED1'  // 青色
        ];
        const particleCount = 35;  // 调整粒数量

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'confetti-particle';
            
            // 随机颜色
            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            
            // 随机始位置（在整个宽度范围内）
            particle.style.left = `${Math.random() * 100}%`;
            
            // 随机延迟开始
            particle.style.animationDelay = `${Math.random() * 0.4}s`;  // 缩短最大延迟时间
            
            // 随机动画持续时间（增加一些变）
            const duration = 1 + Math.random() * 0.4; // 1-1.4秒的随机持续时间
            particle.style.animationDuration = `${duration}s`;
            
            // 随机大小变化
            const size = 8 + Math.random() * 6;  // 8-14px的随机大小
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            container.appendChild(particle);
        }

        // 等待所有粒子动画成清理
        setTimeout(() => {
            container.remove();
            if (callback) callback();
        }, 1800);  // 大于最大动画间（1.4s + 0.4s延迟）
    }

    // 添加判断是否相���的方法
    isAdjacent(item1, item2) {
        const pos1 = this.getItemPosition(item1);
        const pos2 = this.getItemPosition(item2);
        
        return (Math.abs(pos1.row - pos2.row) + Math.abs(pos1.col - pos2.col)) === 1;
    }

    // 添加显示激光束的方法
    showLaserLine(item1, item2) {
        const rect1 = item1.getBoundingClientRect();
        const rect2 = item2.getBoundingClientRect();
        
        const x1 = rect1.left + rect1.width / 2;
        const y1 = rect1.top + rect1.height / 2;
        const x2 = rect2.left + rect2.width / 2;
        const y2 = rect2.top + rect2.height / 2;
        
        const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
        
        const line = document.createElement('div');
        line.className = 'laser-line';
        line.style.width = `${length}px`;
        line.style.left = `${x1}px`;
        line.style.top = `${y1}px`;
        line.style.transform = `rotate(${angle}deg)`;
        
        document.body.appendChild(line);
        
        // 动画结束后移除激光束
        setTimeout(() => {
            line.remove();
        }, 300);
    }

    // 添加更新积分的方法
    updateScore(points) {
        this.score += points;
        this.scoreDisplay.textContent = this.score;
    }

    // 添加检查是否有可消除方块的方法
    checkHasValidMoves() {
        // 如果还有洗牌机会，就不算游戏结束
        if (this.shuffleCount > 0) {
            return true;
        }

        const items = Array.from(this.grid.children);
        for (let i = 0; i < items.length; i++) {
            for (let j = i + 1; j < items.length; j++) {
                const item1 = items[i];
                const item2 = items[j];
                
                // 跳过已消除的方块
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
                    return true;
                }
            }
        }
        return false;
    }

    // 显示游戏结束画面
    showGameOver() {
        // 播放游戏结束音效
        if (this.gameOverSound && !this.isMuted) {
            this.gameOverSound.currentTime = 0;
            this.gameOverSound.play().catch(() => {});
        }
        
        // 创建游戏结束界面
        const overlay = document.createElement('div');
        overlay.className = 'game-over-overlay';
        
        const modal = document.createElement('div');
        modal.className = 'game-over-modal';
        
        const text = document.createElement('div');
        text.className = 'game-over-text';
        text.textContent = 'Game Over';
        
        modal.appendChild(text);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
    }

    initLoading() {
        const loadingScreen = document.querySelector('.loading-screen');
        const progressBar = document.querySelector('.progress-bar');
        const gameContainer = document.querySelector('.game-container');
        let progress = 0;

        // 模拟加载进度
        const loadingInterval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress > 100) progress = 100;
            progressBar.style.width = `${progress}%`;

            if (progress === 100) {
                clearInterval(loadingInterval);
                setTimeout(() => {
                    // 淡出加载界面
                    loadingScreen.style.opacity = '0';
                    loadingScreen.style.transition = 'opacity 0.5s ease';
                    
                    // 显示游戏界面
                    gameContainer.style.opacity = '1';
                    
                    // 移除加载界面并开始游戏
                    setTimeout(() => {
                        loadingScreen.remove();
                        this.createGrid();
                        this.bindEvents();
                    }, 500);
                }, 500);
            }
        }, 100);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new FarmGame();
}); 

// 加过关动画
function showLevelUpAnimation() {
    const levelUpElement = document.createElement('div');
    levelUpElement.className = 'level-up-animation';
    levelUpElement.innerText = '恭喜你过关！';
    document.body.appendChild(levelUpElement);
    
    // 动画效果
    setTimeout(() => {
        levelUpElement.classList.add('fade-out');
    }, 2000); // 2秒后开始淡

    setTimeout(() => {
        document.body.removeChild(levelUpElement);
    }, 4000); // 4秒后移除元素
} 