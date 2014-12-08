//drawing mario
game.PlayerEntity = me.Entity.extend({
    init: function(x, y, settings) {
        this._super(me.Entity, 'init', [x, y, {
                image: "mario",
                spritewidth: "128",
                spirteheight: "128",
                width: 128,
                height: 128,
                getShape: function() {
                    return (new me.Rect(0, 0, 64, 128)).toPolygon();
                }
            }]);

        this.renderable.addAnimation("idle", [13]);
        this.renderable.addAnimation("bigidle", [0]);
        this.renderable.addAnimation("superidle", [43]);
        this.renderable.addAnimation("fireidle", [37]);
        
        //createes an animation for the caractter walking without powerups called smallwalk
        //adds an array of values which are the pictures for the animation
        ///80 represents the amout of milliseconds for changing images
        this.renderable.addAnimation("smallWalk", [8, 9, 10, 11, 12], 80);
        this.renderable.addAnimation("bigWalk", [14, 15, 16, 17, 18], 80);
        this.renderable.addAnimation("shrink", [0, 1, 2, 3], 80);
        this.renderable.addAnimation("grow", [4, 5, 6, 7], 80);
        this.renderable.addAnimation("superWalk", [39, 40, 41, 42], 80);
        this.renderable.addAnimation("fireWalk", [32, 33, 34, 35, 36], 80);


        this.renderable.setCurrentAnimation("idle");

        //sets a variable for whether we have eaten the mushroom
        this.big = false;
        //sets a variable for whether we have eaten the star
        this.super = false;
        this.fire = false;

        //the first number sets the speed mario moves on x axis, the second sets the speen on the y axis
        this.body.setVelocity(5, 20);

        

        //makes the screen(viewport) follow mario's position (pos) on both x and y axis
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
    },
    update: function(delta) {
        if (this.pos.y >= 600) {
            me.state.change(me.state.GAMEOVER);
        }
        //checks if the right key is pushed down
        if (me.input.isKeyPressed("right")) {
            //resets the image if it has been flipped so it is back to normal
            this.flipX(false);
            //adds value to mario's x position based on the x vaule from setVelocity above
            //me.timer.tick smooths the animation for irregular updates
            this.body.vel.x += this.body.accel.x * me.timer.tick;
        }
        else if (me.input.isKeyPressed("left")) {
            this.flipX(true);
            this.body.vel.x -= this.body.accel.x * me.timer.tick;
        }
        else {
            this.body.vel.x = 0;
        }
        //enables mario to jump
        if (me.input.isKeyPressed("jump")) {
            if (!this.body.jumping && !this.body.falling) {
                this.body.vel.y -= this.body.maxVel.y * me.timer.tick;
                this.body.jumping = true;
            }
        }

        this.body.update(delta);
        me.collision.check(this, true, this.collideHandler.bind(this), true);

        //set animation for each status. First one is for small mario, second one is for big mario, and last one is for super mario.
        if (!this.big && !this.super && !this.fire) {
            if (this.body.vel.x !== 0) {
                if (!this.renderable.isCurrentAnimation("smallWalk") && !this.renderable.isCurrentAnimation("grow") && !this.renderable.isCurrentAnimation("shrink")) {
                    this.renderable.setCurrentAnimation("smallWalk");
                    this.renderable.setAnimationFrame();
                }
            } else {
                this.renderable.setCurrentAnimation("idle");

            }
        } else if (this.big) {
            if (this.body.vel.x !== 0) {
                if (!this.renderable.isCurrentAnimation("bigWalk") && !this.renderable.isCurrentAnimation("grow") && !this.renderable.isCurrentAnimation("shrink")) {
                    this.renderable.setCurrentAnimation("bigWalk");
                    this.renderable.setAnimationFrame();
                }
            } else {
                this.renderable.setCurrentAnimation("bigidle");

            }
        } else if (this.super) {
            if (this.body.vel.x !== 0) {
                if (!this.renderable.isCurrentAnimation("superWalk") && !this.renderable.isCurrentAnimation("grow") && !this.renderable.isCurrentAnimation("shrink")) {
                    this.renderable.setCurrentAnimation("superWalk");
                    this.renderable.setAnimationFrame();
                }
            } else {
                this.renderable.setCurrentAnimation("superidle");

            }

        }
        else if (this.fire) {
            if (this.body.vel.x !== 0) {
                if (!this.renderable.isCurrentAnimation("fireWalk") && !this.renderable.isCurrentAnimation("grow") && !this.renderable.isCurrentAnimation("shrink")) {
                    this.renderable.setCurrentAnimation("fireWalk");
                    this.renderable.setAnimationFrame();
                }
            } else {
                this.renderable.setCurrentAnimation("fireidle");

            }

        }

        this._super(me.Entity, "update", [delta]);
        return true;
    },
    collideHandler: function(response) {
        var ydif = this.pos.y - response.b.pos.y;

        //check collision with badguy. If mario jumps on it, it wiil be gone
        if (response.b.type === 'badguy') {
            if (ydif <= -83) {
                response.b.alive = false;
            }
            //if mario ate star, badguy would be immediately gone
            else if (this.super) {
                response.b.alive = false;
            }
            //if it is big mario, he will shrink and become small mario
            else if (response.b.alive && !this.super) {
                if (this.big) {
                    this.big = false;
                    this.body.vel.y -= this.body.accel.y * me.timer.tick;
                    this.jumping = true;
                    this.renderable.setCurrentAnimation("shrink", "idle");
                    this.renderable.setAnimationFrame();
                }
                //if small hits with badguy, gameover screen will appear
                else {
                    me.state.change(me.state.GAMEOVER);
                }
            }
            //check collision with mushroom and star
        } else if (response.b.type === 'mushroom') {
            this.renderable.setCurrentAnimation("grow", "bigIdle");
            this.big = true;
            me.game.world.removeChild(response.b);
        }
        else if (response.b.type === 'star') {
            this.renderable.setCurrentAnimation("superidle");
            this.super = true;

            me.game.world.removeChild(response.b);
        }
        else if (response.b.type === 'flower') {
            this.renderable.setCurrentAnimation("fireidle");
            this.fire = true;

            me.game.world.removeChild(response.b);
        }
    }

});

game.LevelTrigger = me.Entity.extend({
    init: function(x, y, settings) {
        this._super(me.Entity, 'init', [x, y, settings]);
        //sets what happens when this body collides with something to a function called onCollision and passes this level trigger as a hidden parameter
        this.body.onCollision = this.onCollision.bind(this);
        this.level = settings.level;
        this.xSpawn = settings.xSpawn;
        this.ySpawn = settings.ySpawn;
    },
    onCollision: function() {
        this.body.setCollisionMask(me.collision.types.NO_OBJECT);
        me.levelDirector.loadLevel(this.level);
        me.state.current().resetPlayer(this.xSpawn, this.ySpawn);

    },
});

//drawing badguy
game.BadGuy = me.Entity.extend({
    init: function(x, y, settings) {
        this._super(me.Entity, 'init', [x, y, {
                image: "slime",
                spritewidth: "64",
                spriteheight: "64",
                width: 64,
                height: 64,
                getShape: function() {
                    return (new me.Rect(0, 0, 64, 64)).toPolygon();
                }
            }]);
//making badguy walk from starX to endX
        this.spritewidth = 64;
        var width = settings.width;
        x = this.pos.x;
        this.startX = x;
        this.endX = x + width - this.spritewidth;
        this.pos.x = x + width - this.spritewidth;
        this.updateBounds();

        this.alwaysUpdate = true;

        this.walkLeft = false;
        this.alive = true;
        this.type = "badguy";
//animation for skeleton
        this.renderable.addAnimation("run", [144, 145, 146], 80);
        this.renderable.setCurrentAnimation("run");

        this.body.setVelocity(3, 6);
    },
    //enabling skeleton to move left and right
    update: function(delta) {
        this.body.update(delta);
        me.collision.check(this, true, this.collideHandler.bind(this), true);

        if (this.alive) {
            if (this.walkLeft && this.pos.x <= this.startX) {
                this.walkLeft = false;
            } else if (!this.walkLeft && this.pos.x >= this.endX) {
                this.walkLeft = true;
            }
            this.flipX(this.walkLeft);
            this.body.vel.x += (this.walkLeft) ? -this.body.accel.x * me.timer.tick : this.body.accel.x * me.timer.tick;
        } else {
            me.game.world.removeChild(this);
        }

        this._super(me.Entity, "update", [delta]);
        return true;
    },
    collideHandler: function() {

    }

});
//making a mushroom
game.Mushroom = me.Entity.extend({
    init: function(x, y, settings) {
        this._super(me.Entity, 'init', [x, y, {
                image: "mushroom",
                spritewidth: "64",
                spriteheight: "64",
                width: 64,
                height: 64,
                getShape: function() {
                    return (new me.Rect(0, 0, 64, 64)).toPolygon();
                }
            }]);

        me.collision.check(this);
        this.type = "mushroom";
    }

});

//making a star
game.Star = me.Entity.extend({
    init: function(x, y, settings) {
        this._super(me.Entity, 'init', [x, y, {
                image: "star",
                spritewidth: "64",
                spriteheight: "64",
                width: 64,
                height: 64,
                getShape: function() {
                    return (new me.Rect(0, 0, 64, 64)).toPolygon();
                }
            }]);

        me.collision.check(this);
        this.type = "star";
    }

});

//making a flower
game.Flower = me.Entity.extend({
    init: function(x, y, settings) {
        this._super(me.Entity, 'init', [x, y, {
                image: "flower",
                spritewidth: "64",
                spriteheight: "64",
                width: 64,
                height: 64,
                getShape: function() {
                    return (new me.Rect(0, 0, 64, 64)).toPolygon();
                }
            }]);

        me.collision.check(this);
        this.type = "flower";
    }

});