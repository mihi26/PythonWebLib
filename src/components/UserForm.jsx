import {useEffect, useState} from "react";
import {useHistory, useLocation} from "react-router-dom";
import {Button, Card, CardBody, Col, FormGroup, Input, Label, Row} from "reactstrap";
import {ApiService} from "src/services/api";
import {toast} from "react-toastify";
import {v4} from "uuid";

export const UserForm = () => {
  const id = new URLSearchParams(useLocation().search).get('id');
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const [value, setValue] = useState({
    name: "",
    username: "",
    is_admin: 1,
  });

  const initData = async () => {
    try {
      if (id) {
        const value = (await ApiService.UserDetails(id)).data;
        setValue(value);
      }
    } catch (e) {
      toast.error("Lấy dữ liệu thất bại")
    }
  };

  useEffect(() => {
    if (!id) {
      history.push('/admin/users')
    }
    initData();
  }, [])

  useEffect(() => {
    console.log(value)
  }, [value])

  const onChange = (e) => {
    setValue({
      ...value,
      [e.target.name]: e.target.value,
    });
  }

  const onSubmit = async () => {
    setLoading(true)

    try {
      await ApiService.UpdateUser({...value, id})
      toast.success("Lưu người dùng thành công");
      history.push('/admin/users')
    } catch (e) {
      toast.error("Lưu người dùng không thành công")
    }
    setLoading(false);
  }

  return (
    <div>
      <h2>Chỉnh sửa người dùng</h2>
      <Card>
        <CardBody>
          <FormGroup>
            <Label>
              Tên người dùng <span className="text-danger">*</span>
            </Label>
            <Input
              name="name"
              placeholder="Nhập tên tác giả"
              value={value.name}
              onChange={onChange}
              type="text"
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>
              Tên hiển thị <span className="text-danger">*</span>
            </Label>
            <Input
              name="username"
              placeholder="Nhập tên hiển thị"
              value={value.username}
              onChange={onChange}
              type="text"
              required
            />
          </FormGroup>
          <FormGroup>
            <Input
              name="is_admin"
              checked={Boolean(value.is_admin)}
              onChange={() => setValue({...value, is_admin: value.is_admin ? 0 : 1})}
              type="checkbox"
            />
            <Label className="ms-2">
              Is admin
            </Label>
          </FormGroup>
          <Button type="submit" color="primary" disabled={loading} onClick={onSubmit}>Lưu</Button>
        </CardBody>
      </Card>
    </div>
  );
}
