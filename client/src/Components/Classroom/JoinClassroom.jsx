import React, { useState} from 'react'
import ClassIcon from '@material-ui/icons/Class';
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import clsx from "clsx";
import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";
import { makeStyles } from "@material-ui/core/styles";
import { Modal, ModalBody} from "reactstrap";
import axios from 'axios';
import { useSelector } from 'react-redux';
import { selectUserData} from '../../reduxSlices/authSlice';

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        marginTop: "10px",
        "& .MuiInputLabel-formControl ": {
            top: "-6px",
            fontSize: "18px",
            color: "gray",
            // fontWeight: 'bold'
        },
        "& .MuiInputBase-input::placeholder": {
            fontSize: "14px",
        },
        "& .MuiFormLabel-filled": {
            backgroundColor: "transaprent !important",
        },
        "& .MuiInputBase-root": {
            paddingBottom: "5px",
        },
        "& .MuiSelect-root": {
            paddingBottom: "0px",
            fontSize: "16px",
        },
        "& > .MuiButtonBase-root": {
            width: "90%",
            marginTop: "20px !important",
        },
    },
    margin: {
        margin: 0,
    },
    withoutLabel: {
        marginTop: theme.spacing(3),
    },
    textField: {
        width: "100%",
    },
}));

const JoinClassroom = (props) => {
    // let regex = "/^[+]?\d+$/";
    const classes = useStyles();
    const [classCode, setClassCode] = useState("");
    const [error,setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const storeData = useSelector(selectUserData);

    const handleSubmit = (e) => {
        e.preventDefault();
        if(classCode.length!=6) {
            setError(true)
            setErrorMessage("Class Code must contain 6 digits")
        }
        else{
            axios.post("https://edeasy-server.herokuapp.com/classes/joinClassroom", {
                userEmail: storeData.userEmail,
                classCode: classCode
            },{ headers: { Authorization: 'Bearer ' + storeData.token } }
            )
            .then((res)=>{
                console.log(res);
                console.log("Created");
                props.setShow(false);
                setClassCode("")
                setError(false);
                setErrorMessage("");
                window.location.reload(false);
                props.setShow(false);
            })
            .catch(err => {
                setError(true);
                console.log(err.response);
                setErrorMessage(err.response.data.message);
            });
        }
    }
    return (
        <>
        <Modal
            className="assignment_modal"
            isOpen={props.isModalOpen}
            toggle={props.toggleModal}
            >
            <ModalBody>

        <div style={{ backgroundColor: "white" }}>
            <div className="container">
                <div className="row justify-content-sm-center"> 
                    <div className="col-12 pb-0">
                        <h1 style={{color:"rgb(90,90,90)"}} className="text-center mb-4 fs-2">Join Classroom</h1>
                        <form onSubmit={handleSubmit}  >
                            <FormControl className={clsx(classes.margin, classes.textField)}>
                                <InputLabel htmlFor="description"></InputLabel>
                                <Input
                                    style={{marginBottom:"10px"}}
                                    placeholder="Enter Class Code"
                                    fullWidth
                                    id="classCode"
                                    type="number"
                                    margin="normal"
                                    required
                                    value={classCode}
                                    onChange={(event)=>setClassCode(event.target.value)}
                
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <ClassIcon />
                                        </InputAdornment>
                                    }
                                    />
                            </FormControl>
                            <FormControl className={clsx(classes.margin, classes.textField)}>
                                {error && <div className='error-msg text-danger'>{errorMessage}</div>}
                            </FormControl>
                            
                            {error ? 
                                <button type="submit" style={{display:"flex",justifyContent:"center"}} className="m-auto mt-2 form-btn disabled">Join</button> :
                                <button type="submit" style={{display:"flex",justifyContent:"center"}} className="m-auto mt-2 form-btn">Join</button>
                            }
                            
                        </form>
                    </div>
                </div>
            </div>
        </div >
            </ModalBody>
            </Modal>
        </>
    )
}

export default JoinClassroom
