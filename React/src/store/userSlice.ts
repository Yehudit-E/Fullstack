import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { User, UserDto } from "../models/User";
import { UserLogin, UserRegister } from "../models/UserAuth";
import api from "../interceptor/api";
import { BASE_URL } from "../Global";
let userEmpty: UserDto = {
    id: 0,
    userName: "",
    email: "",
    password: "",
    create_at: "",
}
let baseUrl = BASE_URL;
let userWithNewName;
export const load = createAsyncThunk('user/load',
    async (id: string, thunkAPI) => {

        try {
            const response = await api.get('/User/full/' + id, {
                validateStatus: (status) => status >= 200 && status < 300 // רק 2xx נחשב להצלחה
            });

            return response.data;
        } catch (e: any) {
            if (e.response) {
                console.log("Error response status:", e.response.status);
                console.log("Error response data:", e.response.data);
            } else {
                console.log("Network error:", e.message);
            }
            alert("אירעה שגיאה: " + e.message);
            return thunkAPI.rejectWithValue(e.message);
        }
    }
);
export const loginUser = createAsyncThunk('user/login',
    async (user: UserLogin, thunkAPI) => {
        try {
            console.log("Logging user:", user);
            const response = await axios.post(baseUrl + '/api/Auth/login', user)
            console.log("Login response:", response.data.user);
            console.log(response.data)
            localStorage.setItem("authToken", response.data.token);
            return response.data.user;
        }
        catch (e: any) {
            // alert(e.message)
            return thunkAPI.rejectWithValue(e.ErrorMessage)///
        }
    }
)

export const registerUser = createAsyncThunk('user/register',

    async (user: UserRegister, thunkAPI) => {
        try {
            console.log("Registering user:", user);
            const response = await axios.post(baseUrl + '/api/Auth/register', user);
            console.log("Register response:", response.data.user);
            localStorage.setItem("authToken", response.data.token);
            return response.data.user;
        }
        catch (e: any) {
            alert(e.message);
            console.log(e);
            return thunkAPI.rejectWithValue(e.ErrorMessage);
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: userEmpty, //
        status: 'idle',
        authState: false
    },
    reducers: {
        logout: (state) => {
            state.user = userEmpty;
            state.authState = false;
            state.status = 'idle';
            localStorage.removeItem("authToken");
        },
        updateUser: (state, action) => {
            console.log(action.payload);
            state.user = action.payload;
        },

    },
    extraReducers: (builder) => {
        builder
            .addCase(load.pending, (state) => {
                state.status = "loading";
            })
            // .addCase(fetchUserById.fulfilled, (state, action) => {
            //     state.status = "succeeded";
            //     state.user = action.payload;
            //     state.authState = true;
            // })
            // .addCase(fetchUserById.rejected, (state) => {
            //     state.status = "failed";
            //     state.authState = false;
            // })
            .addCase(load.fulfilled,
                (state, action) => {
                    state.user = action.payload;
                    state.authState = true;
                    state.status = "succeeded";
                }
            )
            .addCase(load.rejected,
                (state) => {
                    state.user = userEmpty;
                    state.status = "failed";
                    state.authState = false;
                    console.log("Failed");
                }
            )
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loginUser.fulfilled,
                (state, action) => {
                    console.log("action login success" + action);
                    state.status = 'succeeded';
                    state.user = action.payload
                    console.log("stateUser=" + state)
                    state.authState = true
                }
            )
            .addCase(loginUser.rejected,
                (state, action) => {
                    console.log(action);
                    state.status = 'failed';
                }
            )
            .addCase(registerUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(registerUser.fulfilled,
                (state, action) => {
                    console.log("action register success" + action);
                    state.status = 'succeeded';
                    state.user = action.payload
                    console.log("stateUser=" + state)
                    state.authState = true
                }
            )
            .addCase(registerUser.rejected,
                (state, action) => {
                    console.log(action);
                    state.status = 'failed';
                    console.log('failed')
                }
            );
    }
});

export const { logout, updateUser } = userSlice.actions;
export default userSlice;

