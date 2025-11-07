import { AuthorsService } from './authors.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
export declare class AuthorsController {
    private readonly authorsService;
    constructor(authorsService: AuthorsService);
    create(createAuthorDto: CreateAuthorDto): Promise<import("./author.entity").Author>;
    findAll(): Promise<import("./author.entity").Author[]>;
    findOne(id: string): Promise<import("./author.entity").Author>;
    update(id: string, updateAuthorDto: UpdateAuthorDto): Promise<import("./author.entity").Author>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
