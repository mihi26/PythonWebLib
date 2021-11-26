import React from 'react'
import {Col, ListGroup, ListGroupItem, Row} from "reactstrap";
import {Link, Redirect, Route, Switch} from "react-router-dom";
import {ApiService} from "src/services/api";
import {List} from "src/components/List";
import {BookForm} from "src/components/Book/BookForm";
import {v4} from "uuid";
import {CategoryForm} from "src/components/CategoryForm";
import {AuthorForm} from "src/components/AuthorForm";
import {PublisherForm} from "src/components/PublisherForm";
import {LanguageForm} from "src/components/LanguageForm";
import {UserForm} from "src/components/UserForm";

const MENU = [
  { title: 'Sách', link: '/admin/books' },
  { title: 'Chuyên mục', link: '/admin/categories' },
  { title: 'Tác giả', link: '/admin/authors' },
  { title: 'Nhà xuất bản', link: '/admin/publishers' },
  { title: 'Ngôn ngữ', link: '/admin/languages' },
  { title: 'Người dùng', link: '/admin/users' },
]

const BOOK_PROPS = {
  title: "Sách",
  getData: ApiService.BookList,
  columns: [
    { header: 'ID', field: 'id' },
    { header: 'Tên', field: 'name' },
    { header: 'Số trang', field: 'pages' },
    { header: 'Xuất bản năm', field: 'published_year' },

  ],
  filterBy: ['name'],
  formUrl: '/admin/book-form',
  idField: 'id'
}

const CATEGORY_PROPS = {
  title: "Chuyên mục",
  getData: ApiService.CategoryList,
  columns: [
    { header: 'ID', field: 'id' },
    { header: 'Tên', field: 'name' },
  ],
  filterBy: ['name'],
  formUrl: '/admin/category-form',
  idField: 'id'
}

const AUTHOR_PROPS = {
  title: "Tác giả",
  getData: ApiService.AuthorList,
  columns: [
    { header: 'ID', field: 'id' },
    { header: 'Tên', field: 'name' },
    { header: 'Nước', field: 'nationality' },
  ],
  filterBy: ['name'],
  formUrl: '/admin/author-form',
  idField: 'id'
}

const PUBLISHER_PROPS = {
  title: "Nhà xuất bản",
  getData: ApiService.PublisherList,
  columns: [
    { header: 'ID', field: 'id' },
    { header: 'Tên', field: 'name' },
  ],
  filterBy: ['name'],
  formUrl: '/admin/publisher-form',
  idField: 'id'
}


const LANGUAGE_PROPS = {
  title: "Ngôn ngữ",
  getData: ApiService.LanguageList,
  columns: [
    { header: 'Code', field: 'code' },
    { header: 'Tên', field: 'name' },
  ],
  filterBy: ['name'],
  formUrl: '/admin/language-form',
  idField: 'code'
}

const USER_PROPS = {
  title: "Người dùng",
  getData: ApiService.UserList,
  columns: [
    { header: 'ID', field: 'id' },
    { header: 'Username', field: 'username' },
    { header: 'Tên', field: 'name' },
    { header: 'Is Admin', field: 'is_admin', formatter: (x) => x ? "Yes" : "No" },
  ],
  filterBy: ['name'],
  formUrl: '/admin/user-form',
  idField: 'id',
  hideAdd: true
}

export default function Admin() {

  return (
    <Row>
      <Col xs={12} className="mb-3">
        <h3>Trang quản trị</h3>
      </Col>
      <Col xs={2}>
        <ListGroup>
          {MENU.map(e => (
            <ListGroupItem key={v4()}>
              <Link to={e.link} className="text-decoration-none">
                {e.title}
              </Link>
            </ListGroupItem>
          ))}
        </ListGroup>
      </Col>
      <Col xs={10}>
        <Switch>
          <Route exact path="/admin" component={() => <Redirect to="/admin/books" />}/>
          <Route path="/admin/books" exact component={() => <List {...BOOK_PROPS}/>}/>
          <Route path="/admin/book-form" exact component={BookForm}/>
          <Route path="/admin/author-form" exact component={AuthorForm}/>
          <Route path="/admin/categories" exact component={() => <List {...CATEGORY_PROPS}/>}/>
          <Route path="/admin/category-form" exact component={CategoryForm}/>
          <Route path="/admin/language-form" exact component={LanguageForm}/>
          <Route path="/admin/publisher-form" exact component={PublisherForm}/>
          <Route path="/admin/authors" exact component={() => <List {...AUTHOR_PROPS}/>}/>
          <Route path="/admin/publishers" exact component={() => <List {...PUBLISHER_PROPS}/>}/>
          <Route path="/admin/languages" exact component={() => <List {...LANGUAGE_PROPS}/>}/>
          <Route path="/admin/users" exact component={() => <List {...USER_PROPS}/>}/>
          <Route path="/admin/user-form" exact component={UserForm}/>
        </Switch>
      </Col>
    </Row>
  )
}
