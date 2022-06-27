class KMoveComponentObject extends KComponent{
    constructor(parent,id){
        super(parent,id)
        if (parent instanceof KActorObject){
            this.isLeft=0;
            this.isRight=0;
            this.isJump=0;
            this.couldJump=1;
            this.leftSpeed=1;
            this.rightSpeed=1;
            this.jumpSpeed=5;
        }
    }

    start(){
        super.start()
    }

    tick(delta){
        super.tick(delta);
        if (!this.parent instanceof KActorObject) return;
        if(this.isLeft){
            if(this.parent.xSpeed>(-this.leftSpeed)){
                this.parent.xSpeed-=this.leftSpeed;
            }
        }
        if(this.isRight){
            if(this.parent.xSpeed<(this.rightSpeed)){
                this.parent.xSpeed+=this.rightSpeed;
            }
        }
        if(!this.isLeft&&!this.isRight){
            this.parent.xSpeed=this.parent.xSpeed/2;
            if(Math.abs(this.parent.xSpeed)<1) this.parent.xSpeed=0;
        }
        if(this.isJump&&this.couldJump){
            this.parent.ySpeed-=this.jumpSpeed;
            this.isJump=false;
        }
    }

    destroy(){
        super.destroy();
    }

    beginLeft(){
        this.isLeft=true;
    }

    endLeft(){
        this.isLeft=false;
    }
    beginRight(){
        this.isRight=true;
    }

    endRight(){
        this.isRight=false;
    }

    jump(){
        this.isJump=true;
    }
}