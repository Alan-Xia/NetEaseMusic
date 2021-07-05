import {baseUrl} from './baseUrl'

// export function rankList () {
// 	return new Promise((resolve, reject) => {
// 		uni.request({
// 			url: `${baseUrl}/toplist`,
// 			method: 'GET',
// 			success: res => {
// 				resolve(res)
// 			},
// 			fail: (err) => {
// 				reject(err)
// 			},
// 			complete: () => {}
// 		});
// 	})
// }

export default function request (params) {
	return new Promise((resolve, reject) => {
		uni.request({
			url: `${baseUrl}${params.url}`,
			method: params.method || 'GET',
			data: params.data || {},
			success: res => {
				resolve(res)
			},
			fail: (err) => {
				reject(err)
			},
			complete: () => {}
		});
	})
}