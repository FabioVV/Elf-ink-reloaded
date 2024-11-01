import {GetPC} from "/wailsjs/go/main/App"


export async function getUserInfo(){
    return await GetPC()
}
