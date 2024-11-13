import React, { useState } from 'react'

function TaskItemCheck({id, taskItem, handleCheckBox, setActive}) {

    const [status, setStatus] = useState('')

    return (
        <div title={taskItem?.Name} className={`task-item-check`}>
            <label className={`${taskItem.Active == 1 ? 'task-item-check-active': ''}`} onClick={()=>{setActive(id, taskItem.Active == 1 ? "0": "1")}}>
                {taskItem?.Name}
                <br></br> 
                {taskItem.Status == 1 ? <span className='uncon'>Uncompleted...</span> : <span className='comp'>Completed!</span>}
            </label>
            <span><input checked={taskItem.Status == 2} onChange={(e)=>{handleCheckBox(e.target.checked, id)}} type="checkbox"/></span>
        </div>
    )
}

export default TaskItemCheck