import { Category } from "../category";

export class CategoryMap extends Map<number, Category> {

    constructor(categories: Category[]) {
        super();
        categories.forEach(category => {
            this.set(category.getNumber(), category);
        });
    }
}