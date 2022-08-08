
export default {
    namespace: 'history',
    state: {
      hisList: [],
    },
    reducers: {
      //未收藏
      isHistory:(state: any, { payload }) =>{    
        if(state.hisList.some((item)=>item.id ==payload.id)){
            return { ...state}
        } else{
            state.hisList.push(payload);              
        }
        return { ...state,payload};
      },
      //已收藏，则取消收藏
      unHistory(state:any,{payload}){
        const current=state.hisList.filter(item=>{
            return item.id !==payload
        }) 
        return {
            hisList:current
        }

      }
    },
}