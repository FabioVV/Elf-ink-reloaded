import React, { useEffect, useState } from 'react'
import { EventsOn, EventsEmit } from '../../wailsjs/runtime/runtime'

function TaskItemCheck({id, taskItem, handleCheckBox}) {

    const [status, setStatus] = useState('')

    return (
        <div title={taskItem?.Name} className={`task-item-check`}>
            <label>
                {taskItem?.Name}
                <br></br> 
                {taskItem.Status == 1 ? <span className='uncon'>Uncompleted...</span> : <span className='comp'>Completed!</span>}
            </label>
            <span><input checked={taskItem.Status == 2} onChange={(e)=>{handleCheckBox(e.target.checked, id)}} type="checkbox"/></span>
        </div>
    )
}

export default TaskItemCheck