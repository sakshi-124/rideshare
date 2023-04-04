/**
 * Author : Sakshi Chaitanya Vaidya
 * Banner No : B00917159
 * Email: sakshi.vaidya@dal.ca
 */

import axios from "axios";

const axiosApi = axios.create({
  baseURL: "https://7przixh9me.execute-api.us-east-1.amazonaws.com/testRideShare",
  //baseURL: "http://localhost:3000/",

});

export default axiosApi;