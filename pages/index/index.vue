<template>
	<view class="content">
		<MusicHeader title="网易云音乐" color="" :icon="false" iconBlack=""></MusicHeader>
		<view class="container">
			<scroll-view :scroll-y="true">
				<view class="index-search" @tap="goSearch">
					<text class="iconfont iconsearch"></text>
					<input type="text" value="" placeholder="搜索歌曲" />
				</view>
				<view class="index-list">
					<view class="index-list-item" v-for="(item,index) in topList" :key="index" @tap="handleToList(item.id)">
						<view class="index-list-img">
							<image :src="item.coverImgUrl" mode=""></image>
							<text>{{item.updateFrequency}}</text>
						</view>
						<view class="index-list-text">
							<view v-for="(it ,i) in item.tracks" :key="i">{{i+1}}.{{it.first}} - {{it.second}}</view>
						</view>
					</view>
				</view>
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
				topList: []
			}
		},
		components: {
			MusicHeader
		},
		onLoad() {
			this.getTopList()
		},
		methods: {
			async getTopList () {
				const {data} = await request({url:'/toplist/detail'})
				this.topList = data.list.slice(0,4)
			},
			handleToList (id) {
				uni.navigateTo({
					url: '/pages/list/list?id='+id
				});
			},
			goSearch () {
				uni.navigateTo({
					url: '../search/search'
				})
			}
		}
	}
</script>

<style style="scss" scoped>
	@import './index.scss';
</style>
