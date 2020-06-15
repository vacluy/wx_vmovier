// components/card/card.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        post:Object
    },

    /**
     * 组件的初始数据
     */
    data: {

    },

    /**
     * 组件的方法列表
     */
    methods: {
        navigateToPlay(event) {
            wx.navigateTo({
              url: '/pages/play/play?postid=' + event.currentTarget.dataset.post.postid,
            })
            
        }
    }
})
