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
                animation: match-fade 0.3s ease-out forwards;
                transform-origin: center center;
                pointer-events: none;
            }

            @keyframes match-fade {
                0% {
                    transform: scale(1);
                    opacity: 1;
                }
                60% {
                    transform: scale(1.2);
                    opacity: 0.3;
                }
                100% {
                    transform: scale(0);
                    opacity: 0;
                    visibility: hidden;
                }
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

        // 重新设计可爱图标库 - 使用更深的红色和绿色
        this.cuteIcons = [
            // 食物类
            { icon: '<i class="fas fa-ice-cream"></i>', color: '#D32F2F' },     // 冰淇淋-深红色
            { icon: '<i class="fas fa-cookie"></i>', color: '#FF4081' },        // 饼干-亮粉
            { icon: '<i class="fas fa-candy-cane"></i>', color: '#C2185B' },    // 糖果-深玫红
            { icon: '<i class="fas fa-apple-alt"></i>', color: '#B71C1C' },     // 苹果-深红色
            { icon: '<i class="fas fa-pizza-slice"></i>', color: '#C62828' },   // 披萨-深红色
            { icon: '<i class="fas fa-hamburger"></i>', color: '#FF6D00' },     // 汉堡-亮橙
            { icon: '<i class="fas fa-cheese"></i>', color: '#FF5722' },        // 奶酪-深橙
            { icon: '<i class="fas fa-carrot"></i>', color: '#FF3D00' },        // 胡萝卜-亮橙红
            { icon: '<i class="fas fa-bread-slice"></i>', color: '#E65100' },   // 面包-深橙
            { icon: '<i class="fas fa-egg"></i>', color: '#FF4081' },           // 鸡蛋-亮粉
            
            // 水果和甜点
            { icon: '<i class="fas fa-lemon"></i>', color: '#FF6D00' },         // 柠檬-亮橙
            { icon: '<i class="fas fa-pepper-hot"></i>', color: '#C62828' },    // 辣椒-深红色
            { icon: '<i class="fas fa-birthday-cake"></i>', color: '#FF4081' }, // 蛋糕-亮粉
            { icon: '<i class="fas fa-coffee"></i>', color: '#FF3D00' },        // 咖啡-亮橙红
            { icon: '<i class="fas fa-wine-glass"></i>', color: '#D500F9' },    // 酒杯-亮紫
            
            // 心形和星星
            { icon: '<i class="fas fa-heart"></i>', color: '#C62828' },         // 心-深红色
            { icon: '<i class="fas fa-star"></i>', color: '#FF6D00' },          // 星-亮橙
            { icon: '<i class="fas fa-crown"></i>', color: '#FF3D00' },         // 皇冠-亮橙红
            { icon: '<i class="fas fa-sun"></i>', color: '#FF5722' },           // 太阳-深橙
            { icon: '<i class="fas fa-moon"></i>', color: '#651FFF' },          // 月亮-亮紫
            
            // 自然元素
            { icon: '<i class="fas fa-leaf"></i>', color: '#2E7D32' },          // 叶子-深绿色
            { icon: '<i class="fas fa-snowflake"></i>', color: '#00B0FF' },     // 雪花-亮蓝
            { icon: '<i class="fas fa-cloud"></i>', color: '#2979FF' },         // 云-亮蓝
            { icon: '<i class="fas fa-fire"></i>', color: '#C62828' },          // 火-深红色
            { icon: '<i class="fas fa-bolt"></i>', color: '#C62828' },          // 闪电-深红色
            
            // 音乐元素
            { icon: '<i class="fas fa-music"></i>', color: '#651FFF' },         // 音符-亮紫
            { icon: '<i class="fas fa-guitar"></i>', color: '#FF6D00' },        // 吉他-亮橙
            { icon: '<i class="fas fa-headphones"></i>', color: '#2979FF' },    // 耳机-亮蓝
            { icon: '<i class="fas fa-drum"></i>', color: '#1B5E20' },          // 鼓-深绿色
            { icon: '<i class="fas fa-bell"></i>', color: '#C62828' },          // 铃铛-深红色
            
            // 可爱物品
            { icon: '<i class="fas fa-gift"></i>', color: '#FF4081' },          // 礼物-亮粉
            { icon: '<i class="fas fa-key"></i>', color: '#FF5722' },           // 钥匙-深橙
            { icon: '<i class="fas fa-gem"></i>', color: '#00B0FF' },           // 宝石-亮蓝
            { icon: '<i class="fas fa-book"></i>', color: '#1B5E20' },          // 书本-深绿色
            { icon: '<i class="fas fa-palette"></i>', color: '#651FFF' }        // 调色板-亮紫
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
        
        // 确保游戏初始化完成后再创建网格
        this.init();
        
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
        const neededIcons = Math.ceil(totalSlots / 4); // 每个图标最多4个，所以至少需要这么多种图标
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
        
        // 使用递归函数依次显示格子
        const showItem = (index) => {
            if (index >= shuffledItems.length) return;
            
            setTimeout(() => {
                shuffledItems[index].classList.add('show');
                showItem(index + 1);
            }, 7); // 从 20ms 改为 7ms
        };

        // 开始显示动画
        showItem(0);
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
        const icon1 = this.gameIcons[index1];
        const icon2 = this.gameIcons[index2];
        
        // 先检查是否是相同图标
        if (!this.isSameIcon(icon1, icon2)) {
            return false;
        }

        // 获取两个元素的位置信息
        const pos1 = this.getItemPosition(item1);
        const pos2 = this.getItemPosition(item2);

        // 检查是否可以连接
        return this.canConnect(pos1, pos2);
    }

    // 修改检查图标是否相同的方法
    isSameIcon(icon1, icon2) {
        // 确保两个图标对象都存在
        if (!icon1 || !icon2) return false;
        
        // 检查图标和颜色是否完全相同
        return icon1.icon === icon2.icon && icon1.color === icon2.color;
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
        if (pos1.index === pos2.index) {
            return false;
        }

        // 检查直线连接
        if (this.checkStraightLine(pos1, pos2)) {
            return true;
        }

        // 检查一个拐角的连接
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
        // 检查两个可能的拐角
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

    // 检查位置是否（包括超出边界的情况）
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

        // 播放消除音效（添加检查）
        if (this.matchSound && !this.isMuted) {
            try {
                this.matchSound.currentTime = 0;
                this.matchSound.play().catch(error => {
                    console.log('音效播放失败:', error);
                });
            } catch (error) {
                console.log('音效处理错误:', error);
            }
        }

        // 修改消除动画理
        let removedCount = 0;
        const totalToRemove = this.selectedItems.length;

        this.selectedItems.forEach(item => {
            item.classList.add('match-animation');
            
            // 减少动画时间
            item.style.animation = 'match-animation 0.2s ease-out'; // 从默认的 0.3s 改为 0.2s
            
            // 动画结束后处理
            item.addEventListener('animationend', () => {
                item.classList.remove('match-animation');
                item.classList.add('matched');
                item.classList.remove('selected');
                item.style.backgroundColor = 'transparent';
                item.style.border = 'none';
                item.innerHTML = '';
                
                removedCount++;
                
                // 当所有选中的方块都被移除后，检查游戏是否完成
                if (removedCount === totalToRemove) {
                    // 检查是否所有方块都已被消除
                    const allItems = Array.from(this.grid.children);
                    const remainingItems = allItems.filter(item => !item.classList.contains('matched'));
                    
                    if (remainingItems.length === 0) {
                        // 所有方块都被消除，触发过关
                        setTimeout(() => {
                            const nextLevel = this.level + 1;
                            
                            // 触发烟花动画
                            this.showFireworks(() => {
                                if (this.level === 5) {
                                    this.level = 1;
                                } else {
                                    this.level = nextLevel;
                                }
                                
                                // 更新关卡显示和重置游戏状态
                                this.updateLevelDisplay();
                                this.hintCount = 3;
                                this.shuffleCount = 3;
                                this.updateButtonCounts();
                                this.gameIcons = this.generatePairs();
                                this.createGrid();
                            });
                        }, 300);
                    }
                }
            }, { once: true });
        });

        this.selectedItems = [];
        
        // 重置提示状态
        if (this.isHinting) {
            this.isHinting = false;
            if (this.hintCount > 0) {
                this.hintBtn.disabled = false;
            }
        }
    }

    resetSelection() {
        const [item1, item2] = this.selectedItems;
        
        // 添加摇晃动画
        item1.classList.add('shake-animation');
        item2.classList.add('shake-animation');
        
        // 动画结束后移除类名
        setTimeout(() => {
            item1.classList.remove('selected', 'shake-animation');
            item2.classList.remove('selected', 'shake-animation');
            this.selectedItems = [];
        }, 400); // 与动画持续时间相同
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
            
            // 高亮显示
            this.highlightPair(matchingPair);
            
            // 3秒后自动取消高亮
            setTimeout(() => {
                matchingPair.forEach(item => {
                    item.classList.remove('hint-highlight');
                });
                this.isHinting = false;
                // 如果还有提示次数，重新启用按钮
                if (this.hintCount > 0) {
                    this.hintBtn.disabled = false;
                }
            }, 3000);
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
        // 移除3秒后自动取消高亮定时器
    }

    // 实现打乱功能
    shuffleGrid() {
        if (this.shuffleCount <= 0) return;
        
        this.shuffleCount--;
        this.updateButtonCounts();
        
        // 获取所有未消除的方块
        const activeItems = Array.from(this.grid.children)
            .filter(item => !item.classList.contains('matched'));
        
        // 只打乱图标和颜色，保持位置不变
        const icons = activeItems.map(item => {
            const index = parseInt(item.dataset.iconIndex);
            return this.gameIcons[index];
        });
        
        // 打乱图标数组
        const shuffledIcons = this.shuffleArray([...icons]);
        
        // 更新方块的图标和颜色（添加动画）
        activeItems.forEach((item, i) => {
            // 添加翻转动
            item.style.animation = 'flip-out 0.15s ease-out';
            
            setTimeout(() => {
                const newIcon = shuffledIcons[i];
                item.innerHTML = newIcon.icon;
                item.querySelector('i').style.color = newIcon.color;
                item.dataset.iconIndex = this.gameIcons.indexOf(newIcon);
                
                // 翻转回来
                item.style.animation = 'flip-in 0.15s ease-out';
            }, 150);
        });
    }

    initMusic() {
        if (!this.bgMusic || !this.musicBtn) return;

        this.bgMusic.volume = 0.3;
        
        // 尝试自动播放
        const playPromise = this.bgMusic.play();
        
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                // 自动播放失败时，添加一次性点击事件来开始播放
                const startMusic = () => {
                    this.bgMusic.play().catch(() => {});
                    document.removeEventListener('click', startMusic);
                };
                document.addEventListener('click', startMusic, { once: true });
            });
        }

        // 音乐控制按钮事件
        this.musicBtn.addEventListener('click', () => {
            if (this.isMuted) {
                this.bgMusic.play().catch(() => {});
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

    // 修改初始化方法，确保生成可解的布局
    initBlocks() {
        do {
            this.blocks = [];
            // 原有的方块生成逻辑
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
            
            // 显示过关动画，然后直接进入下一��
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
                this.createGrid();
            });
        }
    }

    // 在消除方块的方法中加完成
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

        // 创建多个烟花
        const fireworkCount = 15; // 增加烟花数
        const duration = 2000; // 动画持续时间

        for (let i = 0; i < fireworkCount; i++) {
            setTimeout(() => {
                this.createFirework(fireworksContainer);
            }, i * 150); // 调整发射间隔
        }

        // 动画结束后清理并执行回调
        setTimeout(() => {
            fireworksContainer.remove();
            if (callback) callback();
        }, duration);
    }

    // 修改单个烟花创建方法
    createFirework(container) {
        const firework = document.createElement('div');
        firework.className = 'firework';
        
        // 随机位置（确保在游戏区域内）
        const x = 20 + Math.random() * 60; // 20% 到 80% 之间
        const y = 20 + Math.random() * 60; // 20% 到 80% 之间
        firework.style.left = `${x}%`;
        firework.style.top = `${y}%`;
        
        // 更丰富的颜色选择
        const colors = [
            '#FFD700', // 金色
            '#FF69B4', // 粉红
            '#4ECDC4', // 青绿
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

    // 修改五彩纸屑动画方法
    showConfetti(callback) {
        const container = document.createElement('div');
        container.className = 'confetti-container';
        document.querySelector('.game-content').appendChild(container);

        // 创建多个彩色粒子
        const colors = [
            '#FF69B4', // 粉红
            '#87CEEB', // 天蓝
            '#90EE90', // 浅绿
            '#FFD700', // 金色
            '#FF7F50', // 珊瑚色
            '#DDA0DD', // 梅红
            '#F0E68C', // 卡其黄
            '#00CED1'  // 青色
        ];
        const particleCount = 35;  // 调整粒子数量

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'confetti-particle';
            
            // 随机颜色
            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            
            // 随机初始位置（在整个宽度范围内）
            particle.style.left = `${Math.random() * 100}%`;
            
            // 随机延迟开始
            particle.style.animationDelay = `${Math.random() * 0.4}s`;  // 缩短最大延迟时间
            
            // 随机动画持续时间（增加一些变化）
            const duration = 1 + Math.random() * 0.4; // 1-1.4秒的随机持续时间
            particle.style.animationDuration = `${duration}s`;
            
            // 随机大小变化
            const size = 8 + Math.random() * 6;  // 8-14px的随机大小
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            container.appendChild(particle);
        }

        // 等待所有粒子动画完成后清理
        setTimeout(() => {
            container.remove();
            if (callback) callback();
        }, 1800);  // 略大于最大动画时间（1.4s + 0.4s延迟）
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new FarmGame();
}); 

// 添加过关动画
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