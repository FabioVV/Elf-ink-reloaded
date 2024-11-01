import {GetTasks} from "/wailsjs/go/main/App"


export async function GetAllTasks(status){
    return await GetTasks(status)
}
