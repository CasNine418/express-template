import { BaseController } from "../base_controller";
import { UserController } from "../user/user_controller";

export class ApiV1 extends BaseController {
    private controllers: BaseController[] = [];

    constructor() {
        super('/api/v1');
        this.controllers = [
            new UserController()
        ];

        this.initRoutes();
    }

    protected initRoutes(): void {}

    private initializeChildRoutes(): void {
        this.controllers.forEach(controller => {
            this.router.use(controller.getPath(), controller.getRouter());
        });
    }

}