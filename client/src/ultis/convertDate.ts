export const convertDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();
  const hour = date.getHours();
  const min = date.getMinutes();
  return `${hour}:${min.toString().length > 1 ? "" : "0"}${min} ${
    day.toString().length > 1 ? "" : "0"
  }${day}/${month.toString().length > 1 ? "" : "0"}${month}/${year}`;
};
