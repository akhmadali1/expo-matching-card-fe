import WithTokenn from "../../../configs/axios/withToken";
import Axios from "../../../configs/axios";

export default function useScore() {

  const GetScoreAPI = async (data) => {
    let uData = "";
    await Axios
      .get(
        `${process.env.NEXT_PUBLIC_BASE_API_HOST}/score/get`,
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


  const PostScoreAPI = async (data) => {
    let config = WithTokenn(process.env.NEXT_PUBLIC_API_SECRET);
    let uData = "";
    await config
      .post(
        `${process.env.NEXT_PUBLIC_BASE_API_HOST}/api/score/post`,
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
      GetScoreAPI,
      PostScoreAPI,
  };
}