
export default {
    namespace: "evaluate",
    state: {
        elist: [],
    },
    reducers: {
        save(state: any, {payload}) {              
            state.elist.push(payload.values) ;            
            return{...state};
        }
    }
}
