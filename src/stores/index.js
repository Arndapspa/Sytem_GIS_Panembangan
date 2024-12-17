import Vuex from 'vuex';

export default new Vuex.Store({
    state: {
        user: null,
        rw: null,
        rt: null
    },
    mutations: {
        setuser(state, value) {
            state.user = value;
        },
        setRW(state, value) {
            state.rw = value
            localStorage.setItem('rw', JSON.stringify(value))
        },
        setRT(state, value) {
            state.rt = value
            localStorage.setItem('rt', JSON.stringify(value))
        }
    },
    actions: {},
    modules: {},
    getters: {
        dataUser: async (state) => {
            return state.user;
        },
        logout: (state) => {
            state.user = null
            localStorage.removeItem('token')
            return true
        }
    }
});
