//AREA SETUP (MOST SIMPLE TYPE)
class Area {
    constructor(x,y,w,h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
    
}

//ENTITIES SETUP
class Entity extends Area {
    constructor(x,y,w,h,sprite) {
        super(x,y,w,h);
        this.sprite = new Image();
        this.sprite.src = sprite;
    }
    draw() {
        ctx.fillStyle = "red";
        ctx.fillRect(this.x,this.y,this.w,this.h); //x and y at centers of objs
    }
    update() {
        this.draw();
    }
}

//ENEMIES SETUP
class Enemy extends Entity {
    constructor(x,y,w,h,sprite,spd,dmg) {
        super(x,y,w,h,sprite);
        this.spd = spd;
        this.dmg = dmg;
        this.removeMark = false;
    }
    updatePos() {
        this.x -= this.spd;
    }
    update() {
        this.updatePos();
        this.draw();
        if (this.x < -this.w) {
            this.removeMark = true;
        }
        if (player.smashing) {
            if (testcollisionrect(this,player,true)) {
                this.removeMark = true;
                score ++;
                console.log(score);
            }
        } else if (testcollisionrect(this,player)) {
            player.hp -= this.dmg;
            this.removeMark = true;
        }
    }
}

//PLAYER SETUP
class Player extends Entity {
    constructor(x,y,w,h,sprite0,sprite1,sprite2,sprite3,spd) {
        super(x,y,w,h);
        this.sprites = [new Image(), new Image(), new Image(), new Image()];
        this.sprites[0].src = sprite0;
        this.sprites[1].src = sprite1;
        this.sprites[2].src = sprite2;
        this.sprites[3].src = sprite3;
        this.spd = spd;
        this.hp = 20;
        this.atkcool = 40;
        this.walkid = 1;
        this.walkcycle = 10;
        this.smashing = false;
    }
    updatePos() {
        if (!this.smashing) {
            if (wpress && this.y > 0) {
                this.y -= this.spd;
            }
            if (apress && this.x > 0) {
                this.x -= this.spd;
            }
            if (spress && this.y + this.h < 500) {
                this.y += this.spd;
            }
            if (dpress && this.x + this.w < 1000) {
                this.x += this.spd;
            }
        }
    }
    draw() {
        if (this.smashing) {
            if (this.walkid === 1) {
                ctx.drawImage(this.sprites[2],this.x,this.y,this.w,this.h);
            } else {
                ctx.drawImage(this.sprites[3],this.x,this.y,this.w,this.h);
            }
        } else {
            if (this.walkid === 1) {
                ctx.drawImage(this.sprites[0],this.x,this.y,this.w,this.h);
            } else {
                ctx.drawImage(this.sprites[1],this.x,this.y,this.w,this.h);
            }
        }
    }
    attack() {
        if (spacepress && this.atkcool >= 40) {
            this.smashing = true;
            this.walkid = 1;
            this.walkcycle = 5;
            this.atkcool = 0;
        }
    }
    spriteAnim() {
        if (this.walkcycle === 0) {
            if (this.walkid === 1) {
                this.walkid = 2;
            } else {
                this.walkid = 1;
            }
            this.walkcycle = 10;
        }
        this.walkcycle --;
    }
    update() {
        this.updatePos();
        this.spriteAnim();
        this.attack();
        this.draw();
        if (this.atkcool < 40) {
            this.atkcool++;
        }
        if (this.atkcool >= 20) {
            this.smashing = false;
        }
    }
}