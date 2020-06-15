// pages/search/search.js
import {
    watch
} from '../../utils/util';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        show: false,
        hotWord: [],
        historyWord: [],
        searchValue: '',
        filterList: [],
        type: 'post',
        order: 'default',
        cateid: 0,
        p: 1,
        orList: {},
        searchList: {},
        moreList: []
    },

    toggleLoading(boolean) {
        this.setData({
            show: boolean
        });
    },

    getHotWord() {
        let hotWordLocal = wx.getStorageSync('hotWord');
        if (hotWordLocal) {
            let hotwordData = JSON.parse(hotWordLocal);

            if (hotwordData && hotwordData.expires > Date.now()) {
                this.setData({
                    hotWord: hotwordData.data
                });
            } else {
                this.toggleLoading(true);
                wx.request({
                    url: 'https://api.kele8.cn/agent/https://app.vmovier.com/apiv3/search/index/kw',
                    success: (res) => {
                        this.setData({
                            hotWord: res.data.data
                        });

                        wx.setStorageSync('hotWord', JSON.stringify({
                            expires: Date.now() + 24 * 60 * 60 * 1000,
                            data: res.data.data
                        }));
                    },
                    fail: () => {
                        wx.showToast({
                            title: '获取数据失败',
                            icon: 'none',
                            duration: 3000
                        })
                    },
                    complete: () => {
                        this.toggleLoading(false);
                    },
                })
            }
        } else {
            this.toggleLoading(true);
            wx.request({
                url: 'https://api.kele8.cn/agent/https://app.vmovier.com/apiv3/search/index/kw',
                success: (res) => {
                    this.setData({
                        hotWord: res.data.data
                    });

                    wx.setStorageSync('hotWord', JSON.stringify({
                        expires: Date.now() + 24 * 60 * 60 * 1000,
                        data: res.data.data
                    }));
                },
                fail: () => {
                    wx.showToast({
                        title: '获取数据失败',
                        icon: 'none',
                        duration: 3000
                    })
                },
                complete: () => {
                    this.toggleLoading(false);
                },
            })
        }
    },

    sendSearch(event) {
        if (event.detail.value != '') {
            this.setHistoryWord(event.detail.value);
            this.getHistoryWord();
            this.getSearchResult(event.detail.value);
        } else {
            return;
        }
    },

    sendWord(event) {
        this.setData({
            searchValue: event.currentTarget.dataset.kw
        });
        this.setHistoryWord(event.currentTarget.dataset.kw);
        this.getSearchResult(event.currentTarget.dataset.kw);
    },

    resetValue() {
        this.setData({
            searchValue: '',
        })
    },

    setHistoryWord(value) {
        let history = wx.getStorageSync('hw');

        if (history) {
            let historyobj = JSON.parse(history);

            if (historyobj.hw.length > 0) {
                let flag = false;
                historyobj.hw.forEach(ele => {
                    if (ele == value) {
                        flag = false;
                        return;
                    } else {
                        flag = true;
                    }
                });

                if (flag) {
                    historyobj.hw.push(value);
                    wx.setStorageSync('hw', JSON.stringify(historyobj));
                }
            } else {
                historyobj.hw.push(value);
                wx.setStorageSync('hw', JSON.stringify(historyobj));
            }
        } else {
            let historyArr = [];
            historyArr.push(value);
            let historyobj = {
                hw: historyArr
            };
            wx.setStorageSync('hw', JSON.stringify(historyobj));
        }
    },

    getHistoryWord() {
        let history = wx.getStorageSync('hw');

        if (history) {
            let historyArr = JSON.parse(history);

            this.setData({
                historyWord: historyArr.hw
            });
        } else {
            return;
        }
    },

    clearHistory() {
        this.setData({
            historyWord: []
        });
        let historyobj = {
            hw: []
        };
        wx.setStorageSync('hw', JSON.stringify(historyobj));
    },

    getSearchResult(value, type = 'post', order = 'default', cateid = 0, p = 1) {
        this.toggleLoading(true);
        wx.request({
            url: `https://api.kele8.cn/agent/https://app.vmovier.com/apiv3/search/index/kw/${value}/type/${type}/order/${order}/cateid/${cateid}/p/${p}`,
            success: (res) => {
                this.setData({
                    filterList: res.data.data.filter,
                    orList: res.data.data.order,
                    searchList: res.data.data.result
                });
            },
            fail: () => {
                wx.showToast({
                    title: '获取数据失败',
                    icon: 'nooe',
                    duration: 3000
                })
            },
            complete: () => {
                this.toggleLoading(false);
            },
        })
    },

    sendSelected() {
        this.setData({
            p: 1,
            moreList: []
        });
        let {
            searchValue,
            type,
            order,
            cateid,
            p
        } = this.data;

        this.refreshSearchList(searchValue, type, order, cateid, p);
    },

    refreshSearchList(value, type, order, cateid, p) {
        this.toggleLoading(true);
        wx.request({
            url: `https://api.kele8.cn/agent/https://app.vmovier.com/apiv3/search/index/kw/${value}/type/${type}/order/${order}/cateid/${cateid}/p/${p}`,
            success: (res) => {
                this.setData({
                    searchList: res.data.data.result
                });
            },
            fail: () => {
                wx.showToast({
                    title: '获取数据失败',
                    icon: 'nooe',
                    duration: 3000
                })
            },
            complete: () => {
                this.toggleLoading(false);
            },
        })
    },

    getMore() {
        if (this.data.searchList.list) {
            let {
                searchValue,
                type,
                order,
                cateid,
                p
            } = this.data;
            this.getMoreResult(searchValue, type, order, cateid, p);
        } else {
            return;
        }
    },

    getMoreResult(value, type, order, cateid, p) {

        if (p <= this.data.searchList.total / 10) {
            p++;
            this.toggleLoading(true);
            wx.request({
                url: `https://api.kele8.cn/agent/https://app.vmovier.com/apiv3/search/index/kw/${value}/type/${type}/order/${order}/cateid/${cateid}/p/${p}`,
                success: (res) => {
                    let moreList = this.data.moreList;
                    moreList.push(res.data.data.result);

                    this.setData({
                        moreList: moreList,
                        p: p
                    });
                },
                fail: () => {
                    wx.showToast({
                        title: '获取数据失败',
                        icon: 'nooe',
                        duration: 3000
                    })
                },
                complete: () => {
                    this.toggleLoading(false);
                },
            })
        } else {
            wx.showToast({
                title: '没有更多的视频了',
                icon: 'none',
                duration: 3000
            })
        }
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getHotWord();
        this.getHistoryWord();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        watch.call(this, 'searchValue', function (val) {
            if (val.length == 0) {
                this.setData({
                    searchList: [],
                    orList: [],
                    filterList: [],
                    p: 1,
                    type: 'post',
                    order: 'default',
                    cateid: 0,
                    moreList: []
                });
            }
            this.getHistoryWord();
        });
        watch.call(this, 'filterList', function (val) {
            if (val.type || val.cate) {
                val.cate.unshift({
                    cateid: 0,
                    catename: '全部影片'
                });

                let type = [];
                let cate = [];
                val.type.forEach(el => {
                    let obj = {};
                    obj.text = el.key;
                    obj.value = el.value;
                    type.push(obj);
                });

                val.cate.forEach(el => {
                    let obj = {};
                    obj.text = el.catename;
                    obj.value = el.cateid;
                    cate.push(obj);
                });
                val.type = type;
                val.cate = cate;
            }
        });

        watch.call(this, 'orList', function (val) {
            if (val.length > 0) {
                val.forEach(el => {
                    el.text = el.key;
                });

            }
        });
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
    onPullDownRefresh: function () {},

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {},

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})