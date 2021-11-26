import {Button, Table} from "reactstrap";
import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import {toast} from "react-toastify";
import {v4} from "uuid";

export const List = ({title, getData, columns = [], filterBy = [], formUrl, idField, hideAdd}) => {
  const [data, setData] = useState([]);

  const fetch = async () => {
    try {
      const {data} = await getData();
      console.log(data)
      setData(data)
    } catch (e) {
      toast.error("Lấy dữ liệu thất bại");
    }
  }

  useEffect(() => {
    fetch();
  }, []);

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <h3 className="d-inline">{title}</h3>
        {!hideAdd && <Link to={formUrl}><Button color="primary">Thêm</Button></Link>}
      </div>
      <Table hover striped>
        <thead>
          <tr>
            {columns.map(c => (<th key={v4()}>{c.header}</th>))}
            <th>Sửa</th>
          </tr>
        </thead>
        <tbody>
        {data?.map((row) => (
          <tr key={v4()}>
            {columns.map(c => (<td key={v4()}>{c?.formatter?.(row[c.field]) || row[c.field]}</td>))}
            <td>
              <Link to={`${formUrl}?${idField}=${row[idField]}`}><i className="fa fa-pencil text-primary" /></Link>
            </td>
          </tr>
        ))}
        </tbody>
      </Table>
    </div>
  );
}
