import styles from "../css/transaction.module.css";
import Navbar from "../components/navbar/navAuth";
import Bg from "../components/background/bg";
import { API } from "../config/api";
import { useQuery } from "react-query";
import convertRupiah from 'rupiah-format'

export default function Transaction() {


  let {data: transaction} = useQuery('transactionData', async () => {
    const response = await API.get('/transaction-admin')
    console.log(response.data.data)
    return response.data.data
  })

  // const fetch = transaction?.map((data) => {
  //   return data.[]})

  return (
    <div>
      <Bg />
      <h1 className={styles.incoT}>Incoming Transaction</h1>
      <div className={styles.transactionTable}>
        <table>
          <tr>
            <th>No</th>
            <th>Users</th>
            <th>Evidence of transfer</th>
            <th>Product Purchased</th>
            <th>Total Payment</th>
            <th>Status Payment</th>
          </tr>
          {transaction?.map((item, index) => (
            <tr key={index}>
            <td>{item.id}</td>
            <td>{item.buyer.name}</td>
            <td>-</td>
            <td>-</td>
            <td>{convertRupiah.convert(item.totalpayment)}</td>
            <td>{item.status}</td>
            </tr>
          ))}
        </table>
        <Navbar />
      </div>
    </div>
  );
}
