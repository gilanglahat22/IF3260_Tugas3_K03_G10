// function createObject(gl, program, model){
//     return new MainObj(gl, program, model);
// }

// function createObject(gl, program, objModel){
//     let objArticulated = new RecursionObj(gl, program, objModel.obj);
    
//     // Initialize parent obj
//     objArticulated.obj = new MainObj(gl, program, objModel.obj);
//     objModel.rotation_obj[0] = toRadian(objModel.rotation_obj[0]);
//     objModel.rotation_obj[1] = toRadian(objModel.rotation_obj[1]);
//     objModel.rotation_obj[2] = toRadian(objModel.rotation_obj[2]);
//     objArticulated.obj.translation = objModel.move_obj;
//     objArticulated.obj.rotation = objModel.rotation_obj;
//     objArticulated.obj.scale = objModel.scale_obj;
//     objArticulated.obj.textureMode = objModel.texture;

//     // Initialize value for the children
//     objArticulated.name = objModel.name;
//     objArticulated.translation = objModel.move_subtr;
//     objModel.rotation_subtr[0] = toRadian(objModel.rotation_subtr[0]);
//     objModel.rotation_subtr[1] = toRadian(objModel.rotation_subtr[1]);
//     objModel.rotation_subtr[2] = toRadian(objModel.rotation_subtr[2]);
//     objArticulated.rotation = objModel.rotation_subtr;
//     objArticulated.scale = objModel.scale_subtr;

//     // create object by recursion child
//     for(let i = 0; i<objModel.child.length; i++){
//         objArticulated.addChild(createObject(gl, program, objModel.child[i]));
//     }
//     return objArticulated;
// }

// function getArticulatedObj(id, obj){
//     if(id!=0){
//         id--;
//         for(let i = 0; i<obj.child.length; i++){
//             let ret = getArticulatedObj(id, obj.child[i]);
//             id -= getNumObj(obj.child[i]);
//             if(ret != null) return ret;
//         }
//         return null;
//     }else{
//         return obj;
//     }
// }

// function getNumObj(obj){
//     var temp = 1;
//     for(let i = 0; i<obj.child.length; i++) temp += getNumObj(obj.child[i]);
//     return temp;
// }
