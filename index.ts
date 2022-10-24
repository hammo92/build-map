import { users } from './lib/user/endpoints'
import { organisations } from './lib/organisation/endpoints'
import { projects } from './lib/project/endpoints'
import { invitations } from './lib/invitation/endpoints'
import { contentTemplates } from './lib/contentTemplate/endpoints'
import { content } from './lib/content/endpoints'
import { schedule, api } from '@serverless/cloud'
import { asset } from './lib/asset/endpoints'
import { field } from './lib/field/endpoints'
import { responses } from './lib/responseSet/endpoints'

import cors from 'cors'

schedule.every('60 minutes', async () => {
    console.log('Hello from Serverless Cloud')
})

api.use(cors())

users()
organisations()
invitations()
projects()
contentTemplates()
content()
asset()
field()
responses()
