const PAGE = {
    data: {
        navigatorBarArr: ['intro-section', 'onlineCouse-section', 'teachers-section', 'products-section', 'qualcomm-section'],
        navigatorBarActiveId: '',
        navigatorBarFixed: false,
        navigatorBarFixedOffset: 496,
        navigatorBarHeight: 70,

        index: 1,
        duration: 500,
        isLock: false,
        translateX: 0,
        defaultLength: null,
        itemWidth: null,
    },

    init: function () {
        this.clone();
        this.bind();
    },
    bind: function () {
        window.addEventListener('scroll', this.refreshNavigator);
        let navigatorBar = document.getElementById('navigator-bar');
        this.onEventLister(navigatorBar, 'click', 'navigator-bar-item', this.goNavigator);
        let swiperPrev = document.getElementById('swiper-prev');
        swiperPrev.addEventListener('click', this.swiperPrev);
        let swpierNext = document.getElementById('swiper-next');
        swpierNext.addEventListener('click', this.swpierNext);

        let courseDetailContentLeft = document.getElementById('course-detail-content-left')
        this.onEventLister(courseDetailContentLeft, 'click', 'course-left-item-chapter', this.hideCouse);
    },
 
    //展开关闭监听器：当点击的元素为childClassName的子元素
    onEventLister: function (parentNode, action, childClassName, callback) {
        parentNode.addEventListener(action, function (e) {
            let element = e.target.closest('.' + childClassName);  //把childClassName变为类选择器
            if (element) {
                callback(e);
            }
        })
    },

    hideCouse:function(e) {
        let chapter = e.target.closest('.course-left-item-chapter');
        let box = chapter.nextElementSibling;
        let isActive = box.className.indexOf('active');
        if (!chapter) return;
        if (isActive >= 0) {
            box.className = 'course-left-box';
        } else {
            box.className = 'course-left-box active';
        }
    },

    /*  clone: function () {
        let swiperItem = document.getElementsByClassName('swiper-item');
        let swiperList = document.getElementById('swiper-list');
        let swiperItemWidth = (swiperList.offsetWidth) / 9;
        PAGE.data.defaultLength = swiperItem.length;
        PAGE.data.itemWidth = swiperItemWidth;
        let index = PAGE.data.index;
        PAGE.data.translateX = -(swiperItemWidth + swiperItemWidth * index);

        let firstItem = swiperItem[0].cloneNode(true);
        let secondItem = swiperItem[1].cloneNode(true);
        let fourthItem = swiperItem[3].cloneNode(true);
        let lastItem = swiperItem[swiperItem.length - 1].cloneNode(true);

        swiperList.appendChild(firstItem);
        swiperList.appendChild(secondItem);
        swiperList.prepend(lastItem);
        swiperList.prepend(fourthItem); 



        PAGE.goIndex(index);
    },   */

    clone: function () {
        let swiperList = document.getElementById('swiper-list');
        let swiperItem = Array.from(swiperList.getElementsByClassName('swiper-item')); // 使用Array.from得到一个静态的数组
        let swiperItemWidth = (swiperList.offsetWidth) / 9;
        PAGE.data.defaultLength = swiperItem.length;
        PAGE.data.itemWidth = swiperItemWidth;
        let index = PAGE.data.index;
        PAGE.data.translateX = -(swiperItemWidth + swiperItemWidth * index);

        // 克隆最后两个项目到开头
        for (let i = swiperItem.length - 1; i >= swiperItem.length - 2; i--) {
            let clonedItem = swiperItem[i].cloneNode(true);
            swiperList.prepend(clonedItem);
        }

        // 克隆前两个项目到结尾
        for (let i = 0; i < 2; i++) {
            let clonedItem = swiperItem[i].cloneNode(true);
            swiperList.appendChild(clonedItem);
        }

        PAGE.goIndex(index);
    }, 

    goIndex: function (index) {
        console.log('index', index);
        let swiperDuration = PAGE.data.duration;
        let swiperItemWidth = PAGE.data.itemWidth;
        let beginTranslateX = PAGE.data.translateX;
        let endTranslateX = -(swiperItemWidth + swiperItemWidth * index);
        let swiperList = document.getElementById('swiper-list');

        let isLock = PAGE.data.isLock;
        if (isLock) {
            return
        }
        PAGE.data.isLock = true;

        PAGE.animateTo(beginTranslateX, endTranslateX, swiperDuration, function (value) {
            swiperList.style.transform = `translateX(${value}px)`;
        }, function (value) {
            let swiperLength = PAGE.data.defaultLength;

            if (index === -1) {
                index = swiperLength - 1;
                value = - (swiperItemWidth + swiperItemWidth * index);
            }
            if (index === swiperLength) {
                index = 0;
                value = - (swiperItemWidth + swiperItemWidth * index);
            }

            swiperList.style.transform = `translateX(${value}px)`;
            PAGE.data.index = index;
            PAGE.data.translateX = value;
            PAGE.data.isLock = false;
        })
    },

    animateTo: function (begin, end, duration, changeCallback, finishCallback) {
        let startTime = Date.now();
        requestAnimationFrame(function update() {
            let dateNow = Date.now();
            let time = dateNow - startTime;
            let value = PAGE.linear(time, begin, end, duration);
            typeof changeCallback === 'function' && changeCallback(value)
            if (startTime + duration > dateNow) {
                requestAnimationFrame(update)
            } else {
                typeof finishCallback === 'function' && finishCallback(end)
            }
        })
    },
    linear: function (time, begin, end, duration) {
        return (end - begin) * time / duration + begin;
    },
    swiperPrev: function () {
        let index = PAGE.data.index;
        PAGE.goIndex(index - 1);
    },
    swpierNext: function () {
        let index = PAGE.data.index;
        PAGE.goIndex(index + 1);
    },

    refreshNavigator: function () {
        PAGE.fixedNavigator();
        PAGE.heightLightNavigator();
    },
    fixedNavigator: function () {
        let scrollTop = document.documentElement.scrollTop;
        let navigatorBarTop = (PAGE.data.navigatorBarFixedOffset + PAGE.data.navigatorBarHeight)
        let navigatorBarFixed = scrollTop >= navigatorBarTop;
        if (PAGE.data.navigatorBarFixed !== navigatorBarFixed) {
            PAGE.data.navigatorBarFixed = navigatorBarFixed;
            let navigatorBar = document.getElementById('navigator-bar');
            if (navigatorBarFixed) {
                navigatorBar.className = 'navigator-bar fixed-top';
            } else {
                navigatorBar.className = 'navigator-bar';
            }
        }
    },
    heightLightNavigator: function () {
        let scrollTop = document.documentElement.scrollTop;
        let filterNav = PAGE.data.navigatorBarArr.filter(data => {
            let offsetTop = document.getElementById(data).offsetTop;
            return scrollTop >= offsetTop - PAGE.data.navigatorBarHeight;
        })

        let navigatorBarActiveId = filterNav.length ? filterNav[filterNav.length - 1] : '';
        if (PAGE.data.navigatorBarActiveId !== navigatorBarActiveId) {
            PAGE.data.navigatorBarActiveId = navigatorBarActiveId;
            let navigatorBarItems = document.getElementsByClassName('navigator-bar-item');

            for (let i = 0; i < navigatorBarItems.length; i++) {
                let navigatorBarItem = navigatorBarItems[i];
                let dataNav = navigatorBarItem.dataset.nav;
                if (dataNav === navigatorBarActiveId) {
                    navigatorBarItem.className = 'navigator-bar-item active';
                } else {
                    navigatorBarItem.className = 'navigator-bar-item';
                }
            }
        }
    },
    goNavigator: function (e) {
        let id = e.target.dataset.nav;
        let offsetTop = document.getElementById(id).offsetTop - PAGE.data.navigatorBarHeight;
        document.documentElement.scrollTop = offsetTop;
    },
}
PAGE.init();