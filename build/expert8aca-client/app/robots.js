"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function robots() {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/private/',
        },
        sitemap: 'https://expert8academy.com/sitemap.xml',
    };
}
exports.default = robots;
