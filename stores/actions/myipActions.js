import { get } from 'lodash'
import {
  MYIP_GET,
  MYIP_GET_ERROR,
  MYIP_GET_SUCCESS
} from "../actionTypes";

import { apiCall } from "../../services/request";

export const myIp = () => async dispatch => {
  const dataReq = {
    method: "GET",
    url: "https://ip4.seeip.org/json",
  };
  dispatch({ type: MYIP_GET });
  try {
    const res = await dispatch(apiCall(dataReq));
    if ( get(res, 'status') == 200 ) {
      dispatch({
        type: MYIP_GET_SUCCESS,
        payload: {
          ip: get(res, 'data.ip')
        }
      });
      return res;
    }else{
      dispatch({ type: MYIP_GET_ERROR });
    }
    return res;
  } catch (error){
    dispatch({ type: MYIP_GET_ERROR });
    return error;
  }
}
