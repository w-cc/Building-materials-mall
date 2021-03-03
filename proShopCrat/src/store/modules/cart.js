
export default {
    // 初始化数据
    state: {
        shopCartList: ''
    },
    // 一些逻辑操作
    mutations: {
        add(state, _n) {
            state.shopCartList = _n;
        }
    },
    // 映射事件
    actions: {
        addToVuex({ commit }, _n) {
            commit('add', _n)
        }
    },
    // 对外映射 数据
    getters: {
        shopCartList: state => state.shopCartList

    }
}