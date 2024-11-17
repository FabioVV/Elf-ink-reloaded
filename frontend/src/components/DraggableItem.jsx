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
                <span className='task-total t'><span>Total Tasks</span>: {task?.TotalTasks}</span>
                <span className='task-total c'><span className='completed'>Tasks completed</span>: {task?.TotalCompletedTasks}</span>
                <span className='task-total u'><span className='uncompleted'>Tasks uncompleted</span>: {task?.TotalUncompletedTasks}</span>
            </div>
        </div>
    )
}

export default DraggableItem