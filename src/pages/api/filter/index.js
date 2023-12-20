import WithTokenn from "../../../configs/axios/withToken";
import Axios from "../../../configs/axios";

export default function useFilter() {

  const GetScoreFilterAPI = async (data) => {
    let uData = "";
    await Axios
      .get(
        `${process.env.NEXT_PUBLIC_BASE_API_HOST}/filter/get`,
        data
      )
      .then((res) => {
        uData = {
          data: res.data,
          status: res.status,
          message: res.message,
        };
        return uData;
      })
      .catch((err) => {
        return err.response;
      });
    return uData;
  };


  const PostScoreFilterAPI = async (data) => {
    let config = WithTokenn(process.env.NEXT_PUBLIC_API_SECRET);
    let uData = "";
    await config
      .post(
        `${process.env.NEXT_PUBLIC_BASE_API_HOST}/api/filter/post`,
        data
      )
      .then((res) => {
        uData = {
          data: res.data,
          status: res.status,
          message: res.message,
        };
        return uData;
      })
      .catch((err) => {
        return err.response;
      });
    return uData;
  };


  return {
    GetScoreFilterAPI,
    PostScoreFilterAPI,
  };
}