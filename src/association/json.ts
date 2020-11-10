export interface JsonAssociation {
    id: string | number;
    name: string;
    description?: string;
    parent?: JsonAssociation;
}