import { Router } from "express";
import { 
    addContent, 
    deleteContent, 
    getContent, 
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

export default router;