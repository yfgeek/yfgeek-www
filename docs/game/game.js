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
        
        // 修改关卡配置
        this.levelConfig = {
            1: { iconCount: 8 },  // 第1关：每种图案8个
            2: { iconCount: 6 },  // 第2关：每种图案6个
            3: { iconCount: 4 },  // 第3关：每种图案4个
            4: { iconCount: 2 },  // 第4关：每种图案2个
            5: { iconCount: 2 }   // 第5关：每种图案2个
        };
        
        this.gameIcons = this.generatePairs();
        
        // 添加音乐和音效控制
        this.bgMusic = document.getElementById('bgMusic');
        this.matchSound = document.getElementById('matchSound');
        this.musicBtn = document.querySelector('.music-btn');
        this.isMuted = false;
        
        // 设置音效音量
        if (this.matchSound) {
            this.matchSound.volume = 0.5;
        }
        
        // 初始化音乐
        this.initMusic();
        
        // 添加按钮使用次数计数器
        this.hintCount = 3;
        this.shuffleCount = 3;
        
        // 添加按钮次数显示
        this.updateButtonCounts();
        
        // 添加提示状态标记
        this.isHinting = false;
        
        this.level = 1;
        this.updateLevelDisplay();
        
        // 直接初始化游戏，不播放动画
        this.init();
    }

    generatePairs() {
        let pairs = [];
        const iconCount = this.levelConfig[this.level]?.iconCount || 4; // 默认为4
        
        // 计算需要多少种不同的图案
        const neededIconTypes = Math.floor(60 / iconCount); // 60是总格子数
        
        // 从图标池中随机选择需要的图标类型
        const selectedIcons = this.shuffleArray([...this.icons]).slice(0, neededIconTypes);
        
        // 为每个选中的图标生成指定数量的副本
        selectedIcons.forEach(icon => {
            for (let i = 0; i < iconCount; i++) {
                pairs.push(icon);
            }
        });

        // 如果生成的对数不足60个，用第一个图标补足
        while (pairs.length < 60) {
            pairs.push(selectedIcons[0]);
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
        this.createGrid();
        this.bindEvents();
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

        // 修改消除动画处理
        let removedCount = 0;
        const totalToRemove = this.selectedItems.length;

        this.selectedItems.forEach(item => {
            item.classList.add('match-animation');
            
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
                            
                            // 创建烟花容器
                            const fireworksContainer = document.createElement('div');
                            fireworksContainer.className = 'fireworks-container';
                            document.querySelector('.game-content').appendChild(fireworksContainer);

                            // 创建多个烟花
                            const fireworkCount = 15;
                            for (let i = 0; i < fireworkCount; i++) {
                                setTimeout(() => {
                                    this.createFirework(fireworksContainer);
                                }, i * 150);
                            }

                            // 等待烟花动画完成后进入下一关
                            setTimeout(() => {
                                fireworksContainer.remove();
                                
                                if (this.level === 5) {
                                    alert('恭喜你通关了所有关卡！游戏结束！');
                                    this.level = 1;
                                } else {
                                    alert(`恭喜通关！即将进入第 ${nextLevel} 关`);
                                    this.level = nextLevel;
                                }
                                
                                // 更新关卡显示和重置游戏状态
                                this.updateLevelDisplay();
                                this.hintCount = 3;
                                this.shuffleCount = 3;
                                this.updateButtonCounts();
                                this.gameIcons = this.generatePairs();
                                this.createGrid();
                            }, 2000);
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
        
        // 获取木框（grid）的位置信息
        const gridRect = this.grid.getBoundingClientRect();
        
        // 获取所有未消除的方块
        const activeItems = Array.from(this.grid.children)
            .filter(item => !item.classList.contains('matched'));
        
        // 获取所有活跃方块的当前位置（相对于木框）
        const positions = activeItems.map(item => {
            const rect = item.getBoundingClientRect();
            return {
                left: rect.left - gridRect.left,
                top: rect.top - gridRect.top,
                width: rect.width,
                height: rect.height
            };
        });
        
        // 随机打乱顺序
        const shuffledItems = this.shuffleArray([...activeItems]);
        
        // 为所有活跃方块添加相对定位
        activeItems.forEach((item, i) => {
            const pos = positions[i];
            item.style.position = 'absolute';
            item.style.left = `${pos.left}px`;
            item.style.top = `${pos.top}px`;
            item.style.width = `${pos.width}px`;
            item.style.height = `${pos.height}px`;
            item.style.transition = 'none';
            item.style.zIndex = '1';
        });
        
        // 强制重排
        void this.grid.offsetHeight;
        
        // 添加过渡效果
        activeItems.forEach(item => {
            item.style.transition = 'all 0.3s ease';
        });
        
        // 将方块移动到新位置
        setTimeout(() => {
            shuffledItems.forEach((item, i) => {
                const newPos = positions[i];
                item.style.left = `${newPos.left}px`;
                item.style.top = `${newPos.top}px`;
            });
        }, 50);
        
        // 动画完成后恢复正常布局
        setTimeout(() => {
            // 移除过渡动画和临时样式
            activeItems.forEach(item => {
                item.style.transition = '';
                item.style.position = '';
                item.style.left = '';
                item.style.top = '';
                item.style.width = '';
                item.style.height = '';
                item.style.zIndex = '';
            });
            
            // 重新排列DOM顺序
            shuffledItems.forEach(item => {
                this.grid.appendChild(item);
            });
        }, 350); // 动画时间缩短到0.3秒
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
            
            // 显示过关动画，然后直接进入下一关
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

    // 在消除方块的方法中加完成检查
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
        const fireworkCount = 15; // 增加烟花数量
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