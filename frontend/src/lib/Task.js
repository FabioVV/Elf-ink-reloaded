import {GetTasks, GetTaskItems} from "/wailsjs/go/main/App"


export async function GetAllTasks(status){
    return await GetTasks(status)
}

export async function GetAllTasksItems(taskID){
    return await GetTaskItems(taskID)
}
