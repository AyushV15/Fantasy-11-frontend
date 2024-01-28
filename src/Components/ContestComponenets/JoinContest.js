import { useState } from "react";
import { Button, Modal,Table } from "react-bootstrap";
import axios from "../../Axios/axios";
import { useDispatch, useSelector } from "react-redux";
import { debitWallet } from "../../Actions/walletAction";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { toast, ToastContainer} from "react-toastify";
import { getStartUser } from "../../Actions/userAction";

export default function JoinContest({closeModal,ele,team,fetchContest}){

    const [modal,setModal] = useState(true)
    const dispatch = useDispatch()

    const wallet = useSelector(state =>{
        return state.wallet
    })

    const handleClick = async (team) => {

        if(wallet.amount < ele.entryFee){
            Swal.fire({
                imageUrl : "https://fantasy11.s3.ap-south-1.amazonaws.com/Images/EmptyWallet.webp",
                imageHeight : 200,
                title: "Low Wallet Balance",
                html: `
                    <a href="/dashboard">Add money</a>
                `,
              })
        }else{
                    try{
                        const formdata = {entryFee : ele.entryFee, team : team}
                        const response = await axios.put(`api/contest/${ele._id}`,formdata,{
                            headers : {
                                Authorization : localStorage.getItem('token')
                            }
                        })
                        closeModal()
                        fetchContest()
                        console.log(response)
                        toast.success("contest joined successfully")
                        dispatch(debitWallet(response.data.entryFee))
                            
                    }catch(e){
                        console.log(e)
                    }
        }
    }

    return(
        <div>
            <Modal show = {modal} onHide={()=>{
                setModal(false)
                closeModal()
                }}>
                <Modal.Header closeButton>Confirmation</Modal.Header>
                <Modal.Body>
                    <Table>
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Prize</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ele.prizeBreakup.map(ele =>{
                                return(
                                    <tr>
                                        <td>{ele.rank}</td>
                                        <td>{ele.prize}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={()=>handleClick(team)}>Pay {ele.entryFee}</Button>
                </Modal.Footer>
            </Modal>
            <ToastContainer/>
        </div>
    )
}