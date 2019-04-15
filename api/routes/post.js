const express = require('express');
const router = express.Router();

const multer = require('multer');

const checkAuth = require('../middleware/check-auth');
const PostController = require('../controllers/posts');


const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/');
    },
    filename: function(req, file,cb){
        
        cb(null, file.originalname );
    }
});

const fileFilter = (req, file, cb) =>{
    //reject a file
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' ){
        cb(null, true);
    }else{
        cb(null, false);
    }
    
}
const upload = multer({
                        storage: storage,
                        limits:{
                            fileSize : 1024 * 1024 *5 
                        },
                        fileFilter: fileFilter
                    });



//all post show
router.get('/allpost', checkAuth, PostController.post_all);

//create post
router.post('/create', checkAuth, upload.single('postImage'), PostController.post_create);

//delete post
router.delete('/delete/:postId', checkAuth, PostController.post_delete)


//One post show
router.get('/:postId', checkAuth, PostController.post_one_show)

//get post for edit
router.get('/edit/:postId', checkAuth, PostController.post_edit_details_get)

//update post  patch
router.patch('/edit/:postId',  checkAuth, upload.single('postImage'),  PostController.post_edit_save)

module.exports = router;