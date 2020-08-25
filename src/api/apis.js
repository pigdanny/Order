import axios from 'axios'

//设置服务器地址
axios.defaults.baseURL = 'http://172.16.15.208:5000'

//接口封装
//1.获取商品数据
export var goodslist = () => axios.get('/goods/goods_list')

//2.获取商家
export var shopseller = () => axios.get('/shop/seller')

//3.获取评价数据
export var shopratings = () => axios.get('/shop/ratings')