import {baseUrl} from './baseUrl'

export function rankList () {
	return new Promise((resolve, reject) => {
		uni.request({
			url: `${baseUrl}/toplist`,
			method: 'GET',
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