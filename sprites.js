class SpriteSheet {
    constructor(imagePath, spriteWidth, spriteHeight) {
        this.image = new Image();
        this.image.src = imagePath;
        this.spriteWidth = spriteWidth;
        this.spriteHeight = spriteHeight;
    }

    getSprite(row, col) {
        const canvas = document.createElement('canvas');
        canvas.width = this.spriteWidth;
        canvas.height = this.spriteHeight;
        const ctx = canvas.getContext('2d');
        
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(
            this.image,
            col * this.spriteWidth,
            row * this.spriteHeight,
            this.spriteWidth,
            this.spriteHeight,
            0,
            0,
            this.spriteWidth,
            this.spriteHeight
        );
        
        return canvas.toDataURL();
    }
}

const foodSheet = new SpriteSheet('assets/images/neko-cafe-food.png', 16, 16);
const furnitureSheet = new SpriteSheet('assets/images/neko-cafe-furnitures.png', 16, 16);

function createCatElement(imagePath, x, y, scale = 3) {
    const cat = document.createElement('img');
    cat.src = imagePath;
    cat.className = 'cafe-cat';
    cat.style.left = x + 'px';
    cat.style.top = y + 'px';
    cat.style.width = (16 * scale) + 'px';
    cat.style.height = (16 * scale) + 'px';
    return cat;
}

function createFoodElement(row, col, x, y, scale = 2) {
    const food = document.createElement('img');
    food.src = foodSheet.getSprite(row, col);
    food.className = 'cafe-decoration';
    food.style.left = x + 'px';
    food.style.top = y + 'px';
    food.style.width = (16 * scale) + 'px';
    food.style.height = (16 * scale) + 'px';
    return food;
}