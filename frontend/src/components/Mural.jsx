import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom"

import '../static/css/mural.css'

import DroppableSection from './DroppableSection'
import DraggableItem from './DraggableItem'
import Footer from './Footer'
import CustomContextMenu from './CustomContextMenu';
import Dialog from './Dialog'

import { GetAllTasks } from '../lib/Task';
import {EventsOn, EventsEmit} from '../../wailsjs/runtime/runtime'

function Mural() {
    const [newTasks, setNewTasks] = useState([])
    const [inprogressTasks, setInProgressTasks] = useState([])
    const [finalizingTasks, setFinalizingTasks] = useState([])
    const [doneTasks, setDoneTasks] = useState([])

    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    const [menuVisible, setMenuVisible] = useState(false);
    const [taskID, setTaskID] = useState('');
    const [taskTitle, setTaskTitle] = useState('');

    const navigate = useNavigate()

    const handleDrag = (e, fromStatus) =>{
        e.dataTransfer.setData("text", JSON.stringify({id: e.target.id, status: fromStatus}))
    }

    const handleDrop = (e, toStatus) => {
        const data = JSON.parse(e.dataTransfer.getData("text"))

        if(data.status == toStatus){
            window.flash("Move the task to another status", "error")
            return false
        }
        
        const task = {id: data.id, status: toStatus}
        updateTask(task)
    }

    const updateTask = (task) => {
        EventsEmit('update_task_status', task)
    }

    const DeleteTask = () => {
        EventsEmit('delete_task', taskID)
    }

    const openTask = (taskID) => {
        navigate(`/task/${taskID}`)
    }

    const setupTasks = async () => {
        let newTasks = await GetAllTasks(1)
        let inProgressTasks = await GetAllTasks(2)
        let finalizingTasks = await GetAllTasks(3)
        let doneTasks = await GetAllTasks(4)

        setNewTasks(newTasks)
        setInProgressTasks(inProgressTasks)
        setFinalizingTasks(finalizingTasks)
        setDoneTasks(doneTasks)

    }

    const handleRightClickMenu = (e) => {
        e.preventDefault()

        const scrollX = window.scrollX || window.pageXOffset;
        const scrollY = window.scrollY || window.pageYOffset;
        const parentDivID = e.currentTarget.closest('.mural-item')?.id
        const parentDivTitle = e.currentTarget.closest('.mural-item')?.querySelector('.mural-item-title')?.textContent
        
        setMenuPosition({ x: e.clientX + scrollX, y: e.clientY + scrollY })   
        setTaskID(parentDivID)
        setTaskTitle(parentDivTitle)
        setMenuVisible(true)
    }

    const handleCloseMenu = () => {
        setMenuVisible(false)
    }

    const openDeleteTask = () =>{
        document.getElementById('delete-task').showModal()
    }

    useEffect(() => {
        window.addEventListener('scroll', handleCloseMenu)

        return () => {
            window.removeEventListener('scroll', handleCloseMenu);
        }
    }, [])

    useEffect(()=>{
        setupTasks()
        document.body.style.overflowY = "hidden"
        document.body.style.overflowX = "auto"
    }, [])

    EventsOn("reload_tasks", setupTasks)

    return (
        <div className='mural'>
            <DroppableSection onDrop={handleDrop} title={"New!"} status={1}>
                {newTasks?.map((task) => (
                    <DraggableItem
                        key={task.ID}
                        id={task.ID}
                        task={task}
                        handleDrag={handleDrag}
                        handleMenu={handleRightClickMenu}
                        openTask={openTask}
                        openDeleteTask={openDeleteTask}

                    >
                    </DraggableItem>
                ))}
            </DroppableSection>

            <DroppableSection onDrop={handleDrop} title={"In progress..."} status={2}>
                {inprogressTasks?.map((task) => (
                    <DraggableItem
                        key={task.ID}
                        id={task.ID}
                        task={task}
                        handleDrag={handleDrag}
                        handleMenu={handleRightClickMenu}
                        openTask={openTask}
                        openDeleteTask={openDeleteTask}

                    >
                    </DraggableItem>
                ))}
            </DroppableSection>

            <DroppableSection onDrop={handleDrop} title={"Finalizing..."} status={3}>
                {finalizingTasks?.map((task) => (
                    <DraggableItem
                        key={task.ID}
                        id={task.ID}
                        task={task}
                        handleDrag={handleDrag}
                        handleMenu={handleRightClickMenu}
                        openTask={openTask}
                        openDeleteTask={openDeleteTask}

                    >
                    </DraggableItem>
                ))}
            </DroppableSection>

            <DroppableSection onDrop={handleDrop} title={"Done!"} status={4}>
                {doneTasks?.map((task) => (
                    <DraggableItem
                        key={task.ID}
                        id={task.ID}
                        task={task}
                        handleDrag={handleDrag}
                        handleMenu={handleRightClickMenu}
                        openTask={openTask}
                        openDeleteTask={openDeleteTask}

                    >
                    </DraggableItem>
                ))}
            </DroppableSection>

            <Footer />

            <CustomContextMenu 
                x={menuPosition.x}
                y={menuPosition.y}
                visible={menuVisible}
                onClose={handleCloseMenu}
                taskID={taskID}
                taskTitle={taskTitle}
                openTask={openTask}
                openDeleteTask={openDeleteTask}
            />

            <Dialog title={`Delete task`} id={`delete-task`}>
                <form onSubmit={DeleteTask} acceptCharset="UTF-8">
                    <div className="field">
                        <h4>Are you sure you want to delete this task?</h4>
                    </div>
                    <div>
                        <button className='delete-button'>Delete</button>
                    </div>
                </form>
            </Dialog>
        </div>
    )
}

export default Mural