import React, {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom'
import { EventsOn, EventsEmit } from '../../wailsjs/runtime/runtime'

import TaskNavbar from './TaskNavbar'
import TaskItemCheck from './TaskItemCheck'
import { GetAllTasksItems } from '../lib/Task'
import Dialog from './Dialog'

function Task() {
    const { id } = useParams()

    const [taskItems, setTaskItems] = useState([])
    const [taskItemName, setTaskItemName] = useState('')

    const setupTaskItems = async () => {
        let taskItems = await GetAllTasksItems(id)
        console.log(taskItems)
        setTaskItems(taskItems)
    }

    const createTaskItem = (e) => {
        let task_item = {task_id: id, name: taskItemName}
        EventsEmit('create_task_item', task_item)
    }

    const handleCheckBox = (checked, id) => {
        let task_item = {taskItemId: id, status: checked ? "2" : "1"}
        EventsEmit('update_task_item', task_item)
    }

    const openCreateTaskItem = () =>{
        document.getElementById('create-item').showModal()
    }
    
    useEffect(()=>{
        setupTaskItems()
        document.body.style.overflow = "hidden"
    }, [])

    EventsOn("reload_tasks", setupTaskItems)

    return (
        <>
            <TaskNavbar
                taskTitle={id}
            />
            <div className='task-container'>
                <div className='task-stuff'>
                    <div className='task-item-new'>
                        <button type='button' onClick={openCreateTaskItem}>New item</button>
                        
                    </div>
                    <div className='task-list'>
                        {taskItems?.map((taskItem) => (
                            <TaskItemCheck
                                key={taskItem.ID}
                                id={taskItem.ID}
                                taskItem={taskItem}
                                handleCheckBox={handleCheckBox}
                            >
                            </TaskItemCheck>
                        ))}
                    </div>
                </div>

                <div className='editor'>
                    
                </div>
            </div>

            <Dialog title={`Create item`} id={`create-item`}>
                <form onSubmit={createTaskItem} acceptCharset="UTF-8">
                    <div className="field">
                        <input required onChange={(e) => {setTaskItemName(e.target.value)}} type="text" placeholder="Task item name" name="name" id="name"/>
                    </div>
                    <div id='arrow-submit' className="submit-arrow">
                        <button ><i className="fa-solid fa-arrow-right"></i></button>
                    </div>
                </form>
            </Dialog>
        </>
    )
}

export default Task