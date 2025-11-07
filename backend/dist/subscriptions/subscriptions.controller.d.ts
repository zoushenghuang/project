import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
export declare class SubscriptionsController {
    private readonly subscriptionsService;
    constructor(subscriptionsService: SubscriptionsService);
    create(createSubscriptionDto: CreateSubscriptionDto): Promise<import("./subscription.entity").Subscription>;
    findAll(): Promise<import("./subscription.entity").Subscription[]>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
