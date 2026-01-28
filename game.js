const gameState = {
    coins: 0,
    coinsPerSecond: 0,
    clickPower: 1,
    spawnedCats: [],
    upgrades: [
        {
            id: 'black-cat',
            name: 'Black Cat Server',
            baseCost: 10,
            cost: 10,
            cps: 0.5,
            owned: 0,
            description: 'A helpful black cat serves customers',
            sprite: 'assets/images/cat-black-front.png'
        },
        {
            id: 'orange-cat',
            name: 'Orange Cat Barista',
            baseCost: 50,
            cost: 50,
            cps: 2,
            owned: 0,
            description: 'An energetic orange cat makes drinks',
            sprite: 'assets/images/cat-orange-front.png'
        },
        {
            id: 'cat-chef',
            name: 'Cat Chef',
            baseCost: 200,
            cost: 200,
            cps: 8,
            owned: 0,
            description: 'A skilled cat prepares pastries',
            sprite: 'assets/images/cat-waiter-front.png'
        },
        {
            id: 'furniture',
            name: 'Cozy Furniture',
            baseCost: 500,
            cost: 500,
            cps: 20,
            owned: 0,
            description: 'Comfortable seating attracts more customers'
        },
        {
            id: 'premium-food',
            name: 'Premium Menu',
            baseCost: 1500,
            cost: 1500,
            cps: 60,
            owned: 0,
            description: 'Delicious treats keep customers coming back'
        }
    ]
};

function updateDisplay() {
    document.getElementById('coins').textContent = Math.floor(gameState.coins);
    document.getElementById('coinsPerSec').textContent = gameState.coinsPerSecond.toFixed(1);
}

function calculateCoinsPerSecond() {
    let total = 0;
    gameState.upgrades.forEach(upgrade => {
        total += upgrade.cps * upgrade.owned;
    });
    gameState.coinsPerSecond = total;
}

function spawnCat(upgrade) {
    const cafeRoom = document.getElementById('cafeRoom');
    
    const positions = [
        {x: 80, y: 320},
        {x: 200, y: 250},
        {x: 350, y: 350},
        {x: 480, y: 280},
        {x: 150, y: 450},
        {x: 400, y: 480},
        {x: 250, y: 180},
        {x: 520, y: 420}
    ];
    
    const availablePositions = positions.filter(pos => {
        return !gameState.spawnedCats.some(cat => {
            const catX = parseInt(cat.style.left);
            const catY = parseInt(cat.style.top);
            return Math.abs(catX - pos.x) < 60 && Math.abs(catY - pos.y) < 60;
        });
    });
    
    if (availablePositions.length === 0) {
        const x = 100 + Math.random() * 440;
        const y = 150 + Math.random() * 440;
        availablePositions.push({x, y});
    }
    
    const position = availablePositions[Math.floor(Math.random() * availablePositions.length)];
    
    const cat = createCatElement(upgrade.sprite, position.x, position.y);
    cafeRoom.appendChild(cat);
    gameState.spawnedCats.push(cat);
    
    setTimeout(() => {
        cat.style.opacity = '1';
    }, 50);
}

function spawnFood() {
    const cafeRoom = document.getElementById('cafeRoom');
    
    const tablePositions = [
        {x: 100, y: 220},
        {x: 260, y: 220},
        {x: 420, y: 220},
        {x: 580, y: 220},
        {x: 100, y: 520},
        {x: 260, y: 520},
        {x: 420, y: 520},
        {x: 580, y: 520}
    ];
    
    const position = tablePositions[Math.floor(Math.random() * tablePositions.length)];
    
    const randomRow = Math.floor(Math.random() * 3);
    const randomCol = Math.floor(Math.random() * 3);
    
    const food = createFoodElement(randomRow, randomCol, position.x, position.y, 2.5);
    cafeRoom.appendChild(food);
    
    setTimeout(() => {
        food.style.opacity = '1';
    }, 50);
}

function handleClick() {
    gameState.coins += gameState.clickPower;
    updateDisplay();
    
    const clickButton = document.getElementById('clickButton');
    clickButton.style.background = 'rgba(255,255,255,0.2)';
    setTimeout(() => {
        clickButton.style.background = '';
    }, 100);
}

function buyUpgrade(upgradeId) {
    const upgrade = gameState.upgrades.find(u => u.id === upgradeId);
    
    if (gameState.coins >= upgrade.cost) {
        gameState.coins -= upgrade.cost;
        upgrade.owned++;
        upgrade.cost = Math.floor(upgrade.baseCost * Math.pow(1.15, upgrade.owned));
        
        if (upgrade.sprite) {
            spawnCat(upgrade);
        }
        
        if (upgrade.id === 'premium-food' && upgrade.owned % 2 === 1) {
            spawnFood();
        }
        
        calculateCoinsPerSecond();
        updateDisplay();
        renderShop();
    }
}

function renderShop() {
    const shopContainer = document.getElementById('shopItems');
    shopContainer.innerHTML = '';
    
    gameState.upgrades.forEach(upgrade => {
        const canAfford = gameState.coins >= upgrade.cost;
        const itemDiv = document.createElement('div');
        itemDiv.className = 'shop-item';
        
        if (!canAfford) {
            itemDiv.classList.add('disabled');
        }
        
        itemDiv.innerHTML = `
            <div class="shop-item-header">
                <span class="shop-item-name">${upgrade.name}</span>
                <span class="shop-item-cost">${upgrade.cost} 🪙</span>
            </div>
            <div class="shop-item-info">${upgrade.description}</div>
            <div class="shop-item-info">+${upgrade.cps} coins/sec</div>
            <div class="shop-item-owned">Owned: ${upgrade.owned}</div>
        `;
        
        itemDiv.addEventListener('click', () => {
            if (gameState.coins >= upgrade.cost) {
                buyUpgrade(upgrade.id);
            }
        });
        
        shopContainer.appendChild(itemDiv);
    });
}

function gameLoop() {
    gameState.coins += gameState.coinsPerSecond / 10;
    updateDisplay();
}

function init() {
    document.getElementById('clickButton').addEventListener('click', handleClick);
    renderShop();
    updateDisplay();
    setInterval(gameLoop, 100);
}

init();