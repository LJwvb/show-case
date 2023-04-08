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

// 去除密码和电话号码
function removePassword(data) {
  const returnData = JSON.parse(
    JSON.stringify(data, (key, value) => {
      if (key === 'password' || key === 'phone') {
        return undefined;
      }
      return value;
    }),
  );
  return returnData;
}
// 根据subjectID来获取subjectName
function getSubjectName(subjectID) {
  let subjectName = '';
  switch (subjectID) {
    case 0:
      subjectName = 'JavaScript';
      break;
    case 1:
      subjectName = 'CSS';
      break;
    case 2:
      subjectName = 'HTML';
      break;
    case 3:
      subjectName = 'Angular';
      break;
    case 4:
      subjectName = 'React';
      break;
    case 5:
      subjectName = 'Vue';
      break;
    case 6:
      subjectName = 'Node';
      break;
    case 7:
      subjectName = 'Webpack';
      break;
    case 8:
      subjectName = 'TypeScript';
      break;
    case 9:
      subjectName = 'Git';
      break;
    case 10:
      subjectName = 'HTTP';
      break;
    case 11:
      subjectName = '浏览器';
      break;
    default:
      subjectName = '其他';
  }
  return subjectName;
}
// 根据catalogID来获取catalogName
function getCatalogName(catalogID) {
  let catalogName = '';
  switch (catalogID) {
    case 0:
      catalogName = '最新';
      break;
    case 1:
      catalogName = '最热';
      break;
    case 2:
      catalogName = '精选';
      break;
    default:
      catalogName = '其他';
  }
  return catalogName;
}
export const subjectList = [
  {
    content: 'JavaScript',
    subjectID: 0,
  },
  {
    content: 'CSS',
    subjectID: 1,
  },
  {
    content: 'HTML',
    subjectID: 2,
  },
  {
    content: 'Angular',
    subjectID: 3,
  },
  {
    content: 'React',
    subjectID: 4,
  },
  {
    content: 'Vue',
    subjectID: 5,
  },
  {
    content: 'Node',
    subjectID: 6,
  },
  {
    content: 'Webpack',
    subjectID: 7,
  },
  {
    content: 'TypeScript',
    subjectID: 8,
  },
  {
    content: 'Git',
    subjectID: 9,
  },
  {
    content: 'HTTP',
    subjectID: 10,
  },
  {
    content: '浏览器',
    subjectID: 11,
  },
  {
    content: '其他',
    subjectID: 12,
  },
];

export { getNowFormatDate, removePassword, getSubjectName, getCatalogName };
