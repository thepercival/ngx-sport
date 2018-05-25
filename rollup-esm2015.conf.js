export default {
    input: 'tmp/esm2015/ngx-sport.js',
    output: {
        file: 'dist/esm2015/ngx-sport.js',
        format: 'es'
    },
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