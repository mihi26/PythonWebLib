import {useEffect, useState} from "react";
import {useHistory, useLocation} from "react-router-dom";
import {Button, Card, CardBody, Col, FormGroup, Input, Label, Row} from "reactstrap";
import {ApiService} from "src/services/api";
import {toast} from "react-toastify";
import {v4} from "uuid";

export const AuthorForm = () => {
  const id = new URLSearchParams(useLocation().search).get('id');
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const [value, setValue] = useState({});

  const initData = async () => {
    try {
      if (id) {
        const value = (await ApiService.AuthorDetails(id)).data;
        setValue(value);
      }
    } catch (e) {
      toast.error("Lấy dữ liệu thất bại")
    }
  };

  useEffect(() => {
    initData();
  }, [])

  const onChange = (e) => {
    setValue({
      ...value,
      [e.target.name]: e.target.value,
    });
  }

  const onSubmit = async () => {
    setLoading(true)

    try {
      id ? await ApiService.UpdateAuthor({...value, id}) : await ApiService.CreateAuthor(value);
      toast.success("Lưu tác giả thành công");
      history.goBack()
    } catch (e) {
      toast.error("Lưu tác giả không thành công")
    }
    setLoading(false);
  }

  const onRemove = async () => {
    setLoading(true)
    try {
      await ApiService.DeleteAuthor(id)
      toast.success("Xóa tác giả thành công");
      history.goBack()
    } catch (e) {
      toast.error("Xóa tác giả không thành công")
    }
  }

  return (
    <div>
      <h2>{id ? "Chỉnh sửa tác giả" : "Thêm tác giả"}</h2>
      <Card>
        <CardBody>
          <FormGroup>
            <Label>
              Tên tác giả <span className="text-danger">*</span>
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
              Nước
            </Label>
            <Input
              name="nationality"
              placeholder="Nhập tên nước"
              value={value.nationality}
              onChange={onChange}
              type="text"
              required
            />
          </FormGroup>
          <Button type="submit" color="primary" disabled={loading} onClick={onSubmit}>Lưu</Button>
          {id && <Button color="danger" className="ms-3" disabled={loading} onClick={onRemove}>Xóa</Button>}
        </CardBody>
      </Card>
    </div>
  );
}
