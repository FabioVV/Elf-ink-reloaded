import {GetTasks, GetTaskItems, GetTaskSingle} from "/wailsjs/go/main/App"


export async function GetAllTasks(status){
    return await GetTasks(status)
}

export async function GetAllTasksItems(taskID){
    return await GetTaskItems(taskID)
}

export async function GetTask(taskID){
    return await GetTaskSingle(taskID)
}