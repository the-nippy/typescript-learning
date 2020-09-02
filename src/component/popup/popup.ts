/*
 * @Author: xuwei
 * @Date: 2020-08-29 17:16:20
 * @LastEditTime: 2020-08-30 17:09:27
 * @LastEditors: xuwei
 * @Description:
 */

// import "./popup.css";
const styles = require("./popup.css"); //模块化CSS
// import styles from "./popup.css";

//  利用接口规范参数
interface Ipopup {
  width?: string;
  height?: string;
  title?: string;
  postion?: string;
  mask?: boolean; //是否有遮罩层
  content?: (content: HTMLElement) => void; // 自定义的内容
}

// 利用接口规范行为
interface Icomponnet {
  tempContainer: HTMLElement;
  init: () => void;
  template: () => void;
  handle: () => void;
}

function popup(options: Ipopup) {
  return new Popup(options);
}

class Popup implements Icomponnet {
  tempContainer;
  mask;
  constructor(private settings: Ipopup) {
    this.settings = Object.assign(
      {
        width: "100%",
        height: "100%",
        title: "",
        position: "center",
        mask: true,
        content: function () {},
      },
      this.settings
    );
    this.init();
  }
  // 初始化
  init() {
    this.template();
    this.settings.mask && this.createMask();
    this.handle();
    this.contentCallBack();
  }
  // 创建模版
  template() {
    this.tempContainer = document.createElement("div");
    this.tempContainer.style.width = this.settings.width;
    this.tempContainer.style.height = this.settings.height;
    this.tempContainer.className = styles.popup;

    this.tempContainer.innerHTML = `
        <div class="${styles["popup-title"]}">
          <h3>${this.settings.title}<h3>
          <i class="iconfont icon-guanbi"></i>
        </div>
        <div class="${styles["popup-content"]}"></div>
      `;
    document.body.appendChild(this.tempContainer);
    if (this.settings.postion === "left") {
      this.tempContainer.style.left = 0 + "px";
      this.tempContainer.style.top =
        window.innerHeight - this.tempContainer.offsetHeight + "px";
    } else if (this.settings.postion === "right") {
      this.tempContainer.style.right = 0 + "px";
      this.tempContainer.style.top =
        window.innerHeight - this.tempContainer.offsetHeight + "px";
    } else {
      this.tempContainer.style.left =
        (window.innerWidth - this.tempContainer.offsetWidth) / 2 + "px";
      this.tempContainer.style.top =
        (window.innerHeight - this.tempContainer.offsetHeight) / 2 + "px";
    }
  }
  // 事件操作
  handle() {
    let popupClose = this.tempContainer.querySelector(
      `.${styles["popup-title"]} i`
    );
    popupClose.addEventListener("click", () => {
      document.body.removeChild(this.tempContainer);
      this.settings.mask && document.body.removeChild(this.mask);
    });
  }

  // 创建mask
  createMask() {
    this.mask = document.createElement("div");
    this.mask.className = styles.mask;
    this.mask.style.width = "100%";
    this.mask.style.height = document.body.offsetHeight + "px";
    document.body.appendChild(this.mask);
  }

  contentCallBack() {
    let popupContent = this.tempContainer.querySelector(
      `.${styles["popup-content"]}`
    );
    this.settings.content(popupContent);
  }
}

export default popup;
