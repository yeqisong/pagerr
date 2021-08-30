import {
    createStore
} from 'vuex'
import editor from './modules/editor'
export const store = createStore({
    strict : process.env.NODE_ENV !== 'production',
    modules: {
        editor
    }
})
