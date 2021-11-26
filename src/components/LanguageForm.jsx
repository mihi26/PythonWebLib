import {useEffect, useState} from "react";
import {useHistory, useLocation} from "react-router-dom";
import {Button, Card, CardBody, Col, FormGroup, Input, Label, Row} from "reactstrap";
import {ApiService} from "src/services/api";
import {toast} from "react-toastify";
import {v4} from "uuid";

export const LanguageForm = () => {
  const id = new URLSearchParams(useLocation().search).get('code');
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const [value, setValue] = useState({});

  const initData = async () => {
    try {
      if (id) {
        const value = (await ApiService.LanguageDetails(id)).data;
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
      id ? await ApiService.UpdateLanguage({...value, code: id}) : await ApiService.CreateLanguage(value);
      toast.success("Lưu ngôn ngữ thành công");
      history.goBack()
    } catch (e) {
      toast.error("Lưu ngôn ngữ không thành công")
    }
    setLoading(false);
  }

  const onRemove = async () => {
    setLoading(true)
    try {
      await ApiService.DeleteLanguage(id)
      toast.success("Xóa ngôn ngữ thành công");
      history.goBack()
    } catch (e) {
      toast.error("Xóa ngôn ngữ không thành công")
    }
  }

  return (
    <div>
      <h2>{id ? "Chỉnh sửa ngôn ngữ: " + id : "Thêm ngôn ngữ"}</h2>
      <Card>
        <CardBody>
          <FormGroup>
            <Label>
              Mã ngôn ngữ <span className="text-danger">*</span>
            </Label>
            <Input
              name="code"
              placeholder="Nhập mã ngôn ngữ"
              value={value.code}
              onChange={onChange}
              type="text"
              disabled={id}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>
              Tên ngôn ngữ <span className="text-danger">*</span>
            </Label>
            <Input
              name="name"
              placeholder="Nhập ngôn ngữ "
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
