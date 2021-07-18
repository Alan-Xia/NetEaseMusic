import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
			songIdList: [],
			nextId: null
		},
    mutations: {
			saveSongIds (state,payload) {
				state.songIdList = payload
			},
			getNextId (state,id) {
				state.songIdList.forEach((item,index) => {
					if (item.id == id && state.songIdList[state.songIdList.length -1].id != id) {
						state.nextId = state.songIdList[index+1].id
					}
				})
			}
		},
    getters: {
			
		}
})
export default store