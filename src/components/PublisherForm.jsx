import {useEffect, useState} from "react";
import {useHistory, useLocation} from "react-router-dom";
import {Button, Card, CardBody, Col, FormGroup, Input, Label, Row} from "reactstrap";
import {ApiService} from "src/services/api";
import {toast} from "react-toastify";

export const PublisherForm = () => {
  const id = new URLSearchParams(useLocation().search).get('id');
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const [value, setValue] = useState({});

  const initData = async () => {
    try {
      if (id) {
        const value = (await ApiService.PublisherDetails(id)).data;
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
      id ? await ApiService.UpdatePublisher({...value, id}) : await ApiService.CreatePublisher(value);
      toast.success("Lưu nhà xuất bản thành công");
      history.goBack()
    } catch (e) {
      toast.error("Lưu nhà xuất bản không thành công")
    }
    setLoading(false);
  }

  const onRemove = async () => {
    setLoading(true)
    try {
      await ApiService.DeletePublisher(id)
      toast.success("Xóa nhà xuất bản thành công");
      history.goBack()

    } catch (e) {
      toast.error("Xóa nhà xuất bản không thành công")
    }
  }

  return (
    <div>
      <h2>{id ? "Chỉnh sửa nhà xuất bản" : "Thêm nhà xuất bản"}</h2>
      <Card>
        <CardBody>
          <FormGroup>
            <Label>
              Tên nhà xuất bản <span className="text-danger">*</span>
            </Label>
            <Input
              name="name"
              placeholder="Nhập nhà xuất bản"
              value={value.name}
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
