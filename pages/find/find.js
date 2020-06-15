// pages/find/find.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    indicatorDots: true,
    show: false,
    findList: [],
    channelList: [],
    lastId: '',
    loading: false,
    historyList: [],
    hasMore: true,
    maxMore: 200,
    showPop: false,
    dayList: []
  },
  onClickLeft() {
    this.setData({
      showPop: true
    });
    this.getDayList();
  },
  onClickRight() {
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },
  onClose() {
    this.setData({
      showPop: false
    });
  },
  onChange(event) {
    this.setData({
      active: event.detail.index
    })
    switch (event.detail.index) {
      case 0:
        this.getfindPage();
        break;
      case 1:
        this.getchannelPage();
        break;
    }
  },
  getfindPage() {
    let data = wx.getStorageSync('findList');

    if (data) {
      let findData = JSON.parse(data);

      if (findData && findData.expires > Date.now()) {
        this.setData({
          findList: findData.data,
          lastId: findData.data.posts.lastid
        })
      } else {
        this.showLoading();
        wx.request({
          url: 'https://api.kele8.cn/agent/https://app.vmovier.com/apiv3/index/index',

          success: (response) => {
            // 获取成功
            if (response.data.data) {
              wx.setStorage({
                data: JSON.stringify({
                  expires: Date.now() + 3 * 60 * 60 * 1000,
                  data: response.data.data
                }),
                key: 'findList'
              })

              this.setData({
                findList: response.data.data,
                lastId: response.data.data.posts.lastid
              })
            } else {
              // 网络请求正常 数据错误 降级是否通知用户
              wx.showToast({
                title: '获取数据失败',
                duration: 2000,
                mask: true,
                icon: 'loading'
              })
            }
          },
          fail: () => {
            // 网络请求失败 服务器挂掉
            wx.showToast({
              title: '请求失败',
              duration: 2000,
              mask: true,
              icon: 'loading'
            })
          },
          complete: () => {
            this.hideLoading();
          }
        })
      }

    } else {
      this.showLoading();
      wx.request({
        url: 'https://api.kele8.cn/agent/https://app.vmovier.com/apiv3/index/index',

        success: (response) => {
          // 获取成功
          if (response.data.data) {
            wx.setStorage({
              data: JSON.stringify({
                expires: Date.now() + 3 * 60 * 60 * 1000,
                data: response.data.data
              }),
              key: 'findList'
            })

            this.setData({
              findList: response.data.data,
              lastId: response.data.data.posts.lastid
            })
          } else {
            // 网络请求正常 数据错误 降级是否通知用户
            wx.showToast({
              title: '获取数据失败',
              duration: 2000,
              mask: true,
              icon: 'loading'
            })
          }
        },
        fail: () => {
          // 网络请求失败 服务器挂掉
          wx.showToast({
            title: '请求失败',
            duration: 2000,
            mask: true,
            icon: 'loading'
          })
        },
        complete: () => {
          this.hideLoading();
        }
      })
    }
  },
  getchannelPage() {
    let data = wx.getStorageSync('channelList');

    if (data) {
      let channel = JSON.parse(data);

      if (channel && channel.expires > Date.now()) {
        this.setData({
          channelList: channel.data.data
        });
      } else {
        this.showLoading();
        wx.request({
          url: 'https://api.kele8.cn/agent/https://app.vmovier.com/apiv3/cate/getList',
          success: (res) => {

            this.setData({
              channelList: res.data.data
            });

            wx.setStorage({
              data: JSON.stringify({
                expires: Date.now() + 3 * 60 * 60 * 1000,
                data: res.data
              }),
              key: 'channelList',
            })
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
        })
      }
    } else {
      this.showLoading();
      wx.request({
        url: 'https://api.kele8.cn/agent/https://app.vmovier.com/apiv3/cate/getList',
        success: (res) => {

          this.setData({
            channelList: res.data.data
          });

          wx.setStorage({
            data: JSON.stringify({
              expires: Date.now() + 3 * 60 * 60 * 1000,
              data: res.data
            }),
            key: 'channelList',
          })
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
      })
    }
  },
  showLoading() {
    this.setData({
      show: true
    })
  },
  hideLoading() {
    this.setData({
      show: false
    })
  },
  getMore(id) {
    this.setData({
      loading: true
    });

    wx.request({
      url: 'https://app.vmovier.com/apiv3/index/getIndexPosts/lastid/' + id,

      success: (res) => {
        let {
          historyList
        } = this.data;
        historyList.push({
          data: res.data.data
        });
        this.setData({
          historyList: historyList,
          lastId: res.data.data.lastid,
          loading: false,
          hasMore: true
        });
      },
      fail: () => {
        wx.showToast({
          title: '获取数据失败',
          duration: 2000,
          mask: true,
          icon: 'loading'
        })
        this.setData({
          hasMore: false
        })
      },
      complete: () => {
        this.setData({
          loading: false
        });
      }
    })
  },
  getDayList() {
    let list = wx.getStorageSync('day');
    if (list) {
      let listData = JSON.parse(list);

      if (listData && listData.expires > Date.now()) {
        this.setData({
          dayList: listData.data
        });
      } else {
        this.showLoading();
        wx.request({
          url: 'https://app.vmovier.com/apiv3/DayCover/getDayCover',
          success: (res) => {

            if (res.data) {
              this.setData({
                dayList: res.data.data
              });

              wx.setStorageSync('day', JSON.stringify({
                expires: Date.now() + 1 * 24 * 60 * 60 * 1000,
                data: res.data.data
              }));
            } else {
              wx.showToast({
                title: '获取数据失败',
                icon: 'none',
                duration: 3000
              })
            }
          },
          fail: () => {
            wx.showToast({
              title: '获取数据失败',
              icon: 'none',
              duration: 3000
            })
          },
          complete: () => {
            this.hideLoading();
          }
        })
      }
    } else {
      this.showLoading();
      wx.request({
        url: 'https://app.vmovier.com/apiv3/DayCover/getDayCover',
        success: (res) => {

          if (res.data) {
            this.setData({
              dayList: res.data.data
            });

            wx.setStorageSync('day', JSON.stringify({
              expires: Date.now() + 1 * 24 * 60 * 60 * 1000,
              data: res.data.data
            }));
          } else {
            wx.showToast({
              title: '获取数据失败',
              icon: 'none',
              duration: 3000
            })
          }
        },
        fail: () => {
          wx.showToast({
            title: '获取数据失败',
            icon: 'none',
            duration: 3000
          })
        },
        complete: () => {
          this.hideLoading();
        }
      })
    }
  },
  routeToPost(event) {
    let item = event.currentTarget.dataset.item;
    if (item.tab) {
      wx.navigateTo({
        url: '/pages/post/post?tab=' + item.tab,
      })
    } else {
      wx.navigateTo({
        url: '/pages/post/post?id=' + item.cateid,
      })
    }

  },
  routeToPlay(event) {
    wx.navigateTo({
      url: '/pages/play/play?postid=' + event.currentTarget.dataset.postid,
    })
  },
  navigateToPost(event) {
    let tab = event.currentTarget.dataset.tab.split("//")[0];
    wx.navigateTo({
      url: '/pages/post/post?tab=' + tab,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getfindPage();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

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
    switch (this.data.active) {
      case 0:
        wx.startPullDownRefresh({
          success: (res) => {
            wx.request({
              url: 'https://api.kele8.cn/agent/https://app.vmovier.com/apiv3/index/index',

              success: (response) => {
                // 获取成功
                if (response.data.data) {
                  this.setData({
                    findList: response.data.data
                  })
                } else {
                  // 网络请求正常 数据错误 降级是否通知用户
                  wx.showToast({
                    title: '加载数据失败',
                    icon: 'loading',
                    mask: true,
                    duration: 2000
                  });
                }
                wx.stopPullDownRefresh();
              },
              fail: () => {
                // 网络请求失败 服务器挂掉
                wx.showToast({
                  title: '加载数据失败',
                  icon: 'loading',
                  mask: true,
                  duration: 2000
                });
              },
              complete: () => {
                wx.stopPullDownRefresh();
              }
            })
          }
        })
        break;
      case 1:
        break;
      case 2:
        break;
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    switch (this.data.active) {
      case 0:
        // 处理加载数据最大值
        if (this.data.hasMore == false || this.data.historyList.length >= this.data.maxMore) {
          wx.showToast({
            title: '没有更多内容了',
            duration: 2000,
            mask: true,
            icon: 'loading'
          })
          return;
        } else {
          this.getMore(this.data.lastId);
        }
        break;
      case 1:
        break;
      case 2:
        break;
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})