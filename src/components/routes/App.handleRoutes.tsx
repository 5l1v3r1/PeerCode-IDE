import React from 'react'
import {BrowserRouter as Router , Route , Switch} from 'react-router-dom'
import { Routes } from './routes'
import CodeEditor from '../code_editor/code_editor'
import VideoPage from '../video_chat/navigationToToken'
export default ()=>{
    return(
    <Router>
        <Switch>
            <Route exact path={Routes.editor_page} component={CodeEditor} />
            <Route exact path={Routes.video_page} component={VideoPage} />
        </Switch>
    </Router>
    )
}
