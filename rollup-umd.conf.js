export default {
    input: 'tmp/esm5/ngx-sport.js',
    output: {
        file: 'dist/bundles/ngx-sport.umd.js',
        format: 'umd'
    },
    name: 'ngx-sport',
    globals: {
        '@angular/core': 'ng.core',
        '@angular/common': 'ng.common',
        '@angular/common/http': 'ng.common.http'
    }
};