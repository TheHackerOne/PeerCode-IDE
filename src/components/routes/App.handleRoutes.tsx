import React from 'react'
import {BrowserRouter as Router , Route , Switch} from 'react-router-dom'
import { Routes } from './routes'
import CodeEditor from '../code_editor/code_editor'
import HomePage from '../user_auth/ClientUI'

export default ()=>{
    return(
    <Router>
        <Switch>
            <Route exact path={Routes.editor_page} component={CodeEditor} />
            <Route exact path={Routes.home_page} component={HomePage} />
        </Switch>
    </Router>
    )
}
