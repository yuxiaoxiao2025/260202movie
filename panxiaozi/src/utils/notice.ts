import dayjs from "dayjs";

import "dayjs/locale/zh-cn"; // 导入本地化语言
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.locale("zh-cn");
dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.tz.setDefault("Asia/Shanghai");

export const notice = async (msg: string) => {
  if (!process.env.NOTICE_API) {
    return;
  }
  const timeStr = dayjs().tz().format("YYYY-MM-DD HH:mm:ss");
  await fetch(process.env.NOTICE_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: "转存失败",
      subtitle: "转存失败",
      body: `${msg}\n时间：${timeStr}`,
    }),
  });
};
