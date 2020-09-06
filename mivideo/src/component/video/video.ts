/*
 * @Author: xuwei
 * @Date: 2020-08-30 17:05:28
 * @LastEditTime: 2020-09-03 22:46:56
 * @LastEditors: xuwei
 * @Description:
 */
let styles = require("./video.css");

// 接口规范参数
interface IVideo {
  url: string;
  elem: string | HTMLElement;
  width?: string;
  height?: string;
  autoplay?: boolean;
}

// 利用接口规范行为
interface Icomponnet {
  tempContainer: HTMLElement;
  init: () => void;
  template: () => void;
  handle: () => void;
}

function video(options: IVideo) {
  return new Video(options);
}

class Video implements Icomponnet {
  tempContainer;
  constructor(private settings: IVideo) {
    this.settings = Object.assign(
      {
        width: "100%",
        height: "100%",
        autoplay: false,
      },
      this.settings
    );
    this.init();
  }

  init() {
    this.template();
    this.handle();
  }

  template() {
    this.tempContainer = document.createElement("div");
    this.tempContainer.className = styles.video;
    this.tempContainer.style.width = this.settings.width;
    this.tempContainer.style.height = this.settings.height;
    this.tempContainer.innerHTML = `
      <video class="${styles["video-content"]}" src="${this.settings.url}"></video>
      <div class="${styles["video-controls"]}">
        <div class="${styles["video-progress"]}">
          <div class="${styles["video-progress-now"]}"></div>
          <div class="${styles["video-progress-suc"]}"></div>
          <div class="${styles["video-progress-bar"]}"></div>
        </div>
        <div class="${styles["video-play"]}">
          <i class="iconfont icon-bofang"></i>
        </div>
        <div class="${styles["video-time"]}">
          <span>00:00</span> / <span>00:00</span>
        </div>
        <div class="${styles["video-full"]}">
          <i class="iconfont icon-quanpingzuidahua"></i>
        </div>
        <div class="${styles["video-volume"]}">
          <i class="iconfont icon-yinliang"></i>
          <div class="${styles["video-volprogress"]}">
            <div class="${styles["video-volprogress-now"]}"></div>
            <div class="${styles["video-volprogress-bar"]}"></div>
          </div>
        </div>
      </div> 
    `;

    // 将 video 元素加到传入的 popup 组件上
    if (typeof this.settings.elem === "object") {
      this.settings.elem.appendChild(this.tempContainer);
    } else {
      document
        .querySelector(`${this.settings.elem}`)
        .appendChild(this.tempContainer);
    }
  }

  handle() {
    let timer;
    let videoContent: HTMLVideoElement = this.tempContainer.querySelector(
      `.${styles["video-content"]}`
    );
    let videoControls = this.tempContainer.querySelector(
      `.${styles["video-controls"]}`
    );
    let videoPlay = this.tempContainer.querySelector(
      `.${styles["video-play"]} i`
    );

    let videoTimes = this.tempContainer.querySelectorAll(
      `.${styles["video-time"]} span`
    );

    let videoFull = this.tempContainer.querySelector(
      `.${styles["video-full"]} i`
    );

    let videoProgress = this.tempContainer.querySelectorAll(
      `.${styles["video-progress"]} div`
    );
    let videoVolProgress = this.tempContainer.querySelectorAll(
      `.${styles["video-volprogress"]} div`
    );

    videoContent.volume = 0.5;

    if (this.settings.autoplay) {
      //是否自动播放
      timer = setInterval(playing, 1000);
      videoContent.play();
    }

    this.tempContainer.addEventListener("mouseenter", function () {
      //mouseenter 不会让子元素触发，不会有事件冒泡行为
      videoControls.style.bottom = 0;
    });
    this.tempContainer.addEventListener("mouseleave", function () {
      videoControls.style.bottom = "-50px";
    });

    // 视频加载完毕
    videoContent.addEventListener("canplay", () => {
      // videoPlay.className = videoPlay.className;  //加载时不应该改变 className
      videoPlay.style.fontSize =
        videoPlay.className === "icon icon-bofang" ? "20px" : "24px";
      videoTimes[1].innerHTML = formatTime(videoContent.duration);
    });

    // 播放事件
    videoContent.addEventListener("play", () => {
      videoPlay.style.fontSize = "24px";
      videoPlay.className = "iconfont icon-zanting";
      timer = setInterval(playing, 1000);
    });

    // 暂停事件
    videoContent.addEventListener("pause", () => {
      videoPlay.style.fontSize = "20px";
      videoPlay.className = "iconfont icon-bofang";
      clearInterval(timer);
    });

    // 点击事件
    videoPlay.addEventListener("click", () => {
      if (videoContent.paused) {
        videoContent.play();
      } else {
        videoContent.pause();
      }
    });

    // 全屏
    videoFull.addEventListener("click", () => {
      videoContent.requestFullscreen(); //通过给 videoContent 添加类型，可以得到 api 提示，TS 真的香～
    });

    videoProgress[2].addEventListener("mousedown", function (ev: MouseEvent) {
      let downX = ev.pageX; //按下点的坐标
      let downL = this.offsetLeft; //  到当前有定位的组件节点的左偏移
      document.onmousemove = (ev: MouseEvent) => {
        let scale =
          (ev.pageX - downX + downL + 8) / this.parentNode.offsetWidth;
        scale < 0 && (scale = 0);
        scale > 1 && (scale = 1);
        videoProgress[0].style.width = scale * 100 + "%";
        videoProgress[1].style.width = scale * 100 + "%";
        this.style.left = scale * 100 + "%";

        videoContent.currentTime = scale * videoContent.duration;
      };
      document.onmouseup = () => {
        console.info("抬起时", videoPlay.className);
        document.onmousemove = document.onmouseup = null;
      };
      ev.preventDefault();

      // Todo 拖动的时候暂停/播放图标状态变化有问题
    });

    videoVolProgress[1].addEventListener("mousedown", function (
      ev: MouseEvent
    ) {
      let downX = ev.pageX; //按下点的坐标
      let downL = this.offsetLeft; //  到当前有定位的组件节点的左偏移
      document.onmousemove = (ev: MouseEvent) => {
        let scale =
          (ev.pageX - downX + downL + 8) / this.parentNode.offsetWidth;
        scale < 0 && (scale = 0);
        scale > 1 && (scale = 1);
        videoVolProgress[0].style.width = scale * 100 + "%";
        this.style.left = scale * 100 + "%";
        videoContent.volume = scale;
      };
      document.onmouseup = () => {
        console.info("抬起时", videoPlay.className);
        document.onmousemove = document.onmouseup = null;
      };
      ev.preventDefault();

      // Todo 拖动的时候暂停/播放图标状态变化有问题
    });

    //播放中
    function playing() {
      let scale = videoContent.currentTime / videoContent.duration;
      let scaleSuc = videoContent.buffered.end(0) / videoContent.duration;
      // videoProgress[0].style.width = formatTime(videoContent.currentTime);
      videoTimes[0].innerHTML = formatTime(videoContent.currentTime);
      videoProgress[0].style.width = scale * 100 + "%";
      videoProgress[1].style.width = scaleSuc * 100 + "%";
      videoProgress[2].style.left = scale * 100 + "%";
    }

    function formatTime(number: number): string {
      number = Math.round(number);
      let min = Math.floor(number / 60);
      let sec = Math.floor(number % 60);
      return setZero(min) + ":" + setZero(sec);
    }

    function setZero(number: number): string {
      if (number < 10) {
        return "0" + number;
      }
      return "" + number;
    }
  }
}

export default video;
