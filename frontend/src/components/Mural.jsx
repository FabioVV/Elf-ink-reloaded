import React, { useEffect, useState } from 'react';

import '../static/css/mural.css'

import DroppableSection from './DroppableSection'
import DraggableItem from './DraggableItem'
import Footer from './Footer'
import CustomContextMenu from './CustomContextMenu';

import { GetAllTasks } from '../lib/Task';
import {EventsOn, EventsEmit} from '../../wailsjs/runtime/runtime'

function Mural() {
    const [newTasks, setNewTasks] = useState([])
    const [inprogressTasks, setInProgressTasks] = useState([])
    const [finalizingTasks, setFinalizingTasks] = useState([])
    const [doneTasks, setDoneTasks] = useState([])

    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    const [menuVisible, setMenuVisible] = useState(false);

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

        setMenuPosition({ x: e.clientX + scrollX, y: e.clientY + scrollY })    
        setMenuVisible(true)
    }

    const handleCloseMenu = () => {
        setMenuVisible(false)
    }

    useEffect(() => {
        window.addEventListener('scroll', handleCloseMenu)

        return () => {
            window.removeEventListener('scroll', handleCloseMenu);
        }
    }, [])

    useEffect(()=>{
        setupTasks()
        EventsOn("reload_tasks", setupTasks)
    }, [])

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
            />
        </div>
    )
}

export default Mural