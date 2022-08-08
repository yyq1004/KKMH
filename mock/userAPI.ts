const users = [
  { username:'Umi', password: 'MALE' },
  { username:'Fish', password: 'FEMALE' },
];

export default {
  'GET /v1/queryUserList': (req: any, res: any) => {
    res.json({
      success: true,
      data: { list: users },
      errorCode: 0,
    });
  },
  'POST /login': (req: any, res: any) => {
    const {username,password}=req.query; 
    let find = users.find(item=>(item.username == username && item.password == password)) 
    if(find){
        res.json({
            status:200,
            token:"enjsiuskfhdkcisn.32skjdjsdhdshfcs.dskhsdjbjdsbsbhfhs",
            nick:username
        })
    }else{
        res.json({
            status:400,
            msg:"用户名密码错误"
        })
    }
  },
  'POST /register': (req: any, res: any) => {
    const {username,password}=req.query; 
    let find = users.find(item=>item.username == username);
    if(find){
        res.json({
            status:400,
            msg:"该用户名已存在"           
        })
    }else{
      users.push(req.query);
      res.json({
          status:200,
          msg:"注册成功"
      })
    }
  },
};
