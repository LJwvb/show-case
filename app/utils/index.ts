// 获取当前具体时间
function getNowFormatDate() {
  const date = new Date();
  const separator1 = '-';
  const separator2 = ':';
  let month = date.getMonth() + 1;
  let strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = Number(`0${month}`);
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = Number(`0${strDate}`);
  }
  const currentDate =
    date.getFullYear() +
    separator1 +
    month +
    separator2 +
    strDate +
    ' ' +
    date.getHours() +
    separator1 +
    date.getMinutes() +
    separator2 +
    date.getSeconds();
  return currentDate;
}
export { getNowFormatDate };
