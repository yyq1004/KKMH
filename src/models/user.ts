export default {
    namespace: 'user',
    state: {
      user:{
        token:"",
        nick:""
      }
    },
    reducers: {
      setLogin:(state: any, { payload }) =>{     
        return { user:payload};
      },
      outLogin:(state: any, { payload })=>{
        return {
          user:{
            token:"",
            nick:""
          }
        }
      }
        
    },
}