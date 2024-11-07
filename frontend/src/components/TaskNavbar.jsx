import React from 'react'
import { useNavigate } from 'react-router-dom'

function TaskNavbar({taskTitle}) {
    const navigate = useNavigate()

    return (
        <nav className='task-nav'>
            <div className='task-nav-return'>
                <button type='button' onClick={()=>{navigate('/')}}>
                    <i className="fa-solid fa-arrow-left-long"></i>
                </button>
            </div>

            <div className='task-nav-title'>
                <span>{taskTitle}</span>
            </div>

            <div>
            </div>
        </nav>
    )
}

export default TaskNavbar