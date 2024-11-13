import React, {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom'
import { EventsOn, EventsEmit } from '../../wailsjs/runtime/runtime'

import TaskNavbar from './TaskNavbar'
import TaskItemCheck from './TaskItemCheck'
import { GetAllTasksItems, GetTask, getTaskItemActive } from '../lib/Task'
import Dialog from './Dialog'

function Task() {
    const { taskID } = useParams()

    const [taskItems, setTaskItems] = useState([])
    const [taskItemName, setTaskItemName] = useState('')
    const [task, setTask] = useState({})
    const [taskItemCurrentlyEditing, setTaskItemCurrentlyEditing] = useState({})
    const [editorStatus, setEditorStatus] = useState(false)
    const [isSaving, setIsSaving] = useState(false)


    const setupTaskItems = async () => {
        let taskItems = await GetAllTasksItems(taskID)
        setTaskItems(taskItems)
    }

    const getTask = async () => {
        let task = await GetTask(taskID)
        setTask(task)
    }

    const getTaskActiveItem = async () => {
        let task = await getTaskItemActive(taskID)
        setTaskItemCurrentlyEditing(task)
    }

    const createTaskItem = (e) => {
        let task_item = {task_id: taskID, name: taskItemName}
        EventsEmit('create_task_item', task_item)
    }

    const handleCheckBox = (checked, id) => {
        let task_item = {taskItemId: id, taskId: taskID, status: checked ? "2" : "1"}
        EventsEmit('update_task_item', task_item)
    }

    const openCreateTaskItem = () =>{
        document.getElementById('create-item').showModal()
    }

    const setActive = (taskItemID, active) =>{
        let task_item = {id: taskItemID, active: active}
        EventsEmit('update_task_item_active', task_item)
    }

    const activeTaskItem = (taskItem) =>{
        setTaskItemCurrentlyEditing(taskItem)
    }

    const saveContent = () => {
        const content = document.getElementById('content_hidden')
        
        if(content){
            let task_item = {task_id: taskID, content: content.value}
            EventsEmit('update_task_item_content', task_item)
        }

        setIsSaving(false)
    }

    useEffect(()=>{
        setupTaskItems()
        getTask()
        getTaskActiveItem()
        document.body.style.overflow = "hidden"
    }, [])

    useEffect(()=>{
        const showPageElement = document.getElementById('show_page')
        const docMenterElement = document.querySelector('.doc-menter-content')
        const contentHidden = document.getElementById('content_hidden')

        if(showPageElement && docMenterElement && taskItemCurrentlyEditing?.Content){
            showPageElement.innerHTML = taskItemCurrentlyEditing?.ContentMarked
            docMenterElement.innerHTML = taskItemCurrentlyEditing?.Content
            contentHidden.value = taskItemCurrentlyEditing?.Content
        } else {
            showPageElement.innerHTML = ""
            docMenterElement.innerHTML = ""
            contentHidden.value = ""
        }

    }, [taskItemCurrentlyEditing])

    useEffect(() => {
        const checkbox = document.getElementById('editor-mode-toggle')

        if(checkbox.checked){
            setEditorStatus(true)
        } 
    
        const handleCheckboxChange = () => {
            setEditorStatus(checkbox.checked)
        }
    
        checkbox.addEventListener('change', handleCheckboxChange)

        return () => {
          checkbox.removeEventListener('change', handleCheckboxChange);
        }
    }, [])

    useEffect(() => {
        const docMenterElement = document.querySelector('.doc-menter-content')

        let saveTimeout;

        const handleEditorContent = () => {
          clearTimeout(saveTimeout)

          saveTimeout = setTimeout(() => {
            setIsSaving(true)
            saveContent()
          }, 3000)
          
        }

        docMenterElement.addEventListener('input', handleEditorContent)

        return () => {
            clearTimeout(saveTimeout)
            docMenterElement.removeEventListener('input', handleEditorContent)
        }
    }, [])

    EventsOn("reload_tasks", setupTaskItems)
    EventsOn("set_ative_task_item", activeTaskItem)

    return (
        <>
            <TaskNavbar
                taskTitle={task?.Name}
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
                                setActive={setActive}
                            >
                            </TaskItemCheck>
                        ))}
                    </div>
                </div>

                <div className='editor'>
                    <div id='markdown-change'></div>

                    <div className='editor-main' style={{display: editorStatus ? "flex" : "none", flexDirection: editorStatus ? "column" : ""}}>
                        <div id='markdown-load-toolbox'></div>
                        <form encType="multipart/form-data" acceptCharset="UTF-8">
                            <input type="hidden" name="content_hidden" id='content_hidden'/>
                            <input hidden type="file" name="markdown-file" id="markdown-file" style={{display:"none"}}/>
                            <doc-menter></doc-menter>
                        </form>
                    </div>

                    <div className='showPage' id='show_page' style={{display: !editorStatus ? "block" : "none"}}>
                    </div>

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