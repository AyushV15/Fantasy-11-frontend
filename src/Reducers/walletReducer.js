const initialstate = {}

const walletReducer = (state = initialstate , action) =>{
    switch (action.type){
        case "SET_WALLET" : {
            return {...state , ...action.payload}
        }
        case "DEBIT_WALLET" : {
            return {...state , amount : state.amount - action.payload}
        }
        default : {
            return {...state}
        }
    }
}

export default walletReducer 
