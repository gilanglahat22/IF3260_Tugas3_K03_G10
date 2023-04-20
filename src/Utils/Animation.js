class Tranformation{
    constructor(){
        this.move_obj = [0,0,0];
        this.rotation_obj = [0,0,0];
        this.scale_obj = [1,1,1]; 
        this.move_subtr = [0,0,0];
        this.rotation_subtr = [0,0,0];
        this.scale_subtr = [1,1,1];
    }
}

class Animation{
    constructor(){
        this.frames = [];
        this.indexCurFrame = 0 ;
    }
    addAnimation(index, transformation){
        this.frames[index].push(transformation);
    }
    addFrames(frame){
        this.frames.push(frame);
    }
}