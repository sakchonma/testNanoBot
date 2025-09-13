import express from "express"
import {
    registerProfileSchema,
    registerProfile,
    loginProfileSchema,
    loginProfile,
    listUserProfileSchema,
    listUserProfile,
    getUserById,
    updateProfileSchema,
    updateProfile,
    deleteProfile
} from "../controllers/user"
import authorize from "../middleware/auth"
const router = express.Router()

router.post('/register', registerProfileSchema, registerProfile)
router.post('/login', loginProfileSchema, loginProfile)
router.post('/list', authorize(), listUserProfileSchema, listUserProfile)
router.get('/get/:id', authorize("admin", "editor",), getUserById)
router.put('/edit/:id', authorize("admin", "editor"), updateProfileSchema, updateProfile)
router.delete('/delete/:id', authorize("admin",), deleteProfile)

export default router