import React, { useReducer, useContext, useState } from "react";
import reducer from "./reducer";
import axios from "axios";

import {
  DISPLAY_ALERT,
  CLEAR_ALERT,
  SETUP_USER_BEGIN,
  SETUP_USER_SUCCESS,
  SETUP_USER_ERROR,
  TOGGLE_SIDEBAR,
  LOGOUT_USER,
  UPDATE_USER_BEGIN,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_ERROR,
  HANDLE_CHANGE,
  CLEAR_VALUES,
  CREATE_TODO_BEGIN,
  CREATE_TODO_SUCCESS,
  CREATE_TODO_ERROR,
  GET_TODOS_BEGIN,
  GET_TODOS_SUCCESS,
  SET_EDIT_TODO,
  DELETE_TODO_BEGIN,
  EDIT_TODO_BEGIN,
  EDIT_TODO_SUCCESS,
  EDIT_TODO_ERROR,
  SHOW_STATS_BEGIN,
  SHOW_STATS_SUCCESS,
  CLEAR_FILTERS
} from "./actions";

const token = localStorage.getItem("token");
const user = localStorage.getItem("user");
const isAdmin = localStorage.getItem('user')

const initialState = {
  isLoading: false,
  showAlert: false,
  alertText: "",
  alertType: "",
  user: user ? JSON.parse(user) : null,
  token: token,
  title: "",
  message: "",
  category: [],
  showSidebar: false,
  isEditing: false,
  editTodoId: "",
  statusOptions: ["done", "pending", "scheduled"],
  status: "pending",
  todos: [],
  todoTypeOption: ["done", "pending", "scheduled"],
  todoType: 'done',
  totaltodos: 0,
  numOfPages: 1,
  page: 1,
  stats: {},
  monthlyApplications: [],
  search: "",
  searchStatus: 'all',
  searchType: "all",
  sort: "latest",
  sortOptions: ['latest', "oldest", 'a-z', 'z-a']
};

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [myUsers, setMyUsers] = useState("");
  const [myTodos, setMyTodos] = useState([]);

  // axios
  const authFetch = axios.create({
    baseURL: "/api/v1",
  });
  // request

  authFetch.interceptors.request.use(
    (config) => {
      config.headers.common["Authorization"] = `Bearer ${state.token}`;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  // response

  authFetch.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      // console.log(error.response)
      if (error.response.status === 401) {
        logoutUser();
      }
      return Promise.reject(error);
    }
  );

  const displayAlert = () => {
    dispatch({ type: DISPLAY_ALERT });
    clearAlert();
  };

  const clearAlert = () => {
    setTimeout(() => {
      dispatch({ type: CLEAR_ALERT });
    }, 3000);
  };

  const addUserToLocalStorage = ({ user, token }) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
  };

  const removeUserFromLocalStorage = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const setupUser = async ({ currentUser, endPoint, alertText }) => {
    dispatch({ type: SETUP_USER_BEGIN });
    try {
      const { data } = await axios.post(
        `/api/v1/auth/${endPoint}`,
        currentUser
      );

      const { user, token } = data;
      dispatch({
        type: SETUP_USER_SUCCESS,
        payload: { user, token, alertText },
      });
      addUserToLocalStorage({ user, token });
    } catch (error) {
      dispatch({
        type: SETUP_USER_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };

  const toggleSidebar = () => {
    dispatch({ type: TOGGLE_SIDEBAR });
  };

  const logoutUser = () => {
    dispatch({ type: LOGOUT_USER });
    removeUserFromLocalStorage();
  };

  const updateUser = async (currentUser) => {
    dispatch({ type: UPDATE_USER_BEGIN });
    try {
      const { data } = await authFetch.patch("/auth/updateUser", currentUser);

      const { user, token } = data;

      dispatch({
        type: UPDATE_USER_SUCCESS,
        payload: { user, token },
      });
      addUserToLocalStorage({ user, token });
    } catch (error) {
      if (error.response.status !== 401) {
        dispatch({
          type: UPDATE_USER_ERROR,
          payload: { msg: error.response.data.msg },
        });
      }
    }
    clearAlert();
  };

  const handleChange = ({ name, value }) => {
    dispatch({ type: HANDLE_CHANGE, payload: { name, value } });
  };

  const clearValues = () => {
    dispatch({ type: CLEAR_VALUES });
  };

  const createTodo = async () => {
    dispatch({ type: CREATE_TODO_BEGIN });
    console.log("Working");
    try {
      const { title, message, category, status } = state;
      await authFetch.post("/todos", {
        title,
        message,
        status,
        category,
      });
      dispatch({ type: CREATE_TODO_SUCCESS });
      dispatch({ type: CLEAR_VALUES });
    } catch (error) {
      if (error.response.status === 401) return;
      dispatch({
        type: CREATE_TODO_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };


  const getTodos = async () => {

    const {search, category, sort} = state
    let url = `/todos?category=${category}&sort=${sort}`
    if (search) {
      url = url + `&search=${search}`
    }

    dispatch({ type: GET_TODOS_BEGIN });
    try {
      const { data } = await authFetch(url);
      const { todos, totalTodos } = data;
      dispatch({
        type: GET_TODOS_SUCCESS,
        payload: {
          todos,
          totalTodos
        },
      });
    } catch (error) {
      logoutUser();
    }
    clearAlert();
  };

  const getUsers = async () => {
    try {
      const user = await authFetch("/auth/users");
      setMyUsers(user);
    } catch (error) {
      console.log(error.response);
      // if(error.response === 403) {
      //   console.log("Admin Only");
      // }
    }
  };

  const allTodos = async () => {
    const todos = await authFetch("/todos/allTodos");
    setMyTodos(todos);
  };


  const setEditTodo = (id) => {
    dispatch({ type: SET_EDIT_TODO, payload: { id } });
  };

  const editTodo = async () => {
    dispatch({ type: EDIT_TODO_BEGIN });

    try {
      const { title, message, status, category } = state;
      await authFetch.patch(`/todos/${state.editTodoId}`, {
        title,
        message,
        status,
        category
      });
      dispatch({ type: EDIT_TODO_SUCCESS });
      dispatch({ type: CLEAR_VALUES });
    } catch (error) {
      if (error.response.status === 401) return;
      dispatch({
        type: EDIT_TODO_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };

  const deleteTodo = async (todoId) => {
    dispatch({ type: DELETE_TODO_BEGIN });
    try {
      await authFetch.delete(`/todos/${todoId}`);
      getTodos();
    } catch (error) {
      logoutUser();
    }
  };

  const showStats = async () => {
    dispatch({ type: SHOW_STATS_BEGIN });
    try {
      const { data } = await authFetch("/todos/stats");
      dispatch({
        type: SHOW_STATS_SUCCESS,
        payload: {
          stats: data.defaultStats,
          monthlyApplications: data.monthlyApplications,
        },
      });
    } catch (error) {
      logoutUser();
    }
    clearAlert();
  };

  const clearFilters = () => {
    dispatch({ type: CLEAR_FILTERS })
  }

  return (
    <AppContext.Provider
      value={{
        ...state,
        displayAlert,
        clearFilters,
        setupUser,
        toggleSidebar,
        logoutUser,
        updateUser,
        handleChange,
        clearValues,
        createTodo,
        getTodos,
        setEditTodo,
        deleteTodo,
        editTodo,
        showStats,
        getUsers,
        myUsers,
        allTodos,
        myTodos,
        isAdmin,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => {
  return useContext(AppContext);
};

export { AppProvider, initialState, useAppContext };
