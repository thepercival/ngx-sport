export default {
    input: 'tmp/esm5/voetbaljs.js',
    output: {
        file: 'dist/bundles/voetbaljs.umd.js',
        format: 'umd'
    },
    name: 'voetbaljs',
    globals: {
        '@angular/core': 'ng.core',
        '@angular/common': 'ng.common',
        '@angular/common/http': 'ng.common.http'
    }
};