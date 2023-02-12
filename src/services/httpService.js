import axios from "axios";
import { toast } from "react-toastify";

let AUTH_TOKEN = localStorage.getItem("token");

axios.defaults.headers.common["x-auth-token"] = AUTH_TOKEN;
axios.defaults.headers.post['Content-Type'] = 'application/json';

axios.interceptors.response.use(null, function (error) {
    const expectedError = error.response &&
        error.response.status >= 400 &&
        error.response.status < 500;

    if (!expectedError) {
        return toast.error(error.response.data, { position: toast.POSITION.TOP_CENTER });
    }

    return toast.error(error.response.data, { position: toast.POSITION.TOP_CENTER });
});

export default {
    axios: axios,
    get: axios.get,
    post: axios.post,
    put: axios.put,
    delete: axios.delete
}