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
	
				<view class="detail-like">
					<view class="detail-like-title">喜欢这首歌的人也听</view>
					<view class="detail-like-list">
						<view class="detail-like-item" v-for="(item,index) in songSimi" :key="index" @tap="handleToSimi(item.id)">
							<view class="detail-like-img"><image :src="item.album.picUrl" mode=""></image></view>
							<view class="detail-like-song">
								<view>{{item.name}}</view>
								<view>
									<image v-if="item.privilege.flag > 60 && item.privilege.flag < 70" src="../../static/dujia.png" mode=""></image>
									<image v-if="item.privilege.maxbr == 999000" src="../../static/sq.png" mode=""></image>
									{{item.artists[0].name}} - {{item.name}}
								</view>
							</view>
							<!--播放按钮-->
							<text class="iconfont iconbofang"></text>
						</view>
					</view>
				</view>
				
				<view class="detail-comment">
					<view class="detail-comment-title">精彩评论</view>
					<view class="detail-comment-item" v-for="(item,index) in songComment" :key="index">
						<view class="detail-comment-img">
							<!--评论用户头像-->
							<image :src="item.user.avatarUrl" mode=""></image>
						</view>
						<view class="detail-comment-content">
							<view class="detail-comment-head">
								<view class="detail-comment-name">
									<view>{{ item.user.nickname }}</view>
									<view>{{ item.time | formatTime }}</view>
								</view>
								<view class="detail-comment-like">
									{{ item.likedCount | formatCount }} <text class="iconfont iconlike"></text>
								</view>
							</view>
							<view class="detail-comment-text">
								{{ item.content }}
							</view>
						</view>
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
				// 歌曲
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
		filters: {
			formatTime (value) {
				// 定义一个时间数组
					var date = new Date(value);
					// 返回日期
					return date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日';
			}
		},
		methods: {
			async getAllData (id) {
				let [res1,res2,res3,res4,res5] = await Promise.all([
														request({url: `/song/detail?ids=${id}`}),
														request({url: `/lyric?id=${id}`}),
														request({url: `/song/url?id=${id}`}),
														request({url: `/simi/song?id=${id}`}),
														request({url: `/comment/music?id=${id}`})
														])
				this.songDetail = res1.data.songs[0]
				let songLyric = res2.data.lrc.lyric
				this.songSimi = res4.data.songs
				this.songComment = res5.data.hotComments
				uni.hideToast()
			},
			handleToSimi (id) {
				
			}
		}
	}
</script>

<style scoped>
@import './index.css';
</style>
