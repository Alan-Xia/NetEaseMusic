<template>
	<view class="detail">
		<view class="fixbg" :style="{backgroundImage: `url(${songDetail.al && songDetail.al.picUrl})`}"></view>
		<MusicHeader :title="songDetail.name" :icon="true" color="white"></MusicHeader>
		<view class="container">
			<scroll-view scroll-y="true" >
				<view class="detail-play">
					<view>
						<image src="../../static/logo.png" mode=""></image>
					</view>
					<!--播放旋转臂-->
					<view></view>
					<view>
						<image :src="songDetail.al && songDetail.al.picUrl" :class="{ 'detail-play-run' : isplayrotate }" mode=""></image>
						<text class="iconfont" :class="playicon"></text>
					</view>
				</view>
				<view class="detail-lyric">
					<view class="detail-lyric-wrap">
						<view class="detail-lyric-item"></view>
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
				// 歌曲详情
				songDetail: {},
				// 推荐
				songSimi : [],
				// 评论
				songComment : [],
				// 歌词
				songLyric : [],
				// 歌词高亮
				lyricIndex : 0,
				// 播放状态
				playicon : 'iconpause',
				// 暂停状态
				isplayrotate : true,
				// 加载状态
				isLoading : true,
			}
		},
		components: {
			MusicHeader
		},
		onLoad (options) {
			uni.showToast({
				title: "数据加载中",
				icon: "loading",
				duration: 3000
			})
			this.getAllData(options.id)
		},
		methods: {
			async getAllData (id) {
				let [res1,res2] = await Promise.all([
														request({url: `/song/detail?ids=${id}`}),
														request({url: `/lyric?id=${id}`})
														])
				this.songDetail = res1.data.songs[0]
				let songLyric = res2.data.lrc.lyric
				
				uni.hideToast()
			}
		}
	}
</script>

<style scoped>
@import './index.css';
</style>
