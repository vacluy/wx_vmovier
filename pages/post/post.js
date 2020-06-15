// pages/post/post.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        p: 1,
        size: 10,
        tab: '',
        cateid: '',
        postList: [],
        showLoading: false,
        moreList: [],
        maxPage: 200
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
    pageInit() {
        this.setData({
            p: 1
        })
    },

    getpostPage() {
        this.showLoading();
        this.pageInit();
        if (this.data.tab != '') {
            wx.request({
                url: 'https://api.kele8.cn/agent/https://app.vmovier.com/apiv3/post/getPostByTab?p=' + this.data.p + '&size=10&tab=' + this.data.tab,

                success: (res) => {
                    this.setData({
                        postList: res.data.data
                    });
                },
                fail: () => {
                    wx.showToast({
                        title: '获取数据失败',
                        duration: 3000
                    })
                },
                complete: () => {
                    this.hideLoading();
                }
            });
        } else {
            wx.request({
                url: 'https://app.vmovier.com/apiv3/post/getPostInCate?p=' + this.data.p + '&size=10&cateid=' + this.data.cateid,

                success: (res) => {
                    this.setData({
                        postList: res.data.data
                    });
                },
                fail: () => {
                    wx.showToast({
                        title: '获取数据失败',
                        duration: 3000
                    })
                },
                complete: () => {
                    this.hideLoading();
                }
            });
        }
    },

    getmore() {
        if (this.data.p >= this.data.maxPage) {
            wx.showToast({
                title: '没有数据了',
                duration: 3000
            })
            return;
        }
        this.showLoading();
        let p = this.data.p;
        p += 1;
        this.setData({
            p: p
        });
        let morelist = this.data.moreList
        if (this.data.tab != '') {
            wx.request({
                url: 'https://api.kele8.cn/agent/https://app.vmovier.com/apiv3/post/getPostByTab?p=' + p + '&size=10&tab=' + this.data.tab,

                success: (res) => {
                    morelist.push({
                        data: res.data.data
                    });
                    this.setData({
                        moreList: morelist
                    });
                },
                fail: () => {
                    wx.showToast({
                        title: '获取数据失败',
                        duration: 3000
                    })
                },
                complete: () => {
                    this.hideLoading();
                }
            });
        } else {
            wx.request({
                url: 'https://app.vmovier.com/apiv3/post/getPostInCate?p=' + p + '&size=10&cateid=' + this.data.cateid,

                success: (res) => {
                    morelist.push({
                        data: res.data.data
                    });
                    this.setData({
                        moreList: morelist
                    });
                },
                fail: () => {
                    wx.showToast({
                        title: '获取数据失败',
                        duration: 3000
                    })
                },
                complete: () => {
                    this.hideLoading();
                }
            });
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (options.tab) {
            this.setData({
                tab: options.tab,
                cateid: ''
            });
        } else {
            this.setData({
                tab: '',
                cateid: options.id
            });
        }

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        this.getpostPage();
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

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
        this.getpostPage();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        this.getmore();
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})