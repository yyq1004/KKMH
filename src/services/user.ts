import { request } from '@umijs/max';

//首页home数据  
export function queryHome() {
    return request("/api/v2/pweb/home")
}

//首页home编辑推荐
export function queryHomeRectopics(){
    return request("/api/v2/pweb/ugc/rec_topics")
}
//首页home最新上架
export function queryHomeTopics(){
    return request("/api/v2/pweb/ugc/topics")
}

//获取排行
export function getcol() {
    return request(`/api/v2/pweb/rank_type_list`)
}
export function getexactrank(id:number) {
    return request(`/api/v2/pweb/rank/topics`,{
        params: { rank_id: id,  },
    })
}

//获取类别
export function getsort() {
    return request(`/api/v1/search/by_tag?since=0&count=24&f=3&tag=0&sort=1&query_category={"update_status":1}`)
}
//根据类别来获取数据
export function searchsort(count:number,tag:number,sort:number,update_status:number) {
    return request(`/api/v1/search/by_tag?since=0&count=${count}&f=3&tag=${tag}&sort=${sort}&query_category={"update_status":${update_status}}`)
}

//获取漫画每一章内容 /v1/graph/pc/feeds/getRecommendFeed?uid=0&webTokenId=1615007958330_FFwnyURnzD0rgO2&since=0&limit=20
export function queryContent(id:string) {
    return request(`/api/v2/pweb/comic/${id}`)
}


export function queryList({pos=6}){
    return request(`/apiv2/pweb/daily/topics?pos=${pos}`)
}


export function queryWorld() {
    return request('/api/v1/graph/pc/feeds/getRecommendFeed?uid=0&webTokenId=1615007958330_FFwnyURnzD0rgO2&since=0&limit=10')
}

// 获取漫画章节
export function getChapter(id: string) {
    return request(`/api/v2/pweb/topic/${id}`);
}

// 获取更新内容
export function getRenew({pos}) {
    return request(`/api/v2/pweb/daily/topics?pos=${pos}`)
}

//登录

export function createlogin(params: any) {
    return request("/api2/login", {
        method: "POST",
        params,
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }
    });
}

export function register(params: any) {
    return request("/api2/register", {
        method: "POST",
        params,
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }
    });
}