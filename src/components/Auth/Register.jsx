import React, {useState} from 'react'
import {Button, FormGroup, Input} from "reactstrap";
import {toast} from "react-toastify";
import {ApiService} from "src/services/api";
import {Link, useHistory} from "react-router-dom";

export default function Register() {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const history = useHistory();

    const onRegister = async () => {
        try {
            const {data} = await ApiService.Register({
                username,
                password,
                name,
            })
            console.log(data)
            history.push("/login")
            toast.success("Đăng ký thành công, bạn được chuyển về trang đăng nhập")
        } catch (e) {
            toast.error("Đăng ký không thành công")
        }
    }

    return (
      <div className="container w-50">
          <h3 className="text-center mt-5">Đăng ký</h3>
          <form>
              <FormGroup>
                  <label>Tên đầy đủ</label>
                  <Input type="text"
                         name="name"
                         placeholder="Nhập tên" value={name}
                         onChange={(e) => setName(e.target.value)}
                  />
              </FormGroup>
              <FormGroup>
                  <label>Tên đăng nhập</label>
                  <Input type="text"
                         name="username"
                         placeholder="Nhập tên đăng nhập" value={username}
                         onChange={(e) => setUsername(e.target.value)}
                  />
              </FormGroup>
              <FormGroup>
                  <label>Mật khẩu</label>
                  <Input type="password"
                         placeholder="Nhập mật khẩu" value={password}
                         onChange={(e) => setPassword(e.target.value)}
                  />
              </FormGroup>
              <Button color="primary" className="w-100" onClick={onRegister}>
                  Đăng ký
              </Button>

              <div className="mt-3">
                  <Link to="/login" className="text-decoration-none">Về trang đăng nhập</Link>
              </div>
          </form>
      </div>
    )
}
