import {
    buildIndex,
    indexBy,
    Model,
    timekey,
} from 'serverless-cloud-data-utils'
import { BaseModel } from '@lib/models'
import { Field } from '@lib/field/data/field.model'

//* Task model and indexes */
//namespace tasks:${taskId} */
export const TaskId = buildIndex({ namespace: `tasks`, label: 'label1' })

//namespace taskCollection_${taskCollectionId}:tasks:${date} */
export const CollectionTasks = (taskCollectionId: string) =>
    buildIndex({
        namespace: `taskCollection_${taskCollectionId}:tasks`,
        label: 'label2',
        converter: timekey,
    })

//namespace user_${userId}:createdTasks:${date} */
export const UserTasksCreated = (userId: string) =>
    buildIndex({
        namespace: `user_${userId}:createdTasks`,
        label: 'label3',
        converter: timekey,
    })

//namespace taskCollection_${taskCollectionId}:taskCategory:${category} */
export const TaskCategory = (taskCollectionId: string) =>
    buildIndex({
        namespace: `taskCollection_${taskCollectionId}:taskCategory`,
        label: 'label4',
    })

//model Task*/
export class Task extends BaseModel<Task> {
    object = 'Task'
    category: string //"To do", "doing" etc
    fields: Field[]
    description?: string
    complete?: boolean
    templateId: string
    modelKeys() {
        return [
            indexBy(TaskId).exact(this.id),
            ...(this.parent
                ? [
                      indexBy(CollectionTasks(this.parent)).exact(
                          this.createdTime
                      ),
                  ]
                : []),
            indexBy(UserTasksCreated(this.createdBy)).exact(this.createdTime),
            //indexBy(TaskCategory(this.collectionId)).exact(this.category),
            //indexBy(TaskStatus(this.collectionId)).exact(this.status),
            //indexBy(TaskPriority(this.collectionId)).exact(this.priority),
        ]
    }
}

//* TaskObject model and indexes */

//namespace taskLinks:${taskLinkId} */
export const TaskObjectId = buildIndex({
    namespace: `taskLinks`,
    label: `label1`,
})

//namespace task_${taskId}:taskObjects:${taskLinkId} */
export const TaskObjects = (taskId: string) =>
    buildIndex({ namespace: `task_${taskId}:taskObjects`, label: 'label2' })

//namespace object_${objectId}:tasks:${taskId}
export const ObjectTasks = (objectId: string) =>
    buildIndex({ namespace: `object_${objectId}:tasks`, label: 'label3' })

export class TaskObject extends BaseModel<TaskObject> {
    object = 'TaskObject'
    taskId: string
    objectId: string
    modelKeys() {
        return [
            indexBy(TaskObjectId).exact(this.id),
            indexBy(TaskObjects(this.taskId)).exact(this.id),
            indexBy(ObjectTasks(this.objectId)).exact(this.taskId),
        ]
    }
}
