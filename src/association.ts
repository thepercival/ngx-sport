import { Competitor } from './competitor';

export class Association {
    static readonly MIN_LENGTH_NAME = 2;
    static readonly MAX_LENGTH_NAME = 20;
    static readonly MAX_LENGTH_DESCRIPTION = 50;

    protected id: any;
    protected name: string;
    protected description: string;
    protected parent: Association;
    protected children: Association[];
    protected competitors: Competitor[] = [];

    constructor(name: string, parent?: Association) {
        this.children = [];
        this.setName(name);
        if (parent !== undefined) {
            this.setParent(parent);
        }
    }

    getId(): any {
        return this.id;
    }

    setId(id: any): void {
        this.id = id;
    }

    getName(): string {
        return this.name;
    }

    setName(name: string): void {
        this.name = name;
    }

    getDescription(): string {
        return this.description;
    }

    setDescription(description: string): void {
        this.description = description;
    }

    getParent(): Association {
        return this.parent;
    }

    setParent(parent: Association): void {
        if (this.parent === parent) {
            return;
        }
        if (this.parent !== undefined) {
            const index = this.parent.getChildren().indexOf(this);
            if (index > -1) {
                this.parent.getChildren().splice(index, 1);
            }
        }
        this.parent = parent;
        if (this.parent !== undefined) {
            this.parent.getChildren().push(this);
        }
    }

    getAncestors(ancestors: Association[] = []) {
        if (this.getParent() === undefined) {
            return ancestors;
        }
        ancestors.push(this.getParent());
        return this.getParent().getAncestors(ancestors);
    }

    getChildren(): Association[] {
        return this.children;
    }

    getCompetitors(): Competitor[] {
        return this.competitors;
    }
}
