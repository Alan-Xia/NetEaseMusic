<template>
	<view class="list">
		<view class="fixbg" :style="{backgroundImage: `url(${playlist.coverImgUrl})`}"></view>
		<MusicHeader title="歌单" :icon="true" color="white"></MusicHeader>
		<view class="container">
			<scroll-view scroll-y="true" >
				<view class="list-head">
					<view class="list-head-img">
						<image :src="playlist.coverImgUrl" mode=""></image>
						<text class="iconfont iconyousanjiao">{{playlist.playCount | formatCount}}</text>
					</view>
					<view class="list-head-text">
						<!-- <image :src="playlist.coverImgUrl" mode=""></image> -->
						<view>{{playlist.name}}</view>
						<view>
							<image :src="playlist.creator && playlist.creator.avatarUrl" mode=""></image>
							<text>{{ playlist.creator && playlist.creator.nickname }}</text>
						</view>
						<view>{{ playlist.description }}</view>
					</view>
				</view>
				<!-- #ifdef MP-WEIXIN -->
					<button class="list-share" open-type="share">
						<text class="iconfont iconicon-"></text>分享给微信好友
					</button>
				<!-- #endif -->
				<view class="list-music">
					<view class="list-music-title">
						<text class="iconfont iconbofang1"></text>
						<text>播放全部</text>
						<text>({{playlist.trackCount}})</text>
					</view>
					<view class="list-music-item" v-for="(item,index) in playlist.tracks" @tap="handleDetail(item.id)">
						<view class="list-music-top">{{index + 1}}</view>
						<view class="list-music-song">
							<view>{{item.name}}</view>
							<view>
								<image v-if="privileges[index].flag > 60 && privileges[index].flag < 70" src="../../static/dujia.png" mode=""></image>
								<image v-if="privileges[index].maxbr == 999000" src="../../static/sq.png" mode=""></image>
								{{item.ar[0].name}}-{{item.name}}
							</view>
						</view>
						<text class="iconfont iconbofang"></text>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import request from '@/request/api'
	import MusicHeader from '@/components/musichead/musichead.vue'
	export default {
		data() {
			return {
				// 榜单背景图
				playlist : {},
				privileges: []
			};
		},
		components: {
			MusicHeader
		},
		onLoad (options) {
			this.getSongList(options.id)
		},
		methods: {
			async getSongList (id) {
				uni.showToast({
					title: '数据加载中',
					icon: "loading",
					duration: 3000
				})
				let {data} = await request({url:`/playlist/detail?id=${id}`,methods: "get"})
				this.playlist = data.playlist
				this.privileges = data.privileges
				uni.hideToast()
			},
			handleDetail (id) {
				uni.navigateTo({
					url: '/pages/detail/detail?id=' + id 
				})
			}
		}
	}
</script>

<style scoped>
@import './list.css';
</style>
