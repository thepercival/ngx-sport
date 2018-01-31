export default {
    input: 'tmp/esm5/ngx-sport.js',
    output: {
        file: 'dist/esm5/ngx-sport.js',
        format: 'es'
    },
    globals: {
        '@angular/common/http': 'ng.common.http',
        '@angular/core': 'ng.core',
        '@angular/router': 'ng.router',
        'rxjs/Observable': 'rxjs.observable',
        'rxjs/Observer': 'rxjs.observer',
        'rxjs/operators/map': 'rxjs.map',
        'rxjs/operators/catchError': 'rxjs.catchError',
        'rxjs/add/observable/throw': 'rxjs.throw'
    },
    external: [
        '@angular/common/http',
        '@angular/core',
        '@angular/router',
        'rxjs/Observable',
        'rxjs/Observer',
        'rxjs/operators/map',
        'rxjs/operators/catchError',
        'rxjs/add/observable/throw'
    ]
}