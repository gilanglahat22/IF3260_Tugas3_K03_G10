class Transformation{
    constructor(){
        this.move_obj = [0,0,0];
        this.rotation_obj = [0,0,0];
        this.scale_obj = [1,1,1]; 
        this.move_subtr = [0,0,0];
        this.rotation_subtr = [0,0,0];
        this.scale_subtr = [1,1,1];
    }
}

class Frame{
    constructor(){
        this.transformations = [];
    }
    addTransformation(transformation){
        this.transformations.push(transformation);
    }
}

class Animation{
    constructor(){
        this.frames = [];
        this.indexCurFrame = 0 ;
    }
    addFrames(frame){
        this.frames.push(frame);
    }
}

function setTransformation(inputTransformation){
    let transformation = new Transformation();
    transformation.move_obj = inputTransformation.move_obj;
    transformation.move_subtr = inputTransformation.move_subtr;
    transformation.rotation_obj = inputTransformation.rotation_obj;
    transformation.rotation_subtr = inputTransformation.rotation_subtr;
    transformation.scale_obj = inputTransformation.scale_obj;
    transformation.scale_subtr = inputTransformation.scale_subtr;
    return transformation;
}

function setFrame(inputFrame){
    let frame = new Frame();
    for(let i = 0; i<inputFrame.transformations.length; i++){
        frame.addTransformation(setTransformation(inputFrame.transformations[i]));
    }
    return frame;
}

function setAnimation(inputAnimation){
    let animation = new Animation();
    for(let i = 0; i<inputAnimation.frames.length; i++){
        animation.addFrames(setFrame(inputAnimation.frames[i]));
    }
    return animation;
}