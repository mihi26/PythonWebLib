import React, {useEffect, useState} from 'react'
import "src/assets/css/grid.css"
import "src/assets/css/bookdetails.css"
import {Button, Col, Input, ListGroup, ListGroupItem, Row} from "reactstrap";
import {Link, useLocation} from "react-router-dom";
import {ApiService} from "src/services/api";
import {toast} from "react-toastify";
import {useUser} from "src/hooks/useUser";
import {v4} from "uuid";

const ACTION_TYPE = {
  LIKE: "LIKE",
  COMMENT: "COMMENT",
  DOWNLOAD: "DOWNLOAD",
}

export default function BookDetail() {
  const user = useUser();
  const [book, setBook] = useState(null);
  const [downloadVisible, setDownloadVisible] = useState(false);
  const bookId = new URLSearchParams(useLocation().search).get('id');
  const [comment, setComment] = useState("");

  useEffect(() => {
    getBookDetails()
  }, []);

  const getBookDetails = async () => {
    try {
      const {data} = await ApiService.BookDetails(bookId);
      console.log(data)
      setBook(data)
    } catch (e) {
      toast.error("Lấy dữ liệu thất bại");
    }
  }

  const onLike = async () => {
    try {
      await ApiService.DoAction(bookId, ACTION_TYPE.LIKE, null, book?.is_liked ? 1 : null);
      toast.success((book?.is_liked ? "Unlike" : "Like") + " thành công");
      getBookDetails()
    } catch (e) {
      toast.error((book?.is_liked ? "Unlike" : "Like") + " không thành công");
    }
  }

  const onComment = async (e) => {
    e.preventDefault();
    setComment('')

    try {
      if (comment) {
        await ApiService.DoAction(bookId, ACTION_TYPE.COMMENT, comment);
        getBookDetails()
      }
    } catch (e) {
      toast.error("Comment không thành công");
    }
  }

  const onDownload = () => ApiService.DoAction(bookId, ACTION_TYPE.DOWNLOAD)
    .then(getBookDetails)
    .catch(console.error);

  const removeComment = async (id) => {
    try {
      await ApiService.DoAction(bookId, ACTION_TYPE.COMMENT, null, id);
      getBookDetails()
    } catch (e) {
      toast.error("Xóa comment không thành công");
    }
  }


  return (
    <Row className="mt-5">
      <Col xs={4}>
        <img src={book?.thumb_url} className="w-100"/>
        <div className="mt-3">
          <Button color={book?.is_liked ? "danger" : "success"} onClick={onLike}>
            {book?.is_liked ? "Unlike" : "Like"} ({book?.like_count})
          </Button>
          <Button color="primary" className="ms-3" onClick={() => setDownloadVisible(!downloadVisible)}>Download ({book?.download_count})</Button>
          {user?.is_admin && <Link to={`/admin/book-form?id=${bookId}`}><Button color="primary" className="ms-3" >Sửa sách</Button></Link>}
        </div>
        {downloadVisible && <div className="mt-3">
          <ListGroup>
            {book?.files?.map(e => (
              <ListGroupItem key={v4()}>
                <a href={e.url} className="text-decoration-none" download target="_blank" onClick={onDownload}>
                  <i className="fa fa-download me-2"/>
                </a>
                {e.extension} ({(e.size / 1000).toFixed(1)} kB)
              </ListGroupItem>
            ))}
          </ListGroup>
        </div>
        }
      </Col>
      <Col xs={8}>
        <h2>{book?.name}</h2>
        <h5>Author: <span className="text-primary">{book?.author?.name}</span></h5>
        <p className="small">
          {book?.description?.split("\n")?.map((e) => (<>{e}<br /></>))}
        </p>
        <Row className="mt-3">
          <Col xs={2}>
            Số trang
          </Col>
          <Col xs={10} className="text-secondary">
            {book?.pages}
          </Col>
          <Col xs={2}>
            Ngôn ngữ
          </Col>
          <Col xs={10} className="text-secondary">
            {book?.language?.name}
          </Col>
          <Col xs={2}>
            Chuyên mục
          </Col>
          <Col xs={10} className="text-secondary">
            {book?.categories?.map((category, i) => (
              <>{i > 0 && ', '}<Link className="text-decoration-none" to={`/?categoryId=${category.id}`}>{category.name}</Link>
              </>
            ))}
          </Col>
          <Col xs={2}>
            Nhà xuất bản
          </Col>
          <Col xs={4} className="text-secondary">
            {book?.publisher?.name}
          </Col>
          <Col xs={2}>
            Năm xuất bản
          </Col>
          <Col xs={4} className="text-secondary">
            {book?.published_year}
          </Col>
          <Col xs={12} className="mt-3">
            <h4>Bình luận</h4>
            <form onSubmit={onComment}>
              <Input type="text" placeholder="Nhập bình luận.." value={comment} onChange={(e) => setComment(e.target.value)}/>
            </form>

            <div className="my-3">
              <ListGroup flush>
                {book?.comments?.map((comment) => (
                  <ListGroupItem key={v4()} className="d-flex justify-content-between">
                    <span>
                      <span className="text-primary">{comment.name}</span>: {comment.description}
                    </span>
                    {user?.id === comment?.user_id && <a onClick={() => removeComment(comment.id)} ><i className="fa fa-trash text-danger"/></a> }
                  </ListGroupItem>
                ))}
              </ListGroup>
            </div>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}
