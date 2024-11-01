import React, { useEffect, useState } from 'react';

function DraggableItem({id, handleDrag, task}) {
    const [isDragging, setIsDragging] = useState(false)

    const handleDragStart = (e) => {
      setIsDragging(true)

      // const cards = document.getElementsByClassName('mural-item')
      // for(let i = 0; i < cards.length; i++){  
      //   if(cards[i].id != e.target.id){
      //       cards[i].style.display = 'none'
      //   }
      // }
      
      handleDrag(e, task?.Status)
    }
  
    const handleDragEnd = () => {
      setIsDragging(false)

      // const cards = document.getElementsByClassName('mural-item')
      // for(let i = 0; i < cards.length; i++){  
      //   cards[i].style.display = 'flex'

      // }
      
    }

    return (
        <div 
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}

        className='mural-item' id={id}>
            <div className='mural-item-title'>
              {task?.Name}
            </div>

            <div className='mural-item-preview'>
              {task?.Name}

            </div>

            <div className='mural-item-time'>
                <span>Tasks: 0</span>
                <br/>
                <span className='time'>Created at: {task?.CreatedAtStr}</span>
                <br />
                <span className='time'>Updated at: {task?.UpdatedAtStr}</span>
            </div>
        </div>
    )
}

export default DraggableItem