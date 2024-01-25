import { useFormik } from "formik"
import {string,object,number} from "yup"
import { Container, Image } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import {Button,Form,Col,Row,InputGroup} from "react-bootstrap"
import axios from "../../Axios/axios"
import Swal from "sweetalert2"
import { ToastContainer, toast } from "react-toastify"



export default function Register(){

    const [location,setLocation] = useState(undefined)
    const navigate = useNavigate()
    

    const formValidations = object({
        username : string().min(3).required("username should be atleast 3 characters"),
        mobile : string("mobile should be a number").min(10).max(10).required("mobile is required"),
        email : string().email().required("email is required"),
        password : string().min(8).max(128).required("password must be between 8 to 128 characters"),
    })
    const formik = useFormik({
        initialValues : {
            username : "",
            email : "",
            mobile : "",
            password : ""
        },
        validationSchema : formValidations,
        validateOnChange : false,
        onSubmit : async (values,{resetForm}) =>{
            try{
                const response = await axios.post("api/users/register",values)
                
                resetForm()
                toast.success("registered successfully")
                setTimeout(()=>{
                    navigate("/login")
                },2000)
            }catch(e){
                console.log(e)
                const err = e.response.data.errors
                err.forEach(ele => {
                    toast.error(ele.msg)
                });
            }
        }
    })
    return(
        <div>
        
        <Container fluid>
            <Row >
                <Col md={6} className="bg-image"></Col>
                <Col md={6}>
            <div className="login d-flex align-items-center">
                <Container>
                    <Row>
                        <Col xl={7} className="mx-auto">
                            <Image src="https://fantasy11.s3.ap-south-1.amazonaws.com/Images/Transperant.png" style={{ height: "100px", position: "relative", bottom: "50px" }} />
                            <Form onSubmit={formik.handleSubmit}>
                            <Form.Group className="form-group mb-3">
                                <Form.Control
                                    type="text" placeholder="Username" className="form-control rounded-pill border-0 shadow-sm px-4"
                                    name="username" onChange={formik.handleChange}
                                    isInvalid = {formik.errors.username}
                                    />
                                            <Form.Control.Feedback type="invalid">
                                                {formik.errors.username}
                                            </Form.Control.Feedback>
                                        </Form.Group>
        
                                        <Form.Group className="form-group mb-3">
                                            <Form.Control
                                            type="email" placeholder="Email" className=" rounded-pill border-0 shadow-sm px-4"
                                            name="email" onChange={formik.handleChange}
                                            isInvalid = {formik.errors.email}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {formik.errors.email}
                                            </Form.Control.Feedback>
                                        </Form.Group>
        
                                        <Form.Group className="form-group mb-3">
                                            <Form.Control
                                            type="number" placeholder="Mobile" className="form-control rounded-pill border-0 shadow-sm px-4"
                                            name="mobile" onChange={formik.handleChange}
                                            isInvalid = {formik.errors.mobile}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {formik.errors.mobile}
                                            </Form.Control.Feedback>
                                        </Form.Group>
        
                                        <Form.Group className="form-group mb-3">
                                            <Form.Control
                                            type="password" placeholder="Password" className="form-control rounded-pill border-0 shadow-sm px-4"
                                            name="password" onChange={formik.handleChange}
                                            isInvalid = {formik.errors.password}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {formik.errors.password}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                
                                
                                <Button style={{ backgroundColor: "#7510ff", color: "white" }} type="submit" className="btn btn-block text-uppercase mb-2 rounded-pill shadow-sm">Register</Button>
                                <div className="text-center d-flex justify-content-between mt-4">
                                    <p>Already a Member? <Link to={"/login"}>Login</Link> | <Link to={"/"}>Home</Link></p>
                                </div>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            </div>
        </Col>
    </Row>
</Container>
         
        <ToastContainer/> 
        </div>
        
    )
}


        