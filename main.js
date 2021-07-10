import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

Vue.filter('formatCount',function(value){
	// 判断在万~亿之间的访问量
	if( value >= 10000 && value < 100000000 ){
		value /= 10000; 
		return value.toFixed(1) + '万';
	} else if(value >= 100000000){
		value /= 100000000;
		return value.toFixed(1) + '亿';
	} else{
		return value;
	}
	
});
App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
