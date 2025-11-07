import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
export declare class TagsController {
    private readonly tagsService;
    constructor(tagsService: TagsService);
    create(createTagDto: CreateTagDto): Promise<import("./tag.entity").Tag>;
    findAll(): Promise<import("./tag.entity").Tag[]>;
    findPopular(): Promise<any[]>;
    findOne(id: string): Promise<import("./tag.entity").Tag>;
    update(id: string, updateTagDto: UpdateTagDto): Promise<import("./tag.entity").Tag>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
