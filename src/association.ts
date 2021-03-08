import { Competitor } from './competitor';
import { Team } from './team';

export class Association {
    static readonly MIN_LENGTH_NAME = 2;
    static readonly MAX_LENGTH_NAME = 20;
    static readonly MAX_LENGTH_DESCRIPTION = 50;

    protected id: string | number = 0;
    protected description: string | undefined;
    protected parent: Association | undefined;
    protected children: Association[] = [];
    protected teams: Team[] = [];

    constructor(protected name: string, parent?: Association) {
        if (parent !== undefined) {
            this.setParent(parent);
        }
    }

    getId(): string | number {
        return this.id;
    }

    setId(id: string | number): void {
        this.id = id;
    }

    getName(): string {
        return this.name;
    }

    setName(name: string): void {
        this.name = name;
    }

    getDescription(): string | undefined {
        return this.description;
    }

    setDescription(description: string | undefined): void {
        this.description = description;
    }

    getParent(): Association | undefined {
        return this.parent;
    }

    setParent(parent: Association): void {
        if (this.parent === parent || this === parent) {
            return;
        }
        if (this.parent !== undefined) {
            const index = this.parent.getChildren().indexOf(this);
            if (index > -1) {
                this.parent.getChildren().splice(index, 1);
            }
        }
        this.parent = parent;
        this.parent.getChildren().push(this);
    }

    getAncestors(ancestors: Association[] = []): Association[] {
        const parent = this.getParent();
        if (parent === undefined) {
            return ancestors;
        }
        ancestors.push(parent);
        return parent.getAncestors(ancestors);
    }

    getChildren(): Association[] {
        return this.children;
    }

    getTeams(): Team[] {
        return this.teams;
    }
}
