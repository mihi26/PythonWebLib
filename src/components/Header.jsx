import React from 'react' ;
import {Link, useHistory} from "react-router-dom";
import {Button} from "reactstrap";
import {toast} from "react-toastify";
import {useUser} from "src/hooks/useUser";

export default function Header() {
  const history = useHistory();
  const user = useUser();
  const logout = () => {
    localStorage.clear();
    toast.info('Logged out');
    history.push('/login');
  }
  return (
    <nav className="navbar navbar-default">
      <div className="container">
        <div className="w-100 d-flex justify-content-between align-items-center">
          <Link className="navbar-brand" to="/">Python</Link>
          <div>
            {user?.is_admin && <Link to="/admin"><Button color="link" className="text-decoration-none">Trang admin</Button></Link>}
            <Link to="/user"><Button color="link" className="text-decoration-none">{user?.name}</Button></Link>
            <Button color="link" className="text-decoration-none" onClick={logout}>Đăng xuất</Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
