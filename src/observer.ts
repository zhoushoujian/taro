const Subject = function(){
  this.observers = []

  return {
      subscribeObserver: (observer) => {
          this.observers.push(observer)
      },
      unsubscribeObserver: (observer) => {
          var index = this.observers.indexOf(observer);
          if(index > -1){
              this.observers.splice(index, 1)
          }
      },
      notifyObserver: (observer) => {
          var index = this.observers.indexOf(observer)
          if(index > -1){
              this.observers[index].notify(index)
          }
      },
      notifyAllObservers: (observer) => {
          for(let i=0;i<this.observers.length;i++){
              this.observers[i].notify(i)
          }
      }
  }
}

if (process.env.TARO_ENV === 'h5') {
  window.Observer = function(cb){
    return {
        notify: function(index){
            if(cb) cb(index)
        }
    }
  }
  window.subjectModel = new Subject()
} else if (process.env.TARO_ENV === 'weapp') {
  wx.Observer = function(cb){
    return {
        notify: function(index){
            if(cb) cb(index)
        }
    }
  }
  wx.subjectModel = new Subject()
} else if (process.env.TARO_ENV === 'alipay') {
  my.Observer = function(cb){
    return {
        notify: function(index){
            if(cb) cb(index)
        }
    }
  }
  my.subjectModel = new Subject()
}
