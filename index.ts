import { users } from "./lib/user/endpoints";
import { organisations } from "./lib/organisation/endpoints";
import { projects } from "./lib/project/endpoints";
import { invitations } from "./lib/invitation/endpoints";
import { formTemplates } from "./lib/formTemplate/endpoints";
import { schedule, api } from "@serverless/cloud";
import cors from "cors";

schedule.every("60 minutes", async () => {
    console.log("Hello from Serverless Cloud");
});

api.use(cors());

users();
organisations();
invitations();
projects();
formTemplates();
