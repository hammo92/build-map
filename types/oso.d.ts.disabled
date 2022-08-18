declare module "oso-cloud" {
    class Actor {
        id: string | number;
    }
    class Resource {
        id: string | number;
    }
    class Oso {
        constructor(url: string, apiKey: string);
        authorize(
            actor: Actor,
            action: string,
            resource: Resource
        ): Promise<boolean>;
        list(
            actor: Actor,
            action: string,
            resourceType: string | { name: string }
        ): Promise<any[]>;
        addRole(actor: Actor, role: string, resource: Resource): Promise<null>;
        deleteRole(
            actor: Actor,
            role: string,
            resource: Resource
        ): Promise<null>;
        addRelation(
            subject: Resource,
            name: string,
            object: Resource
        ): Promise<null>;
        deleteRelation(
            subject: Resource,
            name: string,
            object: Resource
        ): Promise<null>;
        getRoles(actor: Actor, role: string, resource: Resource): Promise<null>;
    }
}
