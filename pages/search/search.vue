<template>
	<view class="search">
		<MusicHeader title="搜索" :icon="true" :iconBlack="true"></MusicHeader>
		<view class="container">
			<scroll-view scroll-y="true">
				<view class="search-search">
					<text class="iconfont iconsearch"></text>
					<input type="text" placeholder="搜索歌曲" v-model="searchWord" @confirm="handleToSearch" @input="handleToSuggest" />
					<text v-show="searchType == 2" @tap="handleToClose" class="iconfont iconguanbi"></text>
				</view>
				
				<block v-if="searchType == 1">
					<!--搜索记录-->
					<view class="search-history">
						<view class="search-history-head">
							<text>历史记录</text>
							<text class="iconfont iconlajitong" @tap="handleToClear"></text>
						</view>
						<view class="search-history-list">
							<view v-for="(item,index) in historyList" :key="index" @tap="handleToWord(item)">{{ item }}</view>
						</view>
					</view>
					<!--热搜榜-->
					<view class="search-hot">
						<view class="search-hot-title">热搜榜</view>
						<view class="search-hot-item" v-for="(item,index) in searchHot" :key="index" @tap="handleToWord(item.searchWord)">
							<view class="search-hot-top">{{ index + 1 }}</view>
							<view class="search-hot-word">
								<view>
									{{ item.searchWord }} <image :src="item.iconType ? item.iconUrl : ''" mode="aspectFit"></image>
								</view>
								<view>{{ item.content }}</view>
							</view>
							<text class="search-hot-count">{{ item.score }}</text>
						</view>
					</view>
				</block>
				
				<block v-else-if="searchType == 2">
					<view class="search-result">
						<view class="search-result-item" v-for="(item,index) in searchList" :key="index" @tap="handleToDetail(item.id)">
							<view class="search-result-word">
								<view>{{ item.name }}</view>
								<view>{{ item.artists[0].name }} - {{ item.album.name }}</view>
							</view>
							<text class="iconfont iconbofang"></text>
						</view>
					</view>
				</block>
				
				<block v-else-if="searchType == 3">
					<view class="search-suggest">
						<view class="search-suggest-title">搜索"{{ this.searchWord }}"</view>
						<view class="search-suggest-item" v-for="(item,index) in suggestList" :key="index" @tap="handleToWord(item.keyword)">
							<text class="iconfont iconsearch"></text>
							{{ item.keyword }}
						</view>
					</view>
				</block>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import MusicHeader from '@/components/musichead/musichead.vue'
	import request from '@/request/api'
	export default {
		data() {
			return {
				searchHot : [],
				searchWord : '',
				historyList : [],
				searchType : 1,
				searchList : [],
				suggestList : []
			};
		},
		components: {
			MusicHeader
		},
		onLoad () {
			this.getSearchHot()
		},
		methods: {
			// 获取搜索热词
			async getSearchHot () {
				let {data} = await request({url: '/search/hot/detail'})
				this.searchHot = data.data
				// 取出历史记录
				uni.getStorage({
						key: 'searchHistory',
						success:(res)=>{
							this.historyList = res.data;
						}
				});
			},
			// 搜索历史，保存历史记录
			handleToSearch(){
				this.historyList.unshift(this.searchWord)
				this.historyList = [...new Set(this.historyList)]
				if(this.historyList.length > 10){
					this.historyList.length = 10;
				}
				uni.setStorage({
					key: 'searchHistory',
					data: this.historyList
				});
				this.getSearchList(this.searchWord);
			},
			// 删除历史记录
			handleToClear(){
				uni.removeStorage({
					key:'searchHistory',
					success:()=>{
						this.historyList = [];
					}
				})
			},
			// 获取搜索结果
			async getSearchList(word){
				let {data} = await request({url: `/search?keywords=${word}`})
				this.searchList = data.result.songs
				this.searchType = 2
			},
			// 搜索栏的关闭按钮 X
			handleToClose(){
				this.searchWord = '';
				this.searchType = 1;
			},
			// 边输入边搜索
			async handleToSuggest(ev){
				let value = ev.detail.value;
				if(!value){
					this.searchType = 1;
					return;
				}
				let {data} = await request({url: `/search/suggest?keywords=${value}&type=mobile`})
				this.suggestList = data.result.allMatch
				this.searchType = 3;
			},
			// 点击热歌榜回传到搜索栏进行搜索
			handleToWord(word){
				this.searchWord = word
				this.handleToSearch()
			},
			// 搜索到之后，点击歌曲跳转播放
			handleToDetail(id){
				uni.navigateTo({
					url: '/pages/detail/detail?id=' + id 
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
@import "./search.scss"
</style>
