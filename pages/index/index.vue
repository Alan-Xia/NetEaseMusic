<template>
	<view class="content">
		<MusicHeader title="网易云音乐" color="" :icon="false" iconBlack=""></MusicHeader>
		<view class="container">
			<scroll-view :scroll-y="true">
				<view class="index-search" @tap="handleToSearch">
					<text class="iconfont iconsearch"></text>
					<input type="text" value="" placeholder="搜索歌曲" />
				</view>
				<view class="index-list">
					<view class="index-list-item">
						<view class="index-list-img">
							<image src="../../static/wangyiyunyinyue.png" mode=""></image>
							<text></text>
						</view>
						<view class="index-list-text">
							<view v-for="(item ,index) in 3" :key="index">热门音乐</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import MusicHeader from '@/components/musichead/musichead.vue'
	import {rankList} from '@/request/api'
	export default {
		data() {
			return {
				
			}
		},
		components: {
			MusicHeader
		},
		onLoad() {
			this.getTopList()
		},
		methods: {
			getTopList () {
				rankList().then(res => {
					console.log(res)
				})
			}
		}
	}
</script>

<style>
	/*搜索栏*/
	.index-search{ display: flex; background:#f7f7f7; height:73rpx; margin:70rpx 30rpx 30rpx 30rpx; border-radius: 50rpx; align-items: center;}
	.index-search text{ margin:0 27rpx;} 
	.index-search input{ font-size:26rpx; flex:1;}
	/*歌曲分类*/
	.index-list{ margin:0 30rpx;}
	.index-list-item{ display: flex; margin-bottom: 35rpx;}
	.index-list-img{ width:212rpx; height:212rpx; margin-right:20rpx; border-radius: 15rpx; overflow: hidden; position: relative;}
	.index-list-img image{ width:100%; height:100%;}
	.index-list-img text{ position: absolute; font-size:22rpx; color:white; bottom: 15rpx; left:15rpx;}
	.index-list-text{ flex:1; font-size:24rpx; line-height: 68rpx;}
	.index-list-text view{}
</style>
