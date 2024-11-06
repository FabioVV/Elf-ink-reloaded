import React from 'react'
import {createRoot} from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom';

import App from './App'

import './static/css/task.css'
import './static/css/flash.css'
import './static/css/default.css'
import './static/css/menu.css'
import './static/css/simple.css'
import './static/css/fontawesome/fontawesome.css'
import './static/css/fontawesome/solid.css'

const container = document.getElementById('root')
const root = createRoot(container)

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </React.StrictMode>
)