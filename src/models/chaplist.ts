export default {
    namespace: "chaplist",
    state: {
        cLists: [],
    },
    reducers: {
        save(state: any,{payload}){
            return {...state,cLists:payload};
        }
    }
}