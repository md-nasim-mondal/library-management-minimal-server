import  express  from "express";


const router = express.Router();

const routes = [
    {
        path: "/",
        route: ""
    }
]

// routes.forEach((route) => router.use(route.path, route.route));

export default router;
