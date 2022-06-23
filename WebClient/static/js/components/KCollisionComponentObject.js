class KCollisionComponentObject extends KComponent{
    constructor(parent){
        super(parent);
        if(parent instanceof KActorObject){
            this.triangleSet=[];
        }
    }
    addTriangle(t){
        this.triangleSet.push(t);
        KCollisionComponentObject.allTriangle.push(t);
        KCollisionComponentObject.allTriangleParent.push(this.parent);
    }

    // isCollsionX(){
    //     if(this.parent instanceof KActorObject){
    //         for(let me of this.triangleSet){
    //             for(let mep of me){
    //                 let nxtp={
    //                     x:mep.x+this.parent.xSpeed+this.parent.x,
    //                     y:mep.y+this.parent.y
    //                 }
    //                 for(let othert of KCollisionComponentObject.allTriangle){
    //                     if(PointUtil.pointInTriangle(othert,nxtp)){
    //                         return true;
    //                     }
    //                 }
    //             }
    //         }
    //         return false
    //     }
    // }

    // isCollsionY(){
    //     if(this.parent instanceof KActorObject){
    //         for(let me of this.triangleSet){
    //             for(let mep of me){
    //                 let nxtp={
    //                     x:mep.x+this.parent.x,
    //                     y:mep.y+this.parent.ySpeed+this.parent.y
    //                 }
    //                 for(let othert of KCollisionComponentObject.allTriangle){
    //                     if(PointUtil.pointInTriangle(othert,nxtp)){
    //                         return true;
    //                     }
    //                 }
    //             }
    //         }
    //         return false
    //     }
    // }

    isCollsion(){
        if(this.parent instanceof KActorObject){
            for(let me of this.triangleSet){
                for(let mep of me){
                    let nxtp={
                        x:mep.x+this.parent.xSpeed+this.parent.x,
                        y:mep.y+this.parent.ySpeed+this.parent.y
                    }
                    for(let i=0;i<KCollisionComponentObject.allTriangle.length;i++){
                        let othert = JSON.parse(JSON.stringify(KCollisionComponentObject.allTriangle[i]));
                        if(this.parent === KCollisionComponentObject.allTriangleParent[i]) continue;
                        othert[0].x+=KCollisionComponentObject.allTriangleParent[i].x;
                        othert[1].x+=KCollisionComponentObject.allTriangleParent[i].x;
                        othert[2].x+=KCollisionComponentObject.allTriangleParent[i].x;
                        othert[0].y+=KCollisionComponentObject.allTriangleParent[i].y;
                        othert[1].y+=KCollisionComponentObject.allTriangleParent[i].y;
                        othert[2].y+=KCollisionComponentObject.allTriangleParent[i].y;
                        //console.log(this.triangleSet.indexOf(othert))
                        if(PointUtil.lineCross(nxtp.x,nxtp.y,mep.x,mep.y,othert[0].x,othert[0].y,othert[1].x,othert[1].y)){
                            this.renderTriangle(othert);
                            this.renderTriangle(me);
                            return true;
                        }
                        if(PointUtil.lineCross(nxtp.x,nxtp.y,mep.x,mep.y,othert[1].x,othert[1].y,othert[2].x,othert[2].y)){
                            this.renderTriangle(othert);
                            this.renderTriangle(me);
                            return true;
                        }
                        if(PointUtil.lineCross(nxtp.x,nxtp.y,mep.x,mep.y,othert[0].x,othert[0].y,othert[2].x,othert[2].y)){
                            this.renderTriangle(othert);
                            this.renderTriangle(me);
                            return true;
                        }
                    }
                }
            }
            return false
        }
    }

    start(){
        super.start();
    }

    tick(delta){
        super.tick(delta);
        if(this.isCollsion()){
            this.parent.xSpeed=0;
            this.parent.ySpeed=0;
        }
        if(this.debugRender) this.render();
    }

    debugRenderOpen(){
        this.debugRender=true;
    }

    debugRenderOff(){
        this.debugRender=false;
    }

    render(){
        var ctx=this.parent.ctx;
        if(this.parent.ctx){
            for(let t of this.triangleSet){
                ctx.fillStyle = 'red';
                ctx.beginPath();
                ctx.moveTo(t[0].x+this.parent.x,t[0].y+this.parent.y);
                ctx.lineTo(t[1].x+this.parent.x,t[1].y+this.parent.y);
                ctx.lineTo(t[2].x+this.parent.x,t[2].y+this.parent.y);
                ctx.fill();
                ctx.closePath();
            }
            
        }

    }

    renderTriangle(t){
        var ctx=this.parent.ctx;
        if(this.parent.ctx){
                ctx.fillStyle = 'blue';
                ctx.beginPath();
                ctx.moveTo(t[0].x+this.parent.x,t[0].y+this.parent.y);
                ctx.lineTo(t[1].x+this.parent.x,t[1].y+this.parent.y);
                ctx.lineTo(t[2].x+this.parent.x,t[2].y+this.parent.y);
                ctx.fill();
                ctx.closePath();
        }
    }

    destroy(){
        super.destroy()
    }
}
KCollisionComponentObject.allTriangle=[];
KCollisionComponentObject.allTriangleParent=[];



//Lawson
class PointUtil{
    static crossMultiply(A,B){
        return A.x*B.y-A.y*B.x;
    }

    static vectorSubstract(A,B){
        return {
            x:B.x-A.x,
            y:B.y-A.y
        }
    }
    static pointInTriangle(triangle,p){
        var pA=PointUtil.vectorSubstract(p,triangle[0]);
        var pB=PointUtil.vectorSubstract(p,triangle[1]);
        var pC=PointUtil.vectorSubstract(p,triangle[2]);
        if(PointUtil.crossMultiply(pA,pB)>0&&PointUtil.crossMultiply(pA,pC)>0&&PointUtil.crossMultiply(pB,pC)>0){
            return true;
        }
        return false;
    }

    static makePoint(x,y){
        return {
            x:x,
            y:y
        }
    }

    static makeTriangle(a,b,c){
        return [a,b,c]
    }
    
    static triangleCircle(t){
        let x1,x2,x3,y1,y2,y3;
        x1=t[0].x;
        x2=t[1].x;
        x3=t[2].x;
        y1=t[0].y;
        y2=t[1].y;
        y3=t[2].y;
        let A1=2*(x2-x1);
        let B1=2*(y2-y1);
        let C1=x2*x2+y2*y2-x1*x1-y1*y1;
        let A2=2*(x3-x2);
        let B2=2*(y3-y2);
        let C2=x3*x3+y3*y3-x2*x2-y2*y2;
        let x=((B2*C1)-(B1*C2))/((B2*A1)-(B1*A2));
        let Y=(-(A2*C1)+(A1*C2))/((B2*A1)-(B1*A2));
        return this.makePoint(x,y);
    }

    static getDis(p1,p2){
        let sum=(p1.x-p2.x)*(p1.x-p2.x)+(p1.y-p2.y)*(p1.y-p2.y);
        return Math.sqrt(sum);
    }

    static triangleCircleR(t){
        let a = PointUtil.getDis(t[0].t[1]);
        let b = PointUtil.getDis(t[1].t[2]);
        let c = PointUtil.getDis(t[0].t[2]);
        let p = (a+b+c)/2;
        return a*b*c/(4*Math.sqrt(p*(p-a)*(p-b)*(p-c)));
    }

    static inCircle(p,cp,cr){
        if(PointUtil.getDis(p,cp)<=r){
            return true;
        }
        return false;
    }

    static adjustTriangle(t1,t2){
        let adjust = function(ps1,ps2){
            let ans1=PointUtil.makeTriangle(ps2[0],ps2[1],ps1[0]);
            let ans2=PointUtil.makeTriangle(ps2[0],ps2[1],ps1[1]);
            return [ans1,ans2];
        };
        let cnt=0;
        let ps1=[];
        let ps2=[];
        for(let i of t1){
            for(let j of t2){
                if(i.x==j.x&&i.y==j.y){
                    cnt++;
                    ps1.push(i);
                }else{
                    ps2.push(i);
                    ps2.push(j);
                }
            }
        }
        if(cnt!=2) return false;
        let cp = PointUtil.triangleCircle(t1);
        let cr = PointUtil.triangleCircleR(t1);
        let pcnt=0;
        for(let p of t2){
            if(PointUtil.inCircle(p,cp,cr)) pcnt++;
        }
        if(pcnt==3) return adjust(ps1,ps2);
        cp = PointUtil.triangleCircle(t2);
        cr = PointUtil.triangleCircleR(t2);
        pcnt=0;
        for(let p of t1){
            if(PointUtil.inCircle(p,cp,cr)) pcnt++;
        }
        if(pcnt==3) return adjust(ps1,ps2);
        return true;
    }

    static lineCross(Ax1,Ay1,Ax2,Ay2,Bx1,By1,Bx2,By2)
    {
        if(
        ( Math.max(Ax1,Ax2)>=Math.min(Bx1,Bx2)&&Math.min(Ax1,Ax2)<=Math.max(Bx1,Bx2) )&&  //判断x轴投影
        ( Math.max(Ay1,Ay2)>=Math.min(By1,By2)&&Math.min(Ay1,Ay2)<=Math.max(By1,By2) )    //判断y轴投影
        )
        {
            if(
                ( (Bx1-Ax1)*(Ay2-Ay1)-(By1-Ay1)*(Ax2-Ax1) ) *          //判断B是否跨过A
                ( (Bx2-Ax1)*(Ay2-Ay1)-(By2-Ay1)*(Ax2-Ax1) ) <=0 &&
                ( (Ax1-Bx1)*(By2-By1)-(Ay1-By1)*(Bx2-Bx1) ) *          //判断A是否跨过B
                ( (Ax2-Bx1)*(By2-By1)-(Ay2-By1)*(Bx2-Bx1) ) <=0
            )
            {
                return true;
            }
            else
                return false;
        }
        else
            return false;
    }
}

function DelaunaySplitPoint(arr){
    var minX,maxX,minY,maxY;
    for(let p of arr){
        if(minX==undefined||p.x<minX){
            minX=p.x
        }
        if(maxX==undefined||p.x>maxX){
            maxX=p.x
        }
        if(minY==undefined||p.y<minY){
            minY=p.y
        }
        if(maxY==undefined||p.y>maxY){
            maxY=p.y
        }
    }

    minX=minX-1;
    minY=minY-1;
    maxY=maxY+1;
    maxX=maxX+1;

    let borderPoints = [];
    let triangles=[];
    //左上
    borderPoints.append(PointUtil.makePoint(minX,minY));
    //左下
    borderPoints.append(PointUtil.makePoint(minX,maxY));
    //右上
    borderPoints.append(PointUtil.makePoint(maxX,minY));
    //右下
    borderPoints.append(PointUtil.makePoint(maxX,maxY));

    triangles.append(PointUtil.makeTriangle(borderPoints[0],borderPoints[1],borderPoints[2]));
    triangles.append(PointUtil.makeTriangle(borderPoints[1],borderPoints[2],borderPoints[3]));

    for(let p of arr){
        try{
            triangles.forEach((t,index) => {
                if(PointUtil.pointInTriangle(t,p)){
                    let t1 = PointUtil.makeTriangle(t[0],t[1],p);
                    let t2 = PointUtil.makeTriangle(t[0],t[2],p);
                    let t3 = PointUtil.makeTriangle(t[1],t[2],p);
                    for(let i=0;i<triangles.length;i++){
                        let ret = PointUtil.adjustTriangle(t1,triangles[i]);
                        if(ret===true) {triangles.push(t1);break;}
                        if(ret===false) continue;
                        triangles.splice(i,1);
                        triangles.push(ret[0]);
                        triangles.push[ret[1]];
                        break;
                    }
                    for(let i=0;i<triangles.length;i++){
                        let ret = PointUtil.adjustTriangle(t2,triangles[i]);
                        if(ret===true) {triangles.push(t2);break;}
                        if(ret===false) continue;
                        triangles.splice(i,1);
                        triangles.push(ret[0]);
                        triangles.push[ret[1]];
                        break;
                    }
                    for(let i=0;i<triangles.length;i++){
                        let ret = PointUtil.adjustTriangle(t3,triangles[i]);
                        if(ret===true) {triangles.push(t3);break;}
                        if(ret===false) continue;
                        triangles.splice(i,1);
                        triangles.push(ret[0]);
                        triangles.push[ret[1]];
                        break;
                    }
                    throw new Error("find triangle");
                }
            });
        }catch(e){

        }
    }
    for(let i=0;i<triangles.length;i++){
        let t = triangles[i];
        if(t.indexOf(minX)!=-1){
            triangles.splice(i,1);
            continue;
        }
        if(t.indexOf(maxX)!=-1){
            triangles.splice(i,1);
            continue;
        }
        if(t.indexOf(minY)!=-1){
            triangles.splice(i,1);
            continue;
        }
        if(t.indexOf(maxY)!=-1){
            triangles.splice(i,1);
            continue;
        }
    }
    return triangles
}