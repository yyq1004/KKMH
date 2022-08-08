import React, { FC } from "react";
import { Grid } from 'antd-mobile'
import './list.less'

type ListItem = {
    cover_image_url: string;
    title: string;
}

type ListIProps = Readonly<{
    list: {
        topics: ListItem[];
    }
}>
const List: FC<ListIProps> = (props) => {
    return <div>
        <Grid columns={3} gap={8}>
            {props.list.topics.map(item => {
                return <Grid.Item key={item.title}>
                    <div className="img"><img src={item.cover_image_url}></img></div>
                    <div className="title">{item.title}</div>
                </Grid.Item>        
        })}
         </Grid>
    </div>
}
export default List