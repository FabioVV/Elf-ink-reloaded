import React, {useEffect, useState} from 'react';

import Bus from '../utils/Bus';

export const Flash = () => {
  
    let [visibility, setVisibility] = useState(false);
    let [message, setMessage] = useState('');
    let [type, setType] = useState('');

    useEffect(() => {
        const handleFlash = ({message, type}) => {
            setVisibility(true);
            setMessage(message);
            setType(type);
    
            const timeout = setTimeout(() => {
                setVisibility(false);
            }, 5000);
    
            return () => clearTimeout(timeout);
        }

        Bus.addListener('flash', handleFlash)

        return () => {
            Bus.removeListener('flash', handleFlash)
        }
                
    }, [])

    const changeVisibility = () => {
        setVisibility(!visibility)
    }

    return (
        visibility && 
        <div onClick={changeVisibility} className={`alert alert-${type}`}>
            <p>{message}</p>
        </div>
    )
}