import { Repository } from 'typeorm';
import { Subscription } from './subscription.entity';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
export declare class SubscriptionsService {
    private subscriptionRepository;
    constructor(subscriptionRepository: Repository<Subscription>);
    create(createSubscriptionDto: CreateSubscriptionDto): Promise<Subscription>;
    findAll(): Promise<Subscription[]>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
