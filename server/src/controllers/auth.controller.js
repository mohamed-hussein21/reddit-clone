import * as authService from '../services/auth.service.js';

export async function register(req, res) {
    const { username, email, password } = req.body;

    const result = await authService.register(
        username,
        email,
        password
    );

    res.status(201).json(result);
}

export async function login(req, res) {
    const { email, password } = req.body;

    const result = await authService.login(email, password);

    res.json(result);
}

export function logout(req, res) {
    res.json({
        message: 'Logged out successfully'
    });
}

export function getMe(req, res) {
    res.json(authService.userData(req.user));
}