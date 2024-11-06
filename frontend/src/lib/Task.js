import {GetTasks, getTaskItems} from "/wailsjs/go/main/App"


export async function GetAllTasks(status){
    return await GetTasks(status)
}

export async function GetAllTasksItems(taskID){
    return await getTaskItems(taskID)
}
