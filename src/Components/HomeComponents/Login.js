import "./Login.css"
import { Form,Button, Container, Image ,Row,Col } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import axios from "../../Axios/axios"
import { useFormik } from "formik"
import { string,object } from "yup"
import { toast ,ToastContainer} from "react-toastify"

export default function Login(){

    const navigate = useNavigate()

    const formValidations = object({
        email : string().email().required("email is required"),
        password : string().min(8).max(128).required("password must be between 8 to 128 characters"),
    })
    const formik = useFormik({
        initialValues : {
            email : "",
            password : ""
        },
        validationSchema : formValidations,
        validateOnChange : false,
        onSubmit : async (values,{resetForm}) =>{
            try{
                const response = await axios.post("api/users/login",values)
                const token = response.data.token
                console.log(response)
                resetForm()
                localStorage.setItem('token',token)
                navigate('/dashboard')
            }catch(e){
                console.log(e.response.data)
                toast.error(e.response.data)
            }
        }

    })

    return(
        <div>
            <Container fluid>
                <Row>
                <Col md={6} className="bg-image"></Col>
                
                <Col md = {6}>
                    <div className="login d-flex align-items-center"> 
                        <Container>
                            <Row>
                                <Col xl={7} className="mx-auto">
                                <Image src="https://fantasy11.s3.ap-south-1.amazonaws.com/Images/Transperant.png" style={{ height: "100px", position: "relative", bottom: "50px" }} />
                                <Form onSubmit = {formik.handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Control
                                    type="text" placeholder="Email" className="rounded-pill border-0 shadow-sm px-4"
                                    name="email" onChange={formik.handleChange}
                                    isInvalid = {formik.errors.email}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                                {formik.errors.email}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Control
                                    type="password" placeholder="Password" className="rounded-pill border-0 shadow-sm px-4"
                                    name="password" onChange={formik.handleChange}
                                    isInvalid = {formik.errors.password}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                                {formik.errors.password}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Button style={{ backgroundColor: "#7510ff", color: "white" }} type="submit" className=" text-uppercase mb-2 rounded-pill shadow-sm">Login</Button>

                                <div className="text-center d-flex justify-content-between mt-4">
                                    <p>Not a Member? <Link to={"/Register"}>Register</Link> | <Link to={"/"}>Home</Link> | <Link to={"/forgot-password"}>Forgot Password</Link></p>
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
