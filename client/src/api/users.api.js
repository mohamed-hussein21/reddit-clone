import { request } from './auth.api';

const API_URL =
    import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export function getProfile(username) {
    return request('/users/' + encodeURIComponent(username));
}

export function updateProfile(displayName, bio) {
    return request('/users/me', {
        method: 'PATCH',
        body: JSON.stringify({ displayName, bio })
    });
}

export function uploadAvatar(file) {
    const formData = new FormData();
    formData.append('avatar', file);

    return request('/users/me/avatar', {
        method: 'POST',
        body: formData
    });
}

export function getUserPosts(username) {
    return request('/users/' + encodeURIComponent(username) + '/posts');
}

export function getUserComments(username) {
    return request('/users/' + encodeURIComponent(username) + '/comments');
}

export function imageUrl(path) {
    if (!path) {
        return '';
    }

    return new URL(path, API_URL).href;
}