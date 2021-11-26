import React, {useState} from 'react'
import {Button, FormGroup, Input} from "reactstrap";
import {toast} from "react-toastify";
import {ApiService} from "src/services/api";
import {Link, useHistory} from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  const onLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await ApiService.Login({
        username,
        password,
      })
      console.log(data)
      localStorage.setItem("@user", JSON.stringify(data.user))
      localStorage.setItem("@token", data.access_token)
      history.push("/")
      toast.success("Đăng nhập thành công")
    } catch (e) {
      toast.error("Đăng nhập thất bại")
    }
  }

  return (
    <div className="container w-50">
      <h3 className="text-center mt-5">Đăng nhập</h3>
      <form onSubmit={onLogin}>
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
        <Button color="primary" className="w-100" type="submit">
          Đăng nhập
        </Button>
        <div className="text-end mt-3">
          <Link to="/register" className="text-decoration-none">Đến trang đăng kí</Link>
        </div>
      </form>
    </div>
  )
}
