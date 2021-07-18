<template>
	<view class="search">
		<MusicHeader title="搜索" :icon="true" :iconBlack="true"></MusicHeader>
		<view class="container">
			<scroll-view :scroll-y="true">
				<view class="search-search">
					<text class="iconfont iconsearch"></text>
					<input type="text" value="" placeholder="搜索歌曲" />
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import MusicHeader from '@/components/musichead/musichead.vue'
	export default {
		data() {
			return {
				
			};
		},
		components: {
			MusicHeader
		}
	}
</script>

<style lang="scss" scoped>
@import "./search.scss"
</style>
