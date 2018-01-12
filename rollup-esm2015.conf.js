export default {
    input: 'tmp/esm2015/ngx-sport.js',
    output: {
        file: 'dist/esm2015/ngx-sport.js',
        format: 'es'
    },
    external: ['@angular/common/http', '@angular/core', 'rxjs/Rx'] // <-- suppresses the warning
};