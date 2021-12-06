const initialState={
    payments:{},
    pricingPlans:[]
}

export default (state=initialState,action)=>{
    switch(action.type){
        case "FETCH_PAYMENT":
            return {
                ...state,
                payments:action.payload
            }
        case "FETCH_PRICINGPLANS":
            return {
                ...state,
                pricingPlans:action.payload
            }
        default:
            return state
    }
}