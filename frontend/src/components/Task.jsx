import React from 'react'
import { useParams } from 'react-router-dom'

import TaskNavbar from './TaskNavbar'

function Task() {
    const { id } = useParams()

    return (
        <>
            <TaskNavbar
                task={id}
            />
            <div className='task-container'>
                <div className='task-list'>

                </div>

                <div className='editor'>
                    
                </div>
            </div>
        </>
    )
}

export default Task