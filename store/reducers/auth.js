const initialState={
    token:null,
    userId:null,
    showProfile:false,
    userObj:{},
    allUsers:[]
}

export default (state=initialState,action)=>{
    switch(action.type){
        case "AUTHENTICATE":
            return {
                token:action.token,
                userId:action.userId
            }
        case "PROFILE":
            return {...state,showProfile:!state.showProfile}
        case "LOGOUT":
            return initialState
        case "FETCH_USER":
            return {
                ...state,userObj:action.payload
            }
        case "FETCH_ALL_USERS":
            return {
                ...state,allUsers:action.payload
            }
        default:
            return state
    }
}