export default {
    input: 'tmp/esm5/ngx-sport.js',
    output: {
        file: 'dist/esm5/ngx-sport.js',
        format: 'es'
    },
    external: ['@angular/common/http', '@angular/core', 'rxjs/Rx'] // <-- suppresses the warning
}