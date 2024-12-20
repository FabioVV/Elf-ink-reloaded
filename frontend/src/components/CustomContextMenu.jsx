import React, {useEffect} from 'react'

function CustomContextMenu({ x, y, taskID, taskTitle, openTask, openDeleteTask, visible, onClose }) {
    if (!visible) return null;

    const style = {
        position: 'absolute',
        top: `${y}px`,
        left: `${x}px`,
        border: '1px solid #ccc',
        boxShadow: '2px 2px 10px rgba(0,0,0,0.2)',
        padding: '7px',
        backgroundColor: 'black',
        zIndex: 1000,
        borderRadius: '8px',
    }

    return (
        <div style={style} onScroll={onclose}>
            <ul className='menu-ul'>
                <li onClick={() => { openTask(taskID, taskTitle); onClose() }}>Open</li>
                <li onClick={() => { openDeleteTask(taskID); onClose() }}>Delete</li>
                <hr />
                <li onClick={() => { onClose() }}>Close</li>
            </ul>
        </div>
    )
}

export default CustomContextMenu