// TODO
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
        this.renderable.addAnimation("smallWalk", [144, 145, 146, 147, 148, 149], 80);
       
        this.renderable.setCurrentAnimation("idle");
        
        this.body.setVelocity(30, 30);              
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
    },
    
    update: function(delta){
        if(me.input.isKeyPressed("right")){
            this.flipX(false);
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
        
        
        if (this.body.vel.x !== 0) {
            if (!this.renderable.isCurrentAnimation("smallWalk")) {
                this.renderable.setCurrentAnimation("smallWalk");
                this.renderable.setAnimationFrame();
            }
        } else {
            this.renderable.setCurrentAnimation("idle");
            
        }
        
        

        
        this._super(me.Entity, "update", [delta]);
        return true;
    },
    
    collideHandler: function(response){
        
    }
    
});

game.LevelTrigger = me.Entity.extend({
   init: function(x,y, settings){
       this._super(me.Entity, 'init', [x, y, settings]);
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
   
   gameOver: function(){
       me.state.change(me.state.GameOver);
   }
   
});