<template>
	<view class="content">
		<MusicHeader title="网易云音乐" color="" :icon="false" iconBlack=""></MusicHeader>
		<view class="container">
			<scroll-view :scroll-y="true">
				<view class="index-search" @tap="goSearch">
					<text class="iconfont iconsearch"></text>
					<input type="text" value="" placeholder="搜索歌曲" />
				</view>
				<view class="skeleton" v-if="loading">
					<Skeleton
					  :loading="loading"
					  :avatarSize="skeleton1.avatarSize"
					  :row="skeleton1.row"
					  :showTitle="skeleton1.showTitle"
						v-for="(item,key) in 4"
						:key="key"
					></Skeleton>
				</view>
				<view class="index-list" v-else>
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
	import Skeleton from '@/components/skeleton/skeleton.vue'
	import request from '@/request/api'
	export default {
		data() {
			return {
				topList: [],
				loading: true,
				skeleton1 : {
				  avatarSize: '52px',
				  row: 3,
				  showTitle: true,
				}
			}
		},
		components: {
			MusicHeader,
			Skeleton
		},
		onLoad() {
			this.reloadData()
			this.getTopList()
		},
		methods: {
			reloadData() {
			  this.loading = true
			  setTimeout(() => {
			    this.loading = false
			  }, 2000)
			},
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
