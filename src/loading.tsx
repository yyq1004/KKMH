import { FC } from "react";
import styles from '@/pages/rank/index.less'
const Loading:FC = ()=>{
    return  <><div className={styles.fulfillingbouncingcirclespinner}>
    <div className={styles.circle}></div>
    <div className={styles.orbit}></div>

  </div>
      <h2 className={styles.loadingtips}>加载中，请稍后</h2></>
   }


export default Loading