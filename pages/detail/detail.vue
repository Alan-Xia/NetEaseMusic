<template>
	<view class="detail">
		<view class="fixbg" :style="{backgroundImage: `url(${songDetail.al && songDetail.al.picUrl})`}"></view>
		<MusicHeader :title="songDetail.name" :icon="true" color="white"></MusicHeader>
		<view class="container" v-if="isLoading">
			<scroll-view scroll-y="true" >
				<view class="detail-play" @tap="handleToPlay">
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
					<view class="detail-lyric-wrap" :style="{ transform : 'translateY(' +  - (lyricIndex - 1) * 82  + 'rpx)' }">
						<view 
							class="detail-lyric-item" 
							v-for="(item,index) in songLyric"
							:key="index"
							:class="{ active : lyricIndex == index}" 
							>
							{{item.lyric}}
							</view>
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
				songDetail: {
					al : { picUrl : '' }
				},
				// 推荐
				songSimi : [],
				// 评论
				songComment : [],
				// 歌曲
				songLyric : [],
				// 歌词高亮
				lyricIndex : 0,
				// 播放状态
				playicon : 'iconbofang1',
				// 暂停状态
				isplayrotate : false,
				// 加载状态
				isLoading : false
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
		onUnload(){
			this.cancelLyricIndex();
			// #ifdef H5
			this.bgAudioManager.destroy();
			// #endif
		},
		onHide () {
			this.cancelLyricIndex();
			// #ifdef H5
			this.bgAudioManager.destroy();
			// #endif
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
				this.$store.commit("getNextId",id)
				let [res1,res2,res3,res4,res5] = await Promise.all([
														request({url: `/song/detail?ids=${id}`}),
														request({url: `/lyric?id=${id}`}),
														request({url: `/song/url?id=${id}`}),
														request({url: `/simi/song?id=${id}`}),
														request({url: `/comment/music?id=${id}`})
														])
														
				this.isLoading = false
				// 歌曲信息
				this.songDetail = res1.data.songs[0]
				// 相似歌曲
				this.songSimi = res4.data.songs
				// 评论
				this.songComment = res5.data.hotComments
				// 获取歌词
				let lyric = res2.data.lrc.lyric
				// 歌词停留的时间
				let result = [];
				// 正则表达式分隔歌词
				let re = /\[([^\]]+)\]([^[]+)/g;
				lyric.replace(re,($0,$1,$2)=>{
					result.push({ time : this.formatTimeToSec($1) , lyric : $2 });
				});
				// 歌词
				this.songLyric = result
				// 处理歌曲
				// #ifdef MP-WEIXIN
				this.bgAudioManager = uni.getBackgroundAudioManager();
				this.bgAudioManager.title = this.songDetail.name;
				// #endif
				
				// #ifdef H5
				if(!this.bgAudioManager){
					this.bgAudioManager = uni.createInnerAudioContext();
				}
				this.playicon = "iconbofang1"
				this.isplayrotate = false
				// #endif
				
				this.bgAudioManager.src = res3.data.data[0].url;
				this.listenLyricIndex();
				// 播放
				this.bgAudioManager.onPlay(() => {
					this.playicon = "iconpause"
					this.isplayrotate = true
					this.listenLyricIndex();
				})
				this.bgAudioManager.onPause(() =>{
					this.playicon = "iconbofang1"
					this.isplayrotate = false
					this.cancelLyricIndex();
				})
				// 监听上一首歌播放完毕，自动播放下一首歌
				this.bgAudioManager.onEnded(()=>{
					this.getAllData(this.$store.state.nextId);
					// #ifdef H5
						this.handleToPlay()
					// #endif
				});
				// 整个加载完成之后
				this.isLoading = true;
				uni.hideToast()
			},
			// 转化成秒
			formatTimeToSec(time){
				let arr = time.split(':');
				return (parseFloat(arr[0]) * 60 + parseFloat(arr[1])).toFixed(2);
			},
			cancelLyricIndex(){
				clearInterval(this.timer);
			},
			handleToSimi(songId){
				this.getAllData(songId);
			},
			// 播放
			handleToPlay () {
				if (this.bgAudioManager.paused) {
					this.bgAudioManager.play()
				} else {
					this.bgAudioManager.pause()
				}
			},
			// 利用节流实现监听事件慢加载
			listenLyricIndex (){
				clearInterval(this.timer);
				this.timer = setInterval(()=>{
					for(var i=0;i< this.songLyric.length;i++){
						if( this.songLyric[this.songLyric.length-1].time < this.bgAudioManager.currentTime ){
							this.lyricIndex = this.songLyric.length-1;
							break;
						}
						if( this.songLyric[i].time < this.bgAudioManager.currentTime && this.songLyric[i+1].time > this.bgAudioManager.currentTime ){
							this.lyricIndex = i;
						}
					}
				});
			}
		}
	}
</script>

<style scoped>
@import './index.css';
</style>
