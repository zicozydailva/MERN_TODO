import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Register, Landing, Error, ProtectedRoute } from "./pages";
import User from "./components/user/User";
import UserList from "./components/userList/UserList";
import Todo from "./components/todo/Todo";

import {
  AllJobs,
  Profile,
  SharedLayout,
  Stats,
  AddJob,
} from "./pages/dashboard";
import SuperUser from "./pages/dashboard/SuperUser";
import SuperShared from "./pages/dashboard/SuperShared";
import NotAdmin from "./components/NotAdmin";
import TodoList from "./components/todoList/TodoList";
import Admin from "./pages/dashboard/Admin";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <SharedLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Stats />} />
          <Route path="all-task" element={<AllJobs />} />
          <Route path="create-task" element={<AddJob />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route
          path="/"
          element={
            <SuperUser>
              <SuperShared />
            </SuperUser>
          }
        >
          <Route path="admin" element={<Admin />} />
          <Route path="users" element={<UserList />} />
          <Route path="users/:id" element={<User />} />
          <Route path="todos" element={<TodoList />} />
          <Route path="todos/:id" element={<Todo />} />
        </Route>
        <Route path="/notadmin" element={<NotAdmin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
