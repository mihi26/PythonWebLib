import React from 'react'
import BookList from 'src/components/Book/BookList';
import BookDetail from 'src/components/Book/BookDetail';
import { Switch, Route } from 'react-router-dom';
import Admin from "src/components/Admin/Admin";
import {UserPage} from "src/components/UserPage";

export default function Body() {
    return (
      <div className="container my-5">
        <Switch>
          <Route exact path="/" component={BookList}/>
          <Route exact path="/book-details" component={BookDetail}/>
          <Route path="/admin" component={Admin}/>
          <Route path="/user" component={UserPage}/>
        </Switch>
      </div>
    )

}
