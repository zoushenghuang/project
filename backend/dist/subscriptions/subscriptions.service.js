"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const subscription_entity_1 = require("./subscription.entity");
let SubscriptionsService = class SubscriptionsService {
    constructor(subscriptionRepository) {
        this.subscriptionRepository = subscriptionRepository;
    }
    async create(createSubscriptionDto) {
        const existing = await this.subscriptionRepository.findOne({
            where: { email: createSubscriptionDto.email },
        });
        if (existing) {
            throw new common_1.ConflictException('该邮箱已经订阅');
        }
        const subscription = this.subscriptionRepository.create(createSubscriptionDto);
        return this.subscriptionRepository.save(subscription);
    }
    async findAll() {
        return this.subscriptionRepository.find({
            order: { subscribedAt: 'DESC' },
        });
    }
    async remove(id) {
        const subscription = await this.subscriptionRepository.findOne({
            where: { id },
        });
        if (!subscription) {
            throw new common_1.NotFoundException('订阅不存在');
        }
        await this.subscriptionRepository.remove(subscription);
        return { message: '订阅取消成功' };
    }
};
exports.SubscriptionsService = SubscriptionsService;
exports.SubscriptionsService = SubscriptionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(subscription_entity_1.Subscription)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SubscriptionsService);
//# sourceMappingURL=subscriptions.service.js.map