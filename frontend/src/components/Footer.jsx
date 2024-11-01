import React, { useEffect, useState } from 'react'

import { getUserInfo } from '../lib/user'
import Dialog from './Dialog'

import {EventsOn, EventsEmit} from "../../wailsjs/runtime/runtime"

function Footer() {

    const [task, setTask] = useState({
        name: ''
    })


    const openCreateTask = () =>{
        document.getElementById('create-task').showModal()
    }

    const CreateTask = () =>{
        EventsEmit('create_task', task.name)
    }

    return (
        <>
            <footer>
                <button onClick={openCreateTask}>New task</button>
            </footer>

            <Dialog title={`Create task`} id={`create-task`}>
                <form onSubmit={CreateTask} acceptCharset="UTF-8">
                    <div className="field">
                        <input required onChange={(e) => {setTask({name: e.target.value})}} type="text" placeholder="Task name" name="name" id="name"/>
                    </div>
                    <div id='arrow-submit' className="submit-arrow">
                        <button ><i className="fa-solid fa-arrow-right"></i></button>
                    </div>
                </form>
            </Dialog>
        </>
    )
}

export default Footer