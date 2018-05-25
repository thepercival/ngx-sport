export default {
    input: 'tmp/esm5/ngx-sport.js',
    output: {
        file: 'dist/bundles/ngx-sport.umd.js',
        format: 'umd'
    },
    name: 'ngx-sport',
    globals: {
        '@angular/common/http': 'ng.common.http',
        '@angular/core': 'ng.core',
        '@angular/router': 'ng.router',
        'rxjs': 'rxjs',
        'rxjs/operators': 'rxjs'
    },
    external: [
        '@angular/common/http',
        '@angular/core',
        '@angular/router',
        'rxjs',
        'rxjs/operators'
    ]
};