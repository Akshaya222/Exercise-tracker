const initialState={
    feedbacks:[]
}

export default (state=initialState,action)=>{
    switch(action.type){
        case "FETCH_FEEDBACKS":
            return {
              feedbacks:action.payload
            }
        default:
            return state
    }
}