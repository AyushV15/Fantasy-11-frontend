
const initialState = []

const notificationReducer = (state = initialState , action) =>{
    switch(action.type){
        case "SET_NOTIFICATIONS" : {
            return [...action.payload]
        }
        case "CLEAR_NOTIFICATIONS" : {
            return []
        }
        default : {
            return [...state]
        }
    }
}

export default notificationReducer

