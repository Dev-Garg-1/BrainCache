import { Router } from "express";
import { 
    addContent, 
    deleteContent, 
    getContent, 
    getContentByShareId, 
    shareContent, 
    unShareContent, 
    updateContent 
} from "../controllers/content.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/add").post(
    verifyJWT, 
    addContent
);

router.route("/delete").post(
    verifyJWT, 
    deleteContent
);

router.route("/get").get(
    verifyJWT,
    getContent
);

router.route("/update").patch(
    verifyJWT, 
    updateContent
);

router.route('/share').post(
    verifyJWT,
    shareContent
)

router.route('/unshare').post(
    verifyJWT,
    unShareContent
)

router.route('/getSharedContent').get(
    getContentByShareId
)

export default router;