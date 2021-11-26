import React, {useEffect, useMemo, useState} from 'react'
import 'src/assets/css/grid.css';
import {Button, Card, CardBody, CardImg, CardSubtitle, CardTitle, Col, Input, InputGroup, Row} from "reactstrap";
import {Link, useLocation} from "react-router-dom";
import {toast} from "react-toastify";
import {ApiService} from "src/services/api";
import {useUser} from "src/hooks/useUser";
import {v4} from "uuid";

export default function BookList() {
  const user = useUser()
  const location = useLocation()

  const [bookList, setBookList] = useState([])
  const [text, setText] = useState("")
  const [categories, setCategories] = useState([]);

  const getBookList = async () => {
    try {
      const {data} = (await ApiService.BookList());
      console.log(data)
      setBookList(data)
    } catch (e) {
      toast.error("Lấy dữ liệu thất bại");
    }
  }

  const categoryId = useMemo(() => new URLSearchParams(location.search).get('categoryId'), [location.search]);


  useEffect(() => {
    ApiService.CategoryList().then(({data}) => setCategories(data));

    getBookList();
  }, [])

  const filteredBook = useMemo(() => bookList?.filter(
      e => (
        (!categoryId || e.category_ids.split(",").includes(categoryId)) &&
        (e?.name?.toLowerCase().includes(text.toLowerCase())
        || e?.author_name?.toLowerCase().includes(text.toLowerCase()))
      )
    ),
    [bookList, text, categoryId]
  )

  return (
    <>
      <h3>
        Book List {categoryId && `: Chuyên mục ${categories?.find(e => e.id === Number(categoryId))?.name}`}
      </h3>
      {user?.is_admin && <Link to="/admin/book-form"><Button className="mb-3" color="primary">Thêm sách</Button></Link>}
      <InputGroup>
        <Input placeholder="Tìm kiếm theo tên sách, tên tác giả.." value={text} onChange={(e) => setText(e.target.value)} />
        <Button color="primary">
          Tìm kiếm
        </Button>
      </InputGroup>
      <Row className="mt-3">
        {filteredBook?.map((book) => (<Col key={v4()} xs={3}>
          <BookCard book={book} />
        </Col>))}
      </Row>
    </>
  );
}

export const BookCard = ({book}) => (<Card>
  <CardImg
    alt="Card image cap"
    src={book.thumb_url}
    top
    width="100%"
  />
  <CardBody>
    <CardTitle tag="h5">
      <Link to={`/book-details?id=${book.id}`} className="text-decoration-none">{book.name}</Link>
    </CardTitle>
    <CardSubtitle>
      {book.author_name}
    </CardSubtitle>
    <div className="small">
      <span>Chuyên mục: </span>
      <span>{book.category_name}</span>
    </div>
  </CardBody>
</Card>);


