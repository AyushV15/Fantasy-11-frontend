const initialState = {}

const userReducer = (state = initialState,action) =>{
    switch(action.type){
        case "SET_USER" : {
            return {...state , ...action.payload}
        }
        case "UPDATE_PIC" : {
            console.log(action.payload)
            return {...state , profilePic : action.payload}
        }
        default : {
            return {...state}
        }
    }
}

export default userReducer