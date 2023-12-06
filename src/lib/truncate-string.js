export function truncateString(str, maxLength, strReplace) {
    if (str?.length > maxLength) {
      return str.substring(0, maxLength) + strReplace;
    }
    return str;
  }