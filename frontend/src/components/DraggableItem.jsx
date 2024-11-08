import React, { useEffect, useState } from 'react';

function DraggableItem({id, handleDrag, handleMenu, openTask, task}) {
    const [isDragging, setIsDragging] = useState(false)

    const handleDragStart = (e) => {
      setIsDragging(true)
      handleDrag(e, task?.Status)
    }
  
    const handleDragEnd = () => {
      setIsDragging(false)
    }

    return (
        <div 
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onContextMenu={handleMenu}
        onClick={() => {openTask(id, task?.Name)}}

        className='mural-item' id={id}>
            <div className='mural-item-title'>
              {task?.Name}
            </div>

            {/* <div className='mural-item-preview'>
              {task?.Content}
            </div> */}

            <div className='mural-item-time'>
                <span className='task-total'><span>Total Tasks</span>: {task?.TotalTasks}</span> <br/>
                <span className='task-total'><span className='completed'>Tasks completed</span>: {task?.TotalCompletedTasks}</span> <br/>
                <span className='task-total'><span className='uncompleted'>Tasks uncompleted</span>: {task?.TotalUncompletedTasks}</span> <br/>

                <span className='time'>Created at: {task?.CreatedAtStr}</span>
                <br />
                <span className='time'>Updated at: {task?.UpdatedAtStr}</span>
            </div>
        </div>
    )
}

export default DraggableItem