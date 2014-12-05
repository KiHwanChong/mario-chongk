//drawing mario
game.PlayerEntity = me.Entity.extend({
    init: function(x, y, settings){
        this._super(me.Entity, 'init', [x, y, {
        image: "mario",
        spritewidth: "64",
        spirteheight: "64",
        width: 64,
        height: 64,
        getShape: function(){
            return (new me.Rect(0, 0, 30, 64)).toPolygon();
        }        
    }]);
        
        this.renderable.addAnimation("idle", [39]);
        this.renderable.addAnimation("bigidle", [40]);
        //createes an animation for the caractter walking without powerups called smallwalk
        //adds an array of values which are the pictures for the animation
        ///80 represents the amout of milliseconds for changing images
        this.renderable.addAnimation("smallWalk", [144, 145, 146, 147, 148, 149], 80);
        this.renderable.addAnimation("bigWalk", [150, 151, 152, 153], 80);
        this.renderable.addAnimation("shrink", [0, 1, 2, 3], 80);
        this.renderable.addAnimation("grow", [4, 5, 6, 7], 80)
       
        this.renderable.setCurrentAnimation("idle");
        
        //sets a variable for whetther we have eaten the mushroom
        this.big = false;
        
        //the first number sets the speed mario moves on x axis, the second sets the speen on the y axis
        this.body.setVelocity(5, 20);
        
        //makes the screen(viewport) follow mario's position (pos) on both x and y axis
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
    },
    
    update: function(delta){
        //checks if the right key is pushed down
        if(me.input.isKeyPressed("right")){
            //resets the image if it has been flipped so it is back to normal
            this.flipX(false);
            //adds value to mario's x position based on the x vaule from setVelocity above
            //me.timer.tick smooths the animation for irregular updates
            this.body.vel.x += this.body.accel.x * me.timer.tick;}                     
        else if(me.input.isKeyPressed("left")){
            this.flipX(true);
            this.body.vel.x -= this.body.accel.x * me.timer.tick;}
        else{
            this.body.vel.x = 0;
        }
            
        if (me.input.isKeyPressed("jump")) {
            if (!this.body.jumping && !this.body.falling) {
                this.body.vel.y -= this.body.maxVel.y * me.timer.tick;               
                this.body.jumping = true;
            }}
 
        this.body.update(delta);
        me.collision.check(this, true, this.collideHandler.bind(this), true);
        
        
        if (!this.big) {
            if (this.body.vel.x !== 0) {
                if (!this.renderable.isCurrentAnimation("smallWalk") && !this.renderable.isCurrentAnimation("grow") && !this.renderable.isCurrentAnimation("shrink"))  {
                    this.renderable.setCurrentAnimation("smallWalk");
                    this.renderable.setAnimationFrame();
                }
            } else {
                this.renderable.setCurrentAnimation("idle");

            }
        }else{
             if (this.body.vel.x !== 0) {
                if (!this.renderable.isCurrentAnimation("bigWalk") && !this.renderable.isCurrentAnimation("grow") && !this.renderable.isCurrentAnimation("shrink")) {
                    this.renderable.setCurrentAnimation("bigWalk");
                    this.renderable.setAnimationFrame();
                }
            } else {
                this.renderable.setCurrentAnimation("bigidle");

            } 
            
        }
        
        this._super(me.Entity, "update", [delta]);
        return true;
    },
    
    collideHandler: function(response){
        var ydif = this.pos.y - response.b.pos.y;
        console.log (ydif);

        if (response.b.type === 'badguy') {
            if (ydif <= -47) {
                response.b.alive = false;
            } else if(response.b.alive) {
                if(this.big){
                    this.big = false;
                    this.body.vel.y -= this.body.accel.y * me.timer.tick;
                    this.jumping = true;
                    this.renderable.setCurrentAnimation("shrink", "idle");
                    this.renderable.setAnimationFrame();
                } else {
                    me.state.change(me.state.GAMEOVER);
                }
            }

        } else if (response.b.type === 'mushroom') {
            this.renderable.setCurrentAnimation("grow", "bigIdle");
            this.big = true;
            me.game.world.removeChild(response.b);
        }
        
        if (this.pos.y <= -50) {
            me.state.change(me.state.GAMEOVER);
        }
    }
    
});

game.LevelTrigger = me.Entity.extend({
   init: function(x,y, settings){
       this._super(me.Entity, 'init', [x, y, settings]);
       //sets what happens when this body collides with something to a function called onCollision and passes this level trigger as a hidden parameter
       this.body.onCollision = this.onCollision.bind(this);
       this.level = settings.level;
       this.xSpawn = settings.xSpawn;
       this.ySpawn = settings.ySpawn;
   },
   
   onCollision: function(){
       this.body.setCollisionMask(me.collision.types.NO_OBJECT);     
       me.levelDirector.loadLevel(this.level);
       me.state.current().resetPlayer(this.xSpawn, this.ySpawn);
       
   },
});

game.BadGuy = me.Entity.extend({
    init: function(x, y, settings) {
        this._super(me.Entity, 'init', [x, y, {
                image: "slime",
                spritewidth: "60",
                spriteheight: "28",
                width: 60,
                height: 28,
                getShape: function() {
                    return (new me.Rect(0, 0, 60, 28)).toPolygon();
                }
            }]);

        this.spritewidth = 60;
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
//    
//    this.renderable.addAnimation("run", [0, 1, 2], 80);
//    this.renderable.setCurrentAnimation("run");
    
    this.body.setVelocity(4,6);
   },
   
    update: function(delta){
        this.body.update(delta);        
        me.collision.check(this, true, this.collideHandler.bind(this), true);
    
        if (this.alive) {
            if (this.walkLeft && this.pos.x <= this.startX) {
                this.walkLeft = false;
            } else if (!this.walkLeft && this.pos.x >= this.endX) {
                this.walkLeft = true;
            }
            this.flipX(!this.walkLeft);
            this.body.vel.x += (this.walkLeft) ? -this.body.accel.x * me.timer.tick : this.body.accel.x * me.timer.tick;
        } else {
            me.game.world.removeChild(this);
        }

        this._super(me.Entity, "update", [delta]);
        return true;
        },
    
    collideHandler: function(){
        
    }
    
});

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
