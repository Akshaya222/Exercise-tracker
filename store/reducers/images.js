const initialState={
    images:[],
    selectedMeal:{},
    favorites:[]
}

export default (state=initialState,action)=>{
    switch(action.type){
        case "FETCH_IMAGES":
            return {
                ...state,
              images:action.payload
            }
        case "SELECTED_MEAL":
            return {
                ...state,
                selectedMeal:action.payload
            }
        case "FAVORITE_MEALS":
            return {
                ...state,
                favorites:action.payload
            }
        default:
            return state
    }
}