// pages/play/play.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        postid: '',
        postView: [],
        showLoading: false
    },
    showLoading() {
        this.setData({
            showLoading: true
        });
    },
    hideLoading() {
        this.setData({
            showLoading: false
        });
    },
    getplayPage() {
        this.showLoading();
        wx.request({
            url: 'https://api.kele8.cn/agent/https://app.vmovier.com/apiv3/post/view?postid=' + this.data.postid,
            success: (res) => {
                this.setData({
                    postView: res.data.data
                });
            },
            fail: () => {
                wx.showToast({
                    title: '获取数据失败',
                    icon: 'loading',
                    duration: 3000
                });
            },
            complete: () => {
                this.hideLoading();
            }
        })
    },

    routeToPlay(event) {
        wx.navigateTo({
            url: '/pages/play/play?postid=' + event.currentTarget.dataset.postid,
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            postid: options.postid
        });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        this.getplayPage();
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {},

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})