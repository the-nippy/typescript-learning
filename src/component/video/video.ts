/*
 * @Author: xuwei
 * @Date: 2020-08-30 17:05:28
 * @LastEditTime: 2020-09-02 23:56:34
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
    let videoContent = this.tempContainer.querySelector(
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

    // 视频加载完毕
    videoContent.addEventListener("canplay", () => {
      videoPlay.className = "iconfont icon-bofang";
      videoTimes[1].innerHTML = formatTime(videoContent.duration);
    });

    // 播放事件
    videoContent.addEventListener("play", () => {
      videoPlay.className = "iconfont icon-zanting";
      videoPlay.style.fontSize = "24px";
      timer = setInterval(playing, 1000);
    });

    // 暂停事件
    videoContent.addEventListener("pause", () => {
      videoPlay.className = "iconfont icon-bofang";
      videoPlay.style.fontSize = "20px";
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

    function playing() {
      //播放中
      videoTimes[0].innerHTML = formatTime(videoContent.currentTime);
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
