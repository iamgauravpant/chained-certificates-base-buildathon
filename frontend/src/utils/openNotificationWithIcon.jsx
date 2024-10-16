import { notification } from "antd";

export const openNotificationWithIcon = (type, msg, descriptiond) => {
    notification[type]({
      message: msg,
      description: descriptiond,
      duration:2
    });
};