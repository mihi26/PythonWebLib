import {Button, Card, CardBody, CardHeader, Col, FormGroup, Input, Label, Row} from "reactstrap";
import {useEffect, useState} from "react";
import {ApiService} from "src/services/api";
import {toast} from "react-toastify";
import {useUser} from "src/hooks/useUser";
import {v4} from "uuid";
import {BookCard} from "src/components/Book/BookList";
import {useHistory} from "react-router-dom";

export const UserPage = () => {
  const history = useHistory();
  const initPassword = {
    password: '',
    newPassword: '',
    repeatPassword: ''
  };
  const user = useUser();
  const [passwordForm, setPasswordForm] = useState(initPassword)
  const [name, setName] = useState(user?.name);
  const [books, setBooks] = useState([])

  useEffect(() => {
    ApiService.LikedBookList().then(({data}) => setBooks(data)).catch(console.error);
  }, []);

  const onChangePassword = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value,
    });
  }

  const changePassword = async () => {
    if (passwordForm.newPassword === passwordForm.repeatPassword) {
      try {
        await ApiService.UserUpdate({
          password: passwordForm.password,
          new_password: passwordForm.newPassword
        })
        setPasswordForm(initPassword)
        toast.success("Đổi mật khẩu thành công")
        localStorage.clear();
        history.push('/login')
      } catch (e) {
        toast.error(e?.response?.data?.message || "Đổi mật khẩu khum thành công")
      }
    } else {
      toast.error("Mật khẩu nhập lại không giống")
    }
  }

  const changeName = async () => {
    try {
      await ApiService.UserUpdate({name})
      setPasswordForm(initPassword)
      toast.success("Đổi tên thành công")
      localStorage.clear();
      history.push('/login')
    } catch (e) {
      toast.error(e?.response?.data?.message || "Đổi tên khum thành công")
    }
  }

  return (
    <div>
      <h2>Trang người dùng</h2>
      <Card>
        <CardBody>
          <Card className="mb-3">
            <CardHeader>
              Thông tin cá nhân
            </CardHeader>
            <CardBody>
              <FormGroup>
                <Label>
                  Tên người dùng <span className="text-danger">*</span>
                </Label>
                <Input
                  value={user?.username}
                  type="text"
                  disabled
                />
              </FormGroup>
              <FormGroup>
                <Label>
                  Tên hiển thị <span className="text-danger">*</span>
                </Label>
                <Input
                  name="name"
                  placeholder="Tên hiển thị"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  required
                />
              </FormGroup>
              <Button color="primary" onClick={changeName}>Lưu</Button>
            </CardBody>
          </Card>
          <Card className="mb-3">
            <CardHeader>
              Đổi mật khẩu
            </CardHeader>
            <CardBody>
              <FormGroup>
                <Label>
                  Mật khẩu cũ <span className="text-danger">*</span>
                </Label>
                <Input
                  name="password"
                  placeholder="Nhập mật khẩu cũ"
                  value={passwordForm.password}
                  onChange={onChangePassword}
                  type="password"
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>
                  Mật khẩu mới <span className="text-danger">*</span>
                </Label>
                <Input
                  name="newPassword"
                  placeholder="Nhập mật khẩu mới"
                  value={passwordForm.newPassword}
                  onChange={onChangePassword}
                  type="password"
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>
                  Nhập lại mật khẩu mới <span className="text-danger">*</span>
                </Label>
                <Input
                  name="repeatPassword"
                  placeholder="Nhập lại mật khẩu mới"
                  value={passwordForm.repeatPassword}
                  onChange={onChangePassword}
                  type="password"
                  required
                />
              </FormGroup>
              <Button color="primary" onClick={changePassword}>Đổi mật khẩu</Button>
            </CardBody>
          </Card>
          <Card>
            <CardHeader>
              Sách đã like
            </CardHeader>
            <CardBody>
              <Row>
                {books?.map((book) => (<Col key={v4()} xs={3}>
                  <BookCard book={book} />
                </Col>))}
              </Row>
            </CardBody>
          </Card>
        </CardBody>
      </Card>
    </div>
  );
}
