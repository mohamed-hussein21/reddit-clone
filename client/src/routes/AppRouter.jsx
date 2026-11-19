import { Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ProtectedRoute from './ProtectedRoute';
import Home from '../pages/Home';
import Popular from '../pages/Popular';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Community from '../pages/Community';
import CreateCommunity from '../pages/CreateCommunity';
import PostDetails from '../pages/PostDetails';
import CreatePost from '../pages/CreatePost';
import Profile from '../pages/Profile';
import EditProfile from '../pages/EditProfile';
import Search from '../pages/Search';
import Chat from '../pages/Chat';
import NotFound from '../pages/NotFound';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/popular" element={<Popular />} />
        <Route path="/r/:name" element={<Community />} />
        <Route path="/r/:name/comments/:postId" element={<PostDetails />} />
        <Route path="/user/:username" element={<Profile />} />
        <Route path="/search" element={<Search />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/submit" element={<CreatePost />} />
          <Route path="/r/:name/submit" element={<CreatePost />} />
          <Route path="/communities/create" element={<CreateCommunity />} />
          <Route path="/settings/profile" element={<EditProfile />} />
          <Route path="/chat" element={<Chat />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
