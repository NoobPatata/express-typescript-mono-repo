import type { Request, Response, Router } from 'express';
import {validate} from "../../../../../common/middlewares/requestValidator";

export function userRoutes(router: Router) {
    router.use('/user', router);

    router.get('/', validate(), (_request: Request, response: Response) => {
        response.status(200).json({ status: 'ok' });
    });
}