
export default {
    namespace: 'collect',
    state: {
      list: [],
    },
    reducers: {
      //未收藏
      isCollect:(state: any, { payload }) =>{          
        state.list.push(payload);  
        return { ...state,payload};
      },
      //已收藏，则取消收藏
      unCollect(state:any,{payload}){
        const current=state.list.filter(item=>{
            return item.id !==payload
        }) 
        return {
          list:current
        }

      }
    },
}