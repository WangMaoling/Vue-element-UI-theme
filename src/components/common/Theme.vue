 <!-- 切换主题色  -->
<template>
	<div>
		<el-color-picker  @change="colorChange" v-model="colors.primary" ></el-color-picker>
	</div>
</template>
<script>
import generateColors from "../../utils/color";
import objectAssign from "object-assign";
export default {
	name: "App",
	data() {
		return {
			originalStylesheetCount: -1,//记录当前已引入style数量
			originalStyle: "",//获取拿到的.css的字符串
			colors: {
				//颜色选择器默认颜色值,这个值要和element-variables一样
				primary: "#409EFF"
			},
			// primaryColor: "", //提交成功后设置默认颜色
			cssUrl: [
				"//unpkg.com/element-ui/lib/theme-chalk/index.css",
				"./static/css/index.css"
			]
		};
	},
	methods: {
		colorChange(e) {
            if(!e)return;
            localStorage.setItem('color',e)
			this.primaryColor = this.colors.primary;
			this.colors = objectAssign(
				{},
				this.colors,
				generateColors(this.colors.primary)
			);
			this.writeNewStyle();
		},
		writeNewStyle() {
			let cssText = this.originalStyle;
			Object.keys(this.colors).forEach(key => {
				cssText = cssText.replace(
					new RegExp("(:|\\s+)" + key, "g"),
					"$1" + this.colors[key]
				);
			});
			if (this.originalStylesheetCount === document.styleSheets.length) {
				// 如果之前没有插入就插入
				const style = document.createElement("style");
				style.innerText =
					".primaryColor{background-color:" + this.colors.primary + "}" + cssText;
				document.head.appendChild(style);
			} else {
				// 如果之前没有插入就修改
				document.head.lastChild.innerText =
					".primaryColor{background-color:" +
					this.colors.primary +
					"} " +
					cssText;
			}
		},
		getIndexStyle(url) {
			let that = this;
			var request = new XMLHttpRequest();
			request.open("GET", url);
			request.onreadystatechange = function() {
				if (
					request.readyState === 4 &&
					(request.status == 200 || request.status == 304)
				) {
					// 调用本地的如果拿不到会得到html,html是不行的
					if (request.response && !/DOCTYPE/gi.test(request.response)) {
                        that.originalStyle = that.getStyleTemplate(request.response);
                        that.writeNewStyle()
					} else {
						that.originalStyle = "";
					}
				} else {
					that.originalStyle = "";
				}
			};
			request.send(null);
		},
		getStyleTemplate(data) {
			const colorMap = {
				"#3a8ee6": "shade-1",
				"#409eff": "primary",
				"#53a8ff": "light-1",
				"#66b1ff": "light-2",
				"#79bbff": "light-3",
				"#8cc5ff": "light-4",
				"#a0cfff": "light-5",
				"#b3d8ff": "light-6",
				"#c6e2ff": "light-7",
				"#d9ecff": "light-8",
				"#ecf5ff": "light-9"
			};
			Object.keys(colorMap).forEach(key => {
				const value = colorMap[key];
				data = data.replace(new RegExp(key, "ig"), value);
			});
			return data;
		}
	},
	mounted() {
		// 默认从线上官方拉取最新css,2秒钟后做一个检查没有拉到就从本地在拉下
        let that = this;
        // 如果是记住用户的状态就需要，在主题切换的时候记录颜色值，在下次打开的时候从新赋值
        this.colors.primary = localStorage.getItem('color')||this.colors.primary//例如
		this.getIndexStyle(this.cssUrl[0]);
		setTimeout(function() {
			if (that.originalStyle) {
				return;
			} else {
				that.getIndexStyle(that.cssUrl[1]);
			}
		}, 2000);
		this.$nextTick(() => {
			// 获取页面一共引入了多少个style 文件
			this.originalStylesheetCount = document.styleSheets.length;
		});
	}
};
</script>
<style>
</style>

