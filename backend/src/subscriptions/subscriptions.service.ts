import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from './subscription.entity';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
  ) {}

  async create(createSubscriptionDto: CreateSubscriptionDto) {
    const existing = await this.subscriptionRepository.findOne({
      where: { email: createSubscriptionDto.email },
    });

    if (existing) {
      throw new ConflictException('该邮箱已经订阅');
    }

    const subscription = this.subscriptionRepository.create(createSubscriptionDto);
    return this.subscriptionRepository.save(subscription);
  }

  async findAll() {
    return this.subscriptionRepository.find({
      order: { subscribedAt: 'DESC' },
    });
  }

  async remove(id: number) {
    const subscription = await this.subscriptionRepository.findOne({
      where: { id },
    });

    if (!subscription) {
      throw new NotFoundException('订阅不存在');
    }

    await this.subscriptionRepository.remove(subscription);
    return { message: '订阅取消成功' };
  }
}

