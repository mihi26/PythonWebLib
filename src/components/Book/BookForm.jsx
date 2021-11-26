import {useEffect, useRef, useState} from "react";
import {Link, useHistory, useLocation} from "react-router-dom";
import {Button, Card, CardBody, Col, FormGroup, Input, Label, Row, Table} from "reactstrap";
import {ApiService} from "src/services/api";
import {toast} from "react-toastify";
import {v4} from "uuid";
import {client} from "filestack-react";

export const BookForm = () => {
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const bookId = new URLSearchParams(useLocation().search).get('id');
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const [files, setFiles] = useState([]);
  const filesRef = useRef(null);
  const thumbRef = useRef(null);

  const API_KEY = 'AqXzhuJWRTmiYsAGNk3rez';

  const fileClient = client.init(API_KEY);

  const initData = async () => {
    try {
      setCategories((await ApiService.CategoryList()).data);
      setAuthors((await ApiService.AuthorList()).data);
      setLanguages((await ApiService.LanguageList()).data);
      setPublishers((await ApiService.PublisherList()).data);
      if (bookId) {
        const book = (await ApiService.BookDetails(bookId)).data;
        book.category_ids = book?.categories?.map(c => c.id);
        console.log(book);
        setBookValue(book);
      }
    } catch (e) {
      toast.error("Lấy dữ liệu thất bại")
    }
  };

  useEffect(() => {
    initData();
  }, [])

  const [bookValue, setBookValue] = useState({
    name: "",
    description: "",
    pages : 0,
    published_year: "",
    thumb_url: "",
    category_ids: [],
    files: [],
    language_code: null,
    publisher_id: null,
    author_id: null
  });

  const onChange = (e) => {
    setBookValue({
      ...bookValue,
      [e.target.name]: e.target.value,
    });
  }

  const onSubmit = async () => {
    setLoading(true)

    try {
      bookId ? await ApiService.UpdateBook({...bookValue, bookId}) : await ApiService.CreateBook(bookValue);
      toast.success("Lưu sách thành công");
      history.push('/admin/books')
    } catch (e) {
      toast.error("Lưu sách không thành công")
    }
    setLoading(false);
  }

  const onRemove = async () => {
    setLoading(true)
    try {
      await ApiService.DeleteBook(bookId)
      toast.success("Xóa sách thành công");
      history.push('/admin/books')
    } catch (e) {
      toast.error("Xóa sách không thành công")
    }
  }

  const onAddFile = async () => {
    setLoading(true);
    try {
      const newBooks = [];
      for (const file of files) {
        toast.info(`Đang upload file ${file.name}`)
        const res = await fileClient.upload(file);
        const fileCreate = {
          url: res?.url,
          size: res?._file?.size,
          extension: file.name.split('.').reverse()[0],
          book_id: bookId,
        }
        if (bookId) {
          await ApiService.CreateFile(fileCreate);
        }
        newBooks.push(fileCreate)
        toast.info(`Đã upload file ${file.name}`)
      }
      setBookValue({
        ...bookValue,
        files: [...bookValue.files, ...newBooks]
      });
      toast.success(`Up ${files.length} files thành công `);
      setFiles([]);
      filesRef.current.value = '';
    } catch (e) {
      toast.error("Up file không thành công")
    }
    setLoading(false);
  }

  const onDeleteFile = async (fileId, fileLink) => {
    setLoading(true);
    try {
      if (bookId) {
        await ApiService.DeleteFile(fileId)
      }
      setBookValue({
        ...bookValue,
        files: bookValue.files.filter(f => f.url !== fileLink)
      })
      toast.success(`Xóa file thành công `);
    } catch (e) {
      toast.error("Up file không thành công")
    }
    setLoading(false);
  }

  const onChangeThumb = async (e) => {
    setLoading(true);
    try {
      const file = [...e.target.files][0];
      toast.info(`Đang up thumb...`)
      const res = await fileClient.upload(file);

      setBookValue({
        ...bookValue,
        thumb_url: res?.url
      });
      toast.success(`Up thumb thành công `);
    } catch (e) {
      toast.error("Up thumb không thành công")
    }
    setLoading(false);
  }

  return (
    <div>
      <h2>{bookId ? "Chỉnh sửa sách" : "Thêm sách"}</h2>
      <Card>
        <CardBody>
          <FormGroup>
            <Label>
              Tên sách <span className="text-danger">*</span>
            </Label>
            <Input
              name="name"
              placeholder="Nhập tên sách"
              value={bookValue.name}
              onChange={onChange}
              type="text"
            />
          </FormGroup>
          <FormGroup>
            <Label>
              Mô tả
            </Label>
            <Input
              name="description"
              placeholder="Nhập mô tả"
              value={bookValue.description}
              onChange={onChange}
              type="textarea"
            />
          </FormGroup>
          <FormGroup>
            <Label>
              Số trang
            </Label>
            <Input
              name="pages"
              placeholder="Nhập số trang"
              value={bookValue.pages}
              onChange={onChange}
              type="number"
              step="1"
            />
          </FormGroup>
          <FormGroup>
            <Label>
              Năm xuất bản
            </Label>
            <Input
              name="published_year"
              placeholder="Nhập năm xuất bản"
              value={bookValue.published_year}
              onChange={onChange}
              type="number"
            />
          </FormGroup>
          <FormGroup>
            <Label>
              Ảnh mô tả
            </Label>
            <div className="my-3">
              {bookValue.thumb_url &&
              <img src={bookValue.thumb_url} alt="" style={{ maxHeight: 200 }}/>
              }
            </div>
            <input type="file" className="d-none" accept=".png,.jpeg,.jpg" onChange={onChangeThumb} ref={thumbRef}/>
            <Button color="success" onClick={() => thumbRef?.current?.click()} disabled={loading}>Chọn ảnh</Button>

          </FormGroup>
          <FormGroup>
            <Label>
              Tác giả
            </Label>
            <Input
              name="author_id"
              type="select"
              value={bookValue.author_id}
              onChange={onChange}
            >
              <option selected disabled>Chọn tác giả</option>
              {authors?.map(e => <option key={v4()} value={e.id}>{e.name}</option>)}
            </Input>
            <Link className="text-decoration-none" to="/admin/author-form">Tạo tác giả </Link>
          </FormGroup>
          <FormGroup>
            <Label>
              Nhà xuất bản
            </Label>
            <Input
              name="publisher_id"
              type="select"
              value={bookValue.publisher_id}
              onChange={onChange}
            >
              <option selected disabled>Chọn nhà xuất bản</option>
              {publishers?.map(e => <option key={v4()} value={e.id}>{e.name}</option>)}
            </Input>
            <Link className="text-decoration-none" to="/admin/publisher-form">Tạo nhà xuất bản </Link>

          </FormGroup>
          <FormGroup>
            <Label>
              Ngôn ngữ
            </Label>
            <Input
              name="language_code"
              type="select"
              value={bookValue.language_code}
              onChange={onChange}
            >
              <option selected disabled>Chọn ngôn ngữ</option>
              {languages?.map(e => <option key={v4()} value={e.code}>{e.name}</option>)}
            </Input>
            <Link className="text-decoration-none" to="/admin/language-form">Tạo ngôn ngữ </Link>

          </FormGroup>
          <FormGroup>
            <Label>
              Chuyên mục
            </Label>
            <Input
              multiple
              name="category_ids"
              type="select"
              value={bookValue.category_ids}
              onChange={(e) => {
                setBookValue({
                  ...bookValue,
                  category_ids: [...e.target.options].filter(o => o.selected).map(o => Number(o.value))
                });
              }}
            >
              {categories?.map(e => <option key={v4()} value={e.id}>{e.name}</option>)}
            </Input>
            <Link className="text-decoration-none" to="/admin/category-form">Tạo chuyên mục</Link>

          </FormGroup>
          <div className="my-3">
            <h4>Files</h4>
            <div>
              <input multiple type="file" ref={filesRef} onChange={(e) => {
                setFiles([...e.target.files]);
              }}/>
              <Button color="success" className="ml-2" onClick={onAddFile} disabled={loading}>Thêm</Button>
            </div>
            <Table hover striped>
              <thead>
                <tr>
                  <td>
                    Đường dẫn
                  </td>
                  <td>
                    Phần mở rộng
                  </td>
                  <td>
                    Kích thước
                  </td>
                  <td>
                    Hành động
                  </td>
                </tr>
              </thead>
              <tbody>
              {bookValue?.files?.map(e => <tr key={v4()}>
                <td>{e.url}</td>
                <td>{e.extension}</td>
                <td>{e.size / 1024} kB</td>
                <td>
                  <Button color="link" onClick={() => onDeleteFile(e.id, e.url)}><i className="fa fa-trash text-danger" /></Button>
                </td>
              </tr>)}
              </tbody>
            </Table>

          </div>
          <Button type="submit" color="primary" disabled={loading} onClick={onSubmit}>Lưu</Button>
          {bookId && <Button color="danger" className="ms-3" disabled={loading} onClick={onRemove}>Xóa</Button>}
        </CardBody>
      </Card>
    </div>
  );
}
