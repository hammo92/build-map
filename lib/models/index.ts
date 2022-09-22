import { Content } from "../../lib/content/data/content.model";
import { errorIfUndefined } from "../../lib/utils";
import { data } from "@serverless/cloud";
import { BaseModel } from "./baseModel";
import { ContentTemplate } from "@lib/contentTemplate/data/contentTemplate.model";
import { User } from "@lib/user/data/user.model";
import { Organisation } from "@lib/organisation/data/organisation.model";
import { Project } from "@lib/project/data/projectModel";
import { Invitation } from "@lib/invitation/data/invitation.model";

export * from "./baseModel";
export * from "./modelWithHistory";

export async function getBaseModel({ id, userId }: { id: string; userId: string }) {
    errorIfUndefined({ id, userId });
    const model = (await data.get("id")) as BaseModel<any>;
    switch (model.type) {
        case "Content":
            return model as BaseModel<Content>;
        case "ContentTemplate":
            return model as BaseModel<ContentTemplate>;
        case "User":
            return model as BaseModel<User>;
        case "Organisation":
            return model as BaseModel<Organisation>;
        case "Project":
            return model as BaseModel<Project>;
        case "Invitation":
            return model as BaseModel<Invitation>;
        default:
            return model;
    }
}
