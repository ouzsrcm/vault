
import { CategoryServices } from './CategoryService';
import { CommandService } from './CommandService';

export const DatabaseServices = {
    CommandService: CommandService.getInstance(),
    CategoryService: CategoryServices.getInstance(),
}
