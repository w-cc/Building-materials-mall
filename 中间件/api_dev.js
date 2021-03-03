var express = require('express');
var app = express();
// 引入mongodb模块，获取他的客户端对象
var MongoClient = require('mongodb').MongoClient
// mongodb连接字符串  //这个要复制要不容易写错
var DB_CONN_STR = 'mongodb://127.0.0.1:27017/'
// MongoClient.connect('mongodb://localhost/proShopCart', { useNewUrlParser: true, useUnifiedTopology: true });

//设置响应头  设置允许跨域
app.all('*', function (req, res, next) {
    // res.header('Access-Control-Allow-Origin', '*')
    // res.header('Access-Control-Allow-Methods', 'PUT,GET,POST,DELETE,OPTIONS')//允许访问的方式
    // res.header('Access-Control-Allow-Headers', 'X-Requested-With')
    // res.header("X-Powered-By", ' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Method", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Max-Age", "3600");
    next();

})
// 用来零时的存数据
// var _xxObj = null;
var _xxObj = {
    arrs: [{
        id: 'n1',
        name: 'a_name',
        vals: 'aaa'
    }, {
        id: 'n2',
        name: 'b_name',
        vals: 'bbb'
    }, {
        id: 'n3',
        name: 'c_name',
        vals: 'ccc'
    }]
}
// 保存过滤的结果，因为现在没有db
var _filterResult = null;
// 过滤方法
function filter(_val) {
    return _xxObj.arrs.filter(_g => {
        return _g.vals === _val
    })
}

// 第一个nodejs接口
app.get('/node_a', function (req, res) {
    console.log(req.query.v_data)
    let _result = filter(req.query.v_data)
    _filterResult = _result.length !== 0 ? _result : [{ id: 'xxx', name: '没有结果' }]
    res.end()
})
// 第二个nodejs接口
app.get('/node_b', function (req, res) {
    res.send(_filterResult)
})
// 用户注册信息
app.post('/register_post', function (req, res) {
    let _allData = '';
    req.on('data', function (_d) {
        _allData += _d;
    })
    req.on('end', function (_d) {
        console.log(_allData);
        let _registertMsg = JSON.parse(_allData)

        // 在注门新用户之前,先查询,有没有同名
        findSameNameFn(_registertMsg, res)


    })
    // console.log(req.body);
})
// 查询注册同名信息
function findSameNameFn(_registertMsg, res) {
    MongoClient.connect(DB_CONN_STR, function (err, db) {
        // 数据库名：proShopCart
        var _dbo = db.db('proShopCart')
        // 集合名：userInfo
        var _collection = _dbo.collection('userInfo')
        _collection.findOne({ "username": _registertMsg.username }, {}, function (err, result) {
            if (err) throw err;

            if (result === null) {
                // console.log('没有同名');
                insertNewUserName(_registertMsg, res)
            } else if (result.username === _registertMsg.username) {
                // console.log('名字相同');
                res.send({
                    regInfo: '用户名已存在！',
                    reg_code: 2
                })
            }
            db.close()

        })
    })
}
// 插入新用户注册的数据
function insertNewUserName(_registertMsg, res) {
    MongoClient.connect(DB_CONN_STR, function (err, db) {
        // 数据库名：proShopCart
        var _dbo = db.db('proShopCart')
        // 集合名：userInfo
        var _collection = _dbo.collection('userInfo')
        _collection.insertOne(_registertMsg, function (err, result) {
            if (err) throw err;
            console.log('注册成功');
            res.send({
                regInfo: '注册成功！',
                reg_code: 1
            })
            db.close()
        })
    })
}
// 登录功能
app.post("/userLogin_post", function (req, res) {
    var _loginData = ''
    req.on('data', function (_d) {
        _loginData += _d;
    })
    req.on('end', function (_d) {
        // console.log(JSON.parse(_loginData));
        let _temp = JSON.parse(_loginData)
        MongoClient.connect(DB_CONN_STR, function (err, db) {
            // 数据库名：proShopCart
            var _dbo = db.db('proShopCart')
            // 集合名：userInfo
            var _collection = _dbo.collection('userInfo')
            _collection.findOne({ "username": _temp.U }, {}, function (err, result) {
                if (err) throw err;
                if (result === null) {
                    console.log('用户不存在');
                    return res.send({
                        regInfo: '用户不存在',
                        reg_code: 4
                    })
                } else if (_temp.P !== result.password) {
                    console.log('密码不对');
                    return res.send({
                        regInfo: '密码不对',
                        reg_code: 5
                    })
                } else if (result !== null && _temp.P == result.password) {
                    console.log('登录成功');
                    return res.send({
                        regInfo: result,
                        reg_code: 3
                    })
                }


                db.close()
            })
        })



    })
})
// 批量录入商品
app.post('/insertGoods', function (req, res) {
    var _dataObj = '';
    req.on('data', function (_d) {
        _dataObj += _d;
    })
    req.on('end', function (_d) {
        console.log(_dataObj);
        let _insterGoodsArrObj = JSON.parse(_dataObj)
        // console.log(_insterGoodsArrObj);
        MongoClient.connect(DB_CONN_STR, function (err, db) {
            // 数据库名：proShopCart
            var _dbo = db.db('proShopCart')
            // 商品栏目集合的名：goodsCategory
            var _collection = _dbo.collection('goodsCategory')
            _collection.insertMany(_insterGoodsArrObj, function (err, result) {
                if (err) throw err;

                res.send({
                    regInfo: '商品录入成功',
                    reg_code: 5
                })
                db.close()
            })
        })

    })
})
// 获得商品列表
app.get('/getGoodsCategory', function (req, res) {
    MongoClient.connect(DB_CONN_STR, function (err, db) {
        // 数据库名：proShopCart
        var _dbo = db.db('proShopCart')
        // 商品栏目集合的名：goodsCategory
        var _collection = _dbo.collection('goodsCategory')
        _collection.aggregate([{
            $lookup: {
                localField: 'd',
                from: 'goodsList_a',
                foreignField: 'category',
                as: 'goodsList_aa'
            }
        }, {
            $lookup: {
                localField: 'd',
                from: 'goodsList_b',
                foreignField: 'category',
                as: 'goodsList_bb'
            }
        }, {
            $lookup: {
                localField: 'd',
                from: 'goodsList_c',
                foreignField: 'category',
                as: 'goodsList_cc'
            }
        }, {
            $lookup: {
                localField: 'd',
                from: 'goodsList_d',
                foreignField: 'category',
                as: 'goodsList_dd'
            }
        }]).toArray(function (err, result) {
            if (err) throw err;

            return res.send(result)
            db.close()
        })
    })
})
// 批量插入商品到DB,只运行一次，把商品插入到DB中就ok
function insertTempGoodsList() {
    let TempGoodsListObj = [
        { "name": "奔驰", "price": " 22", "category": "goodsList_c", "img": "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1548498667503&di=e4c9c03a08ad310a4d7ee606f5a2750c&imgtype=0&src=http%3A%2F%2Fabc.2008php.com%2F2016_Website_appreciate%2F2016-01-29%2F20160129001721.jpg", "describe": "产品说明xx123" },
        { "name": "宝马", "price": " 33", "category": "goodsList_c", "img": "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1548498729371&di=a5c603a57243a1d750808980703de6d9&imgtype=0&src=http%3A%2F%2Fassets.pushthink.com%2Fuploads%2Fphoto%2Fimage%2F372568%2F8d0d492f231a72036053639ffb250623.jpg", "describe": "产品说明xx123" },
        { "name": "奥迪", "price": " 44 ", "category": "goodsList_c", "img": "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1548498776216&di=b371c5b5bed7ad944d82d7c57864a772&imgtype=0&src=http%3A%2F%2Fi.img16888.com%2Fupload%2FImages%2F2013%2F01%2F2013010604033930126.jpg", "describe": "产品说明xx123" },
        { "name": "大众", "price": " 55", "category": "goodsList_c", "img": "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1548498827388&di=f0d0f3de9c7c88609de7ec38b35100b0&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F01fa73581fd7e8a84a0d304f0b70c9.png%401280w_1l_2o_100sh.png", "describe": "产品说明xx123" }
    ]
    MongoClient.connect(DB_CONN_STR, function (err, db) {
        // 数据库名：proShopCart
        var _dbo = db.db('proShopCart')
        // 商品栏目集合的名：goodsCategory
        var _collection = _dbo.collection('goodsList_d')
        _collection.insertMany(TempGoodsListObj, function (err, result) {
            if (err) throw err;

            db.close()
        })
    })
}
// insertTempGoodsList()

//根据id，获得对应商品信息
app.get('/getGoodsInfo', function (req, res) {
    var _findId = req.query._id;
    var _c = req.query._c;

    // 引入mongodb的id对象
    var ObjectID = require('mongodb').ObjectID
    var _findObjId = ObjectID.createFromHexString(_findId);

    MongoClient.connect(DB_CONN_STR, function (err, db) {
        // 数据库名：proShopCart
        var _dbo = db.db('proShopCart')
        // 商品栏目集合的名：goodsCategory
        var _collection = _dbo.collection(_c)
        // 这里一定要是双引号
        _collection.findOne({ "_id": _findObjId }, {}, function (err, result) {
            if (err) throw err;

            return res.send(result);
            db.close()
        })
    })
})
// 查询栏目所属的商品列表
app.get('/getCategoryGoodsList', function (req, res) {
    // 这是各个集合_c 是goodslist_a goodslist_b...
    var _c = req.query.categoryId;
    MongoClient.connect(DB_CONN_STR, function (err, db) {
        // 数据库名：proShopCart
        var _dbo = db.db('proShopCart')
        // 商品栏目集合的名：goodsCategory
        var _collection = _dbo.collection(_c)
        // 这里一定要是双引号
        _collection.find().toArray(function (err, result) {
            if (err) throw err;

            return res.send(result);
            db.close()
        })
    })
})
app.get('/getPageChange', function (req, res) {
    var _s = req.query.startNum;
    var _c = req.query.c;
    MongoClient.connect(DB_CONN_STR, function (err, db) {
        // 数据库名：proShopCart
        var _dbo = db.db('proShopCart')
        // 商品栏目集合的名：goodsCategory
        var _collection = _dbo.collection(_c)
        // .limit(2) 限制  skip()跳过的条数
        _collection.find().limit(2).skip(Number(_s)).toArray(function (err, result) {
            if (err) throw err;

            return res.send(result)
            db.close()
        })
    })
})
app.listen(5678, function () {
    console.log('5678，中间件已经启动！')
})
