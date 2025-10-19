export class Command {
    id: number;
    category_id: number;
    command: string;
    response: string;
    created_at: Date;
    constructor(id: number, category_id: number, command: string, response: string, created_at: Date) {
        this.id = id;
        this.category_id = category_id;
        this.command = command;
        this.response = response;
        this.created_at = created_at;
    }
}


export class Category {
    id: number;
    name: string;
    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }
}