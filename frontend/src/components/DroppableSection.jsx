import React, { useState } from 'react';

function DroppableSection({ onDrop, children, title, status}) {
    const [isOver, setIsOver] = useState(false)


    const handleDragOver = (e) =>{
        e.preventDefault()
        setIsOver(true)
    }

    const handleDragLeave = () => {
        setIsOver(false)
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setIsOver(false)
        onDrop(e, status)
    }

    return (
        <div 
        className='mural-option'>
            <div className='mural-title'>
                <h4>{title}</h4>
            </div>

            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            className='mural-content'>
                {children}
            </div>
        </div>
    )
}

export default DroppableSection