import { useState } from "react"
import axios from "../../Axios/axios"
import { useParams } from "react-router-dom"
import "./CreateContest.css"
import { ToastContainer, toast } from "react-toastify"
import { Form,Button } from "react-bootstrap"
export default function CreateContest(){

    const [initialBreakUp,setInitialBreakup] = useState([{rank : "",prize : ""}])
    const {id} = useParams()
    const [contest,setContest] = useState({
        slots : "",
        totalPrize : "",
        winners : "",
        entryFee : "",
        prizeBreakup : []
    })
 
    const handleSubmit = async (e) =>{
        e.preventDefault()
        const finalBreakup = initialBreakUp.map((ele,i) => {
            return {...ele , rank : i + 1}
        } )
        const formdata = {
            slots : contest.slots,
            totalPrize : contest.totalPrize,
            winners : contest.winners,
            entryFee : contest.entryFee,
            prizeBreakup : finalBreakup
    }
    
    const confirm = window.confirm("confirm")
    console.log(formdata)
    if(confirm){

        try{
            const response = await axios.post(`api/match/${id}/create-contest`,formdata,{
                headers : {
                    Authorization : localStorage.getItem('token')
                }
            })
            console.log(response)
            toast.success("contest created successfully",{
                position : "top-center"
            })
        }catch(e){
            e.response.data.errors.map(ele =>{
                toast.error(ele.msg)
            })
        }
    }
}

    const handleChange = (e) =>{
        if(e.target.name == "slots"){
            setContest({...contest , slots : Number(e.target.value)})
        }
        if(e.target.name == "winners"){
            setContest({...contest , winners : Number(e.target.value)})
        }
        if(e.target.name == "totalPrize"){
            setContest({...contest , totalPrize : Number(e.target.value)})
        }
        if(e.target.name == "entryFee"){
            setContest({...contest , entryFee : Number(e.target.value)})
        }
    }

    const Change = (index,e) =>{
        let data = [...initialBreakUp]
        data[index][e.target.name] = Number(e.target.value)
        setInitialBreakup(data)
    }

    const handleAdd = () =>{
        let field = {rank : "", prize : ""}
        setInitialBreakup([...initialBreakUp,field])
    }

    const handleRemove = (index) =>{
        const newArr = initialBreakUp.filter((ele,i) => i != index)
        setInitialBreakup(newArr)
    }

    
    return(
    
        <div className="create-contest">
            <div className="create-contest-1">
            <h1>Create a Contest</h1>
            <Form onSubmit={handleSubmit}>
                <label>Slots</label><br/>
                <Form.Control type="number" name="slots" placeholder="Slots" value={contest.slots} onChange={handleChange}
                required
                /><br/>
                <label>totalPrize</label><br/>
                <Form.Control type="number" name="totalPrize" placeholder="totalPrize" value={contest.totalPrize} onChange={handleChange}
                required
                /><br/>

                <label>winners</label><br/>
                <Form.Control  type="number" name="winners" placeholder="winners" value={contest.winners} onChange={handleChange}
                required
                /><br/>
                <label>Entry Fee</label><br/>
                <Form.Control  type="number" name="entryFee" placeholder="entry Fees" value={contest.entryFee} onChange={handleChange}
                required
                /><br/>
                <label>Prize Breakup</label>
                {initialBreakUp.map((input,index) =>{
                    return(
                        <div key={index}>
                            <Form.Control required type="number" placeholder={`rank ${index + 1}`} name="rank" value={input.rank} disabled onChange={(e)=>Change(index,e)} />
                            <Form.Control required type="number" placeholder="prize" name="prize" value={input.prize} onChange={(e)=>Change(index,e)} />
                            {index > 0 && <Button variant="danger" onClick={()=>handleRemove(index)}>remove</Button>}
                        </div>
                    )
                })}

                <Button variant="warning" onClick={(e)=>{
                    e.preventDefault()
                    handleAdd()
                    }}>add field</Button> 
                <Button variant="success" type="submit">Submit</Button>
            </Form>
        </div>
        <ToastContainer/>
        </div>
    )
}