/*
 * @Author: xuwei
 * @Date: 2020-08-29 12:10:34
 * @LastEditTime: 2020-09-02 23:30:35
 * @LastEditors: xuwei
 * @Description:
 */
import "./main.css";
import popup from "./component/popup/popup";
import video from "./component/video/video";

let list = document.querySelectorAll("#list li");

let a: number = 123; //类型注解   不写的时候在赋值的时候会有类型推断

for (let i = 0; i < list.length; i++) {
  list[i].addEventListener("click", function () {
    let url = this.dataset.url;
    let title = this.dataset.title;
    // console.log(url, title);
    popup({
      width: "880px",
      height: "556px",
      title: this.dataset.title,
      postion: "center",
      mask: true,
      content(ele) {
        console.info("e", ele);
        video({
          url,
          elem: ele,
        });
      },
    });
  });
}
